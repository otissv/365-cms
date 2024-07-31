import type { Config } from "jest"
import * as path from "node:path"

const config: Config = {
  notify: true,
  preset: "ts-jest",
  testMatch: ["**/*.test.ts"],
  testEnvironment: "node",
  maxWorkers: 100,
  setupFiles: [path.join(__dirname, "../../config/config-jest/test-setup.ts")],
}

export default config
