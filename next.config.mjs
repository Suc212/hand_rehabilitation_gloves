/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Include CSS display widths and their common DPR multiples. The optimizer
    // retains the source's aspect ratio and never enlarges its actual pixels.
    deviceSizes: [320, 384, 448, 480, 640, 672, 768, 896, 960, 1024, 1280, 1536, 1920, 2048, 3840],
    imageSizes: [32, 48, 64, 96, 128, 256],
  },
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
}

export default nextConfig
