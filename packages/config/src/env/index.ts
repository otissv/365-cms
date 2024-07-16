import { isDev } from "@repo/lib/isDev"
import { mayBeToNumber } from "@repo/lib/mayBeToNumber"
import { maybeString } from "@repo/lib/maybeString"

const env = {
  isDev,
  isProd: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  baseUrl: maybeString(process.env.BASE_URL) as any as URL,
  resendApiKey: maybeString(process.env.RESEND_API_KEY),
  testEmailAddress: maybeString(process.env.TEST_EMAIL_ADDRESS),
  database: maybeString(process.env.POSTGRES_DATABASE),
  databaseHost: maybeString(process.env.POSTGRES_HOST),
  databasePort: mayBeToNumber()(process.env.POSTGRES_PORT),
  databasePassword: maybeString(process.env.POSTGRES_PASSWORD),
  databaseUser: maybeString(process.env.POSTGRES_USER),
  databaseConnectionString: maybeString(process.env.DATABASE_CONNECTION_STRING),
  databaseSSL: maybeString(process.env.POSTGRES_SSL),
  databaseIdleTimeout: mayBeToNumber()(process.env.POSTGRES_IDLE_TIMEOUT),
  databaseMaxConnections: mayBeToNumber()(process.env.POSTGRES_MAX_CONNECTIONS),
  databaseMaxLifetime: mayBeToNumber()(process.env.POSTGRES_MAX_LIFETIME),
} as const

export default env
