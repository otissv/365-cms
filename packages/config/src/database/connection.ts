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
