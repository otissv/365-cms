import localFont from "next/font/local"
import { Inter } from "next/font/google"

const heading = localFont({
  src: "agrandir-grand-bold.ttf",
  variable: "--font-heading",
  fallback: ["system-ui", "arial"]
})

const text = Inter({
  subsets: ["latin"],
  variable: "--font-text",
  fallback: ["system-ui", "arial"]
})

const fonts = {
  h1: heading,
  h2: heading,
  h3: heading,
  h4: heading,
  h5: heading,
  h6: text,
  text: text
}

export default fonts

export function getFontFamilyClassName(tag: string) {
  switch (true) {
    case tag === "h1":
      return fonts.h1.className
    case tag === "h2":
      return fonts.h2.className
    case tag === "h3":
      return fonts.h3.className
    case tag === "h4":
      return fonts.h4.className
    case tag === "h5":
      return fonts.h5.className
    case tag === "h6":
      return fonts.h6.className
    default:
      return fonts.text.className
  }
}
