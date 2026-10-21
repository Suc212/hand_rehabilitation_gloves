import { getImageProps } from "next/image"

const source = "/images/Img 1.avif"
const { props } = getImageProps({
  src: source,
  alt: "",
  width: 935,
  height: 960,
  loading: "eager",
  fetchPriority: "high",
  quality: 75,
  sizes: "(min-width: 640px) 448px, (min-width: 416px) 384px, calc(100vw - 32px)",
})

// Measured at the unchanged default quality: 384w = 20.8 KB, 672w = 39.3 KB,
// but 896w = 54.3 KB versus the 40.8 KB original. Keep the smaller framework
// variants and a true 935w original candidate for higher DPRs, without upscaling.
const srcSet = [
  ...(props.srcSet || "").split(", ").filter((candidate) => Number(candidate.split(" ").at(-1)?.replace("w", "")) <= 672),
  `${encodeURI(source)} 935w`,
].join(", ")

export function ProductImage({ alt }: { alt: string }) {
  // getImageProps generates the framework's image attributes on the server;
  // this static hero needs no image-component hydration or load handler.
  return <img {...props} src={source} srcSet={srcSet} alt={alt} className="mx-auto w-full max-w-sm rounded-2xl bg-white object-contain shadow-lg sm:max-w-md" />
}
