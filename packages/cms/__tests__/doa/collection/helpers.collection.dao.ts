import { getConnection } from "@repo/config/database"
import { createCmsDatabase } from "../../../src/schema/collections.schema"
import {
  collectionDaoGetData,
  collectionDaoRemoveData,
  collectionDaoUpdateData,
} from "./data.collection.dao"
import type { CmsCollection } from "../../../src/types.cms"
import { cleanUpSchemas } from "../../__helpers___/cleanup-schemas.helpers"

const db = getConnection()

export const COLLECTION_SCHEMA_DAO_GET = "collection_dao_get"
export const COLLECTION_SCHEMA_DAO_INSERT = "collection_dao_insert"
export const COLLECTION_SCHEMA_DAO_REMOVE = "collection_dao_remove"
export const COLLECTION_SCHEMA_DAO_UPDATE = "collection_dao_update"

const schemas = [
  COLLECTION_SCHEMA_DAO_GET,
  COLLECTION_SCHEMA_DAO_INSERT,
  COLLECTION_SCHEMA_DAO_REMOVE,
  COLLECTION_SCHEMA_DAO_UPDATE,
]

export const COLLECTION_DAO_DATA_DEFAULTS = {
  userId: 1,
  type: "multiple" as "single" | "multiple",
}

export const COLLECTION_DAO_COLUMNS: (keyof CmsCollection)[] = [
  "name",
  "userId",
  "type",
  "isPublished",
  "roles",
  "columnOrder",
]

export async function cleanUpCmsCollectionsDao() {
  return cleanUpSchemas(schemas, db)
}

export async function setUpCmsCollectionsDao() {
  return Promise.all(
    schemas.map(async (schema) => {
      await db.raw(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`)
      await createCmsDatabase(schema)

      if (schema === COLLECTION_SCHEMA_DAO_GET) {
        await db
          .withSchema(COLLECTION_SCHEMA_DAO_GET)
          .insert(collectionDaoGetData, ["id"])
          .into("cms_collections")
      }

      if (schema === COLLECTION_SCHEMA_DAO_REMOVE) {
        await db
          .withSchema(COLLECTION_SCHEMA_DAO_REMOVE)
          .insert(collectionDaoRemoveData, ["id"])
          .into("cms_collections")
      }

      if (schema === COLLECTION_SCHEMA_DAO_UPDATE) {
        await db
          .withSchema(COLLECTION_SCHEMA_DAO_UPDATE)
          .insert(collectionDaoUpdateData, ["id"])
          .into("cms_collections")
      }
      return
    })
  )
}
