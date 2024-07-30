import dotenvx from "@dotenvx/dotenvx"
import * as path from "node:path"

dotenvx.config({ path: path.join(__dirname, "../../.env.test") })
