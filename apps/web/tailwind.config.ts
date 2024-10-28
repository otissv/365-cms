import sharedConfig from "@repo/tailwind-config"
import type { Config } from "tailwindcss"

console.log("=============================tailwind: web")

const config: Pick<Config, "prefix" | "presets" | "content"> = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  presets: [sharedConfig],
}

export default config
