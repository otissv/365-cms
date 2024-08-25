import knex from "knex"
import env from "../env"

export function isJsonObject(obj: any): boolean {
  console.log(obj, typeof obj)
  if (typeof obj !== "object" || Array.isArray(obj)) return false

  try {
    JSON.stringify(obj)
    return true
  } catch (e) {
    return false
  }
}

export function getConnection(): knex.Knex<any, unknown[]> {
  return knex({
    client: "pg",
    connection: {
      connectionString: env.databaseConnectionString,
      host: env.databaseHost,
      port: env.databasePort,
      user: env.databaseUser,
      database: env.database,
      password: env.databasePassword,

      // ssl: env.databaseSSL ? { rejectUnauthorized: false } : false
    },
    pool: {
      min: 0,
      max: env.databaseMaxConnections,

      idleTimeoutMillis: env.databaseIdleTimeout,
    },
  })
}
