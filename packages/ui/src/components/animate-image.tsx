import Image, { type ImageProps } from "next/image"
import type { ComponentProps } from "./component.types"
import { Box } from "./box"
import { cn } from "@/lib/utils"

interface AnimateImagePropsProps extends Omit<ImageProps, "fill"> {
  className?: string
  fill?: true
}

export interface AnimateImageProps extends ComponentProps<HTMLImageElement> {
  imageProps?: AnimateImagePropsProps
}

export const AnimateImage = async ({
  imageProps,
  className,
  ...props
}: AnimateImageProps) => {
  return (
    <Box className={cn("relative", className)} {...props}>
      <Image
        {...imageProps}
        alt={imageProps?.alt || ""}
        src={imageProps?.src || ""}
        className={cn("object-cover w-auto h-auto", imageProps?.className)}
      />
    </Box>
  )
}
