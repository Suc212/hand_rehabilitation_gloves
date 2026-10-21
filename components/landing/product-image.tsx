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
  sizes: "(min-width: 1280px) 552px, (min-width: 1024px) calc((100vw - 176px) / 2), (min-width: 640px) calc(100vw - 80px), calc(100vw - 24px)",
})

// Measured at the unchanged default quality: 384w = 20.8 KB, 672w = 39.3 KB,
// but 896w = 54.3 KB versus the 40.8 KB original. Keep the smaller framework
// variants and a true 935w original candidate for higher DPRs, without upscaling.
const srcSet = [
  ...(props.srcSet || "").split(", ").filter((candidate) => Number(candidate.split(" ").at(-1)?.replace("w", "")) <= 672),
  `${encodeURI(source)} 935w`,
].join(", ")

export function ProductImage({ alt, caregiver = false }: { alt: string; caregiver?: boolean }) {
  if (caregiver) {
    const { props: caregiverProps } = getImageProps({
      src: "/images/Images SP/dark-hand-grip-square.avif",
      alt,
      width: 720,
      height: 720,
      loading: "eager",
      fetchPriority: "high",
      quality: 75,
      sizes: "(min-width: 1280px) 552px, (min-width: 1024px) calc((100vw - 176px) / 2), (min-width: 640px) calc(100vw - 80px), calc(100vw - 24px)",
    })
    return <img {...caregiverProps} className="block aspect-square h-auto w-full object-contain" />
  }
  // getImageProps generates the framework's image attributes on the server;
  // this static hero needs no image-component hydration or load handler.
  return <img {...props} src={source} srcSet={srcSet} alt={alt} className="block h-auto w-full object-contain" />
}
