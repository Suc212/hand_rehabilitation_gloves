import { execFileSync, spawn } from "node:child_process"
import { mkdtempSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import { join } from "node:path"

const require = createRequire(import.meta.url)
const environment = { ...process.env }
let certificateDirectory
let certificateFile

function cleanup() {
  if (certificateFile) {
    unlinkSync(certificateFile)
    certificateFile = undefined
  }
  if (certificateDirectory) {
    rmdirSync(certificateDirectory)
    certificateDirectory = undefined
  }
}

// Node 20's bundled CA store does not include certificates trusted locally by
// Windows (for example, an HTTPS-scanning antivirus root). Supply those public
// roots before Node starts; both fetch and Firestore's gRPC client use them.
if (process.platform === "win32") {
  try {
    const roots = execFileSync("powershell.exe", [
      "-NoProfile", "-NonInteractive", "-Command",
      "$ErrorActionPreference = 'Stop'; Get-ChildItem Cert:\\CurrentUser\\Root,Cert:\\LocalMachine\\Root | Sort-Object Thumbprint -Unique | ForEach-Object { '-----BEGIN CERTIFICATE-----'; [Convert]::ToBase64String($_.RawData, [Base64FormattingOptions]::InsertLineBreaks); '-----END CERTIFICATE-----' }",
    ], { encoding: "utf8", windowsHide: true, timeout: 10000 })
    if (!roots.includes("-----BEGIN CERTIFICATE-----")) throw new Error("No trusted roots found")
    const additionalRoots = environment.NODE_EXTRA_CA_CERTS
      ? readFileSync(environment.NODE_EXTRA_CA_CERTS, "utf8")
      : ""
    certificateDirectory = mkdtempSync(join(tmpdir(), "korret-node-ca-"))
    certificateFile = join(certificateDirectory, "trusted-roots.pem")
    writeFileSync(certificateFile, `${roots}\n${additionalRoots}`, { mode: 0o600 })
    environment.NODE_EXTRA_CA_CERTS = certificateFile
    console.log("Using Windows trusted certificates for server connections.")
  } catch (error) {
    cleanup()
    console.error("Cannot load Windows trusted certificates:", error.message)
    process.exit(1)
  }
}

const connectionCheck = `
  const endpoints = [
    ["Order email service", "https://api.resend.com", 200],
    ["Order database service", "https://firestore.googleapis.com", 404],
  ];
  await Promise.all(endpoints.map(async ([name, url, expectedStatus]) => {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (response.status !== expectedStatus) throw new Error("Unexpected HTTP status " + response.status);
      await response.body?.cancel();
      console.log("PASS:", name, "HTTPS certificate verified (no order submitted)");
    } catch (error) {
      console.error("FAIL:", name, error.cause?.code || error.message);
      process.exitCode = 1;
    }
  }));
  const { default: grpc } = await import("@grpc/grpc-js");
  const client = new grpc.Client("firestore.googleapis.com:443", grpc.credentials.createSsl());
  try {
    await new Promise((resolve, reject) => client.waitForReady(Date.now() + 10000, (error) => error ? reject(error) : resolve()));
    console.log("PASS: Firestore gRPC transport connected (no database read or write)");
  } catch (error) {
    console.error("FAIL: Firestore gRPC transport", error.message);
    process.exitCode = 1;
  } finally {
    client.close();
  }
`

const argumentsToRun = process.argv[2] === "--check-connections"
  ? ["--input-type=module", "-e", connectionCheck]
  : [require.resolve("next/dist/bin/next"), ...process.argv.slice(2)]
const child = spawn(process.execPath, argumentsToRun, {
  env: environment,
  stdio: "inherit",
  windowsHide: true,
})

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal))
}
child.on("error", (error) => {
  console.error(error.message)
  cleanup()
  process.exitCode = 1
})
child.on("exit", (code) => {
  cleanup()
  process.exitCode = code ?? 1
})
