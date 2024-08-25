import { getConnection } from "@repo/config/database"
import { createCmsDatabase } from "../../../src/schema/collections.schema"
import {
  onDeleteColumnActionData,
  onInsertColumnActionData,
  onSortColumnActionData,
  onUpdateColumnActionData,
} from "./data.column.actions"
import { cleanUpSchemas } from "../../__helpers___/cleanup-schemas.helpers"
import { fakeCollectionData } from "../../__helpers___/data.helpers"
import type { CmsCollectionColumnUpdate } from "../../../src/types.cms"

const db = getConnection()

export const ON_DELETE_COLUMN_ACTION_DATA = "on_delete_column_action_data"
export const ON_INSERT_COLUMN_ACTION_DATA = "on_insert_column_action_data"
export const ON_SORT_COLUMN_ACTION_DATA = "on_sort_column_action_data"
export const ON_UPDATE_COLUMN_ACTION_DATA = "on_update_column_action_data"

const schemas = [
  ON_DELETE_COLUMN_ACTION_DATA,
  ON_INSERT_COLUMN_ACTION_DATA,
  ON_SORT_COLUMN_ACTION_DATA,
  ON_UPDATE_COLUMN_ACTION_DATA,
]

export async function cleanUpCmsColumnAction() {
  return cleanUpSchemas(schemas, db)
}

export async function setUpCmsColumnAction() {
  return Promise.all(
    schemas.map(async (schema) => {
      await db.raw(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`)
      await createCmsDatabase(schema)

      if (schema === ON_DELETE_COLUMN_ACTION_DATA) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(ON_DELETE_COLUMN_ACTION_DATA)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(ON_DELETE_COLUMN_ACTION_DATA)
            .insert(onDeleteColumnActionData, ["id"])
            .into("cms_collection_columns")
        })
      }

      if (schema === ON_INSERT_COLUMN_ACTION_DATA) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(ON_INSERT_COLUMN_ACTION_DATA)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(ON_INSERT_COLUMN_ACTION_DATA)
            .insert(onInsertColumnActionData, ["id"])
            .into("cms_collection_columns")
        })
      }

      if (schema === ON_SORT_COLUMN_ACTION_DATA) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(ON_SORT_COLUMN_ACTION_DATA)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")

          await trx
            .withSchema(ON_SORT_COLUMN_ACTION_DATA)
            .insert(onSortColumnActionData, ["id"])
            .into("cms_collection_columns")
        })
      }

      if (schema === ON_UPDATE_COLUMN_ACTION_DATA) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(ON_UPDATE_COLUMN_ACTION_DATA)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(ON_UPDATE_COLUMN_ACTION_DATA)
            .insert(onUpdateColumnActionData, ["id"])
            .into("cms_collection_columns")
        })
      }

      return
    })
  )
}

export const columnUpdate = {
  columnName: "renamed",
  type: "number",
  fieldOptions: {
    defaultValue: 2,
  },
  validation: {
    required: false,
  },
  help: "more Help text",
  enableDelete: true,
  enableSort: true,
  enableHide: true,
  enableFilter: true,
  sortBy: "desc",
  visibility: false,
  index: {
    nulls: "first",
    direction: "desc",
  },
} as CmsCollectionColumnUpdate
