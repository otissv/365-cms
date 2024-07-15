import knex from "knex"
import config from "@/env"

export function getConnection(): knex.Knex<any, unknown[]> {
  return knex({
    client: "pg",
    connection: {
      connectionString: config.databaseConnectionString,
      host: config.databaseHost,
      port: config.databasePort,
      user: config.databaseUser,
      database: config.database,
      password: config.databasePassword,

      // ssl: config.databaseSSL ? { rejectUnauthorized: false } : false
    },
    pool: {
      min: 0,
      max: config.databaseMaxConnections,

      idleTimeoutMillis: config.databaseIdleTimeout,
    },
  }).on("query", (query) => {
    // A workaround to fix JSON array inserts/updates until this issue is resolved
    if (
      [
        // 'update',
        "insert",
      ].includes(query.method) &&
      Array.isArray(query.bindings)
    ) {
      for (let i = 0; i < query.bindings.length; i++) {
        if (Array.isArray(query.bindings[i])) {
          query.bindings[i] = JSON.stringify(query.bindings[i])
        }
      }
    }
  })
}
