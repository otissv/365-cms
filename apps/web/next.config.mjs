/** @type {import('next').NextConfig} */

import nextPWA from "@ducanh2912/next-pwa"
import withPlaiceholder from "@plaiceholder/next"

const withPWA = nextPWA({
  scope: "/app/",
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  fallbacks: {
    image: "/images/fallback.png",
  },
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
  transpilePackages: ["@repo/ui", "@repo/lib"],
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
    return config
  },
}

const config =
  process.env.NODE_ENV === "development"
    ? nextConfig
    : withPWA(withPlaiceholder(nextConfig))

export default config
