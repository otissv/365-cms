/** @type {import('next').NextConfig} */

import fs from "node:fs"
import path from "node:path"
import url from "node:url"
import nextPWA from "@ducanh2912/next-pwa"
import withPlaiceholder from "@plaiceholder/next"
import { globSync } from "glob"
import packageJson from "./package.json" with { type: "json" }

// Import packages
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packages = globSync(path.join(__dirname, "../../packages/*/package.json"))

const transpilePackages = packages.map((pathString) => {
  const name = JSON.parse(
    fs.readFileSync(pathString, { encoding: "utf8" })
  )?.name

  const repo = packageJson.dependencies[name]

  if (!repo) {
    packageJson.dependencies[name] = "workspace:*"
    fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2))
  }

  return name
})

const withPWA = nextPWA({
  scope: "/app/",
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
})

const nextConfig = {
  experimental: {
    webVitalsAttribution: ["FCP", "CLS", "LCP"],
    optimizeCss: true,
    serverComponentsExternalPackages: ["knex"],
  },
  reactStrictMode: true,
  transpilePackages,
  webpack(config, { dev, isServer }) {
    // Code splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        default: false,
        vendors: false,
      }

      config.optimization.splitChunks.chunks = "async"
      config.optimization.splitChunks.minSize = 20000
      config.optimization.splitChunks.maxAsyncRequests = 5
      config.optimization.splitChunks.maxInitialRequests = 3

      //Only minimize the bundle in production
      config.optimization.minimize = true
      config.optimization.concatenateModules = true
      config.optimization.usedExports = true
    }

    config.externals = config.externals.concat(["oracledb", "pg-query-stream"])

    return config
  },
}

const config =
  process.env.NODE_ENV === "development"
    ? nextConfig
    : withPWA(withPlaiceholder(nextConfig))

export default config
