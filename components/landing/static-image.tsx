import { getImageProps, type ImageProps } from "next/image"

// These images have no load handlers or blur placeholders. Keep Next's
// responsive optimization, dimensions and lazy loading without client hydration.
export function StaticImage(props: Omit<ImageProps, "onLoad" | "onError" | "placeholder" | "preload" | "priority">) {
  const { props: imageProps } = getImageProps(props)
  return <img {...imageProps} />
}
