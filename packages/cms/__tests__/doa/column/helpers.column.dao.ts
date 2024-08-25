import { getConnection } from "@repo/config/database"

import { cleanUpSchemas } from "../../__helpers___/cleanup-schemas.helpers"
import { fakeCollectionData } from "../../__helpers___/data.helpers"
import { createCmsDatabase } from "../../../src/schema/collections.schema"
import {
  columnDaoGetByFieldIdData,
  columnDaoRemoveData,
  columnDaoUpdateData,
} from "./data.column.dao"
import type { CmsCollectionColumn } from "../../../src/types.cms"

const db = getConnection()

export const COLUMN_SCHEMA_DAO_GET_BY_FIELD_ID = "column_dao_get_by_field_id"
export const COLUMN_SCHEMA_DAO_INSERT = "column_dao_insert"
export const COLUMN_SCHEMA_DAO_REMOVE = "column_dao_remove"
export const COLUMN_SCHEMA_DAO_UPDATE = "column_dao_update"

const schemas = [
  COLUMN_SCHEMA_DAO_GET_BY_FIELD_ID,
  COLUMN_SCHEMA_DAO_INSERT,
  COLUMN_SCHEMA_DAO_REMOVE,
  COLUMN_SCHEMA_DAO_UPDATE,
]

export const COLUMN_DAO_DATA_DEFAULTS = {
  columnName: "col_1",
  collectionId: 1,
  type: "text",
  columnOrder: [],
  fieldId: "Insert_default",
}

export const COLLECTION_COLUMN_DAO_COLUMNS: (keyof CmsCollectionColumn)[] = [
  "columnName",
  "collectionId",
  "type",
]

export async function cleanUpCmsColumnsDao() {
  return cleanUpSchemas(schemas, db)
}

export async function setUpCmsColumnsDao() {
  return Promise.all(
    schemas.map(async (schema) => {
      await db.raw(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`)
      await createCmsDatabase(schema)

      if (schema === COLUMN_SCHEMA_DAO_GET_BY_FIELD_ID) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(COLUMN_SCHEMA_DAO_GET_BY_FIELD_ID)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(COLUMN_SCHEMA_DAO_GET_BY_FIELD_ID)
            .insert(columnDaoGetByFieldIdData, ["id"])
            .into("cms_collection_columns")
        })
      }

      if (schema === COLUMN_SCHEMA_DAO_REMOVE) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(COLUMN_SCHEMA_DAO_REMOVE)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(COLUMN_SCHEMA_DAO_REMOVE)
            .insert(columnDaoRemoveData, ["id"])
            .into("cms_collection_columns")
        })
      }

      if (schema === COLUMN_SCHEMA_DAO_INSERT) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(COLUMN_SCHEMA_DAO_INSERT)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
        })
      }

      if (schema === COLUMN_SCHEMA_DAO_UPDATE) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(COLUMN_SCHEMA_DAO_UPDATE)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(COLUMN_SCHEMA_DAO_UPDATE)
            .insert(columnDaoUpdateData, ["id"])
            .into("cms_collection_columns")
        })
      }

      return
    })
  )
}
