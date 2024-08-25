import { getConnection } from "@repo/config/database"
import { createCmsDatabase } from "../../../src/schema/collections.schema"
import {
  collectionServiceGetData,
  collectionServiceRemoveData,
  collectionServiceUpdateData,
} from "./data.collection.services"
import type { CmsCollection } from "../../../src/types.cms"
import { cleanUpSchemas } from "../../__helpers___/cleanup-schemas.helpers"

const db = getConnection()

export const COLLECTION_SCHEMA_SERVICE_GET = "collection_service_get"
export const COLLECTION_SCHEMA_SERVICE_INSERT = "collection_service_insert"
export const COLLECTION_SCHEMA_SERVICE_REMOVE = "collection_service_remove"
export const COLLECTION_SCHEMA_SERVICE_UPDATE = "collection_service_update"

const schemas = [
  COLLECTION_SCHEMA_SERVICE_GET,
  COLLECTION_SCHEMA_SERVICE_INSERT,
  COLLECTION_SCHEMA_SERVICE_REMOVE,
  COLLECTION_SCHEMA_SERVICE_UPDATE,
]

export const COLLECTION_SERVICES_DATA_DEFAULTS = {
  userId: 1,
  type: "multiple" as "single" | "multiple",
}

export const COLLECTION_SERVICE_COLUMNS: (keyof CmsCollection)[] = [
  "name",
  "userId",
  "type",
  "isPublished",
  "roles",
  "columnOrder",
]

export async function cleanUpCmsCollectionsService() {
  return cleanUpSchemas(schemas, db)
}

export async function setUpCmsCollectionsService() {
  return Promise.all(
    schemas.map(async (schema) => {
      await db.raw(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`)
      await createCmsDatabase(schema)

      if (schema === COLLECTION_SCHEMA_SERVICE_GET) {
        await db
          .withSchema(COLLECTION_SCHEMA_SERVICE_GET)
          .insert(collectionServiceGetData, ["id"])
          .into("cms_collections")
      }

      if (schema === COLLECTION_SCHEMA_SERVICE_REMOVE) {
        await db
          .withSchema(COLLECTION_SCHEMA_SERVICE_REMOVE)
          .insert(collectionServiceRemoveData, ["id"])
          .into("cms_collections")
      }

      if (schema === COLLECTION_SCHEMA_SERVICE_UPDATE) {
        await db
          .withSchema(COLLECTION_SCHEMA_SERVICE_UPDATE)
          .insert(collectionServiceUpdateData, ["id"])
          .into("cms_collections")
      }
      return
    })
  )
}
