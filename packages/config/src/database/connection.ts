import knex from "knex"
import env from "../env"

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
