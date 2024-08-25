import type { Knex } from "knex"

export async function cleanUpSchemas(
  schemas: string[],
  db: Knex<any, unknown[]>
) {
  return Promise.all(
    schemas.map(async (schema) => {
      return await db.raw(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`)
    })
  )
}
