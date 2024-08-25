import { getConnection } from "@repo/config/database"

import { cleanUpSchemas } from "../../__helpers___/cleanup-schemas.helpers"
import { fakeCollectionData } from "../../__helpers___/data.helpers"
import { createCmsDatabase } from "../../../src/schema/collections.schema"
import {
  columnServiceGetByFieldIdData,
  columnServiceRemoveData,
  columnServiceUpdateData,
} from "./data.column.service"
import type { CmsCollectionColumn } from "../../../src/types.cms"

const db = getConnection()

export const COLUMN_SCHEMA_SERVICE_GET_BY_FIELD_ID =
  "column_service_get_by_field_id"
export const COLUMN_SCHEMA_SERVICE_INSERT = "column_service_insert"
export const COLUMN_SCHEMA_SERVICE_REMOVE = "column_service_remove"
export const COLUMN_SCHEMA_SERVICE_UPDATE = "column_service_update"

const schemas = [
  COLUMN_SCHEMA_SERVICE_GET_BY_FIELD_ID,
  COLUMN_SCHEMA_SERVICE_INSERT,
  COLUMN_SCHEMA_SERVICE_REMOVE,
  COLUMN_SCHEMA_SERVICE_UPDATE,
]

export const COLUMN_SERVICE_DATA_DEFAULTS = {
  columnName: "col_1",
  collectionId: 1,
  type: "text",
  columnOrder: [],
  fieldId: "Insert_default",
}

export const COLLECTION_COLUMN_SERVICE_COLUMNS: (keyof CmsCollectionColumn)[] =
  ["columnName", "collectionId", "type"]

export async function cleanUpCmsColumnsService() {
  return cleanUpSchemas(schemas, db)
}

export async function setUpCmsColumnsService() {
  return Promise.all(
    schemas.map(async (schema) => {
      await db.raw(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`)
      await createCmsDatabase(schema)

      if (schema === COLUMN_SCHEMA_SERVICE_GET_BY_FIELD_ID) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(COLUMN_SCHEMA_SERVICE_GET_BY_FIELD_ID)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(COLUMN_SCHEMA_SERVICE_GET_BY_FIELD_ID)
            .insert(columnServiceGetByFieldIdData, ["id"])
            .into("cms_collection_columns")
        })
      }

      if (schema === COLUMN_SCHEMA_SERVICE_REMOVE) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(COLUMN_SCHEMA_SERVICE_REMOVE)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(COLUMN_SCHEMA_SERVICE_REMOVE)
            .insert(columnServiceRemoveData, ["id"])
            .into("cms_collection_columns")
        })
      }

      if (schema === COLUMN_SCHEMA_SERVICE_INSERT) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(COLUMN_SCHEMA_SERVICE_INSERT)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
        })
      }

      if (schema === COLUMN_SCHEMA_SERVICE_UPDATE) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(COLUMN_SCHEMA_SERVICE_UPDATE)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(COLUMN_SCHEMA_SERVICE_UPDATE)
            .insert(columnServiceUpdateData, ["id"])
            .into("cms_collection_columns")
        })
      }

      return
    })
  )
}
