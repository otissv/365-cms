import { getConnection } from "@repo/config/database"
import { createCmsDatabase } from "../../../src/schema/collections.schema"
import {
  renameCollectionActionData,
  deleteCollectionActionData,
  addNewCollectionActionData,
  updateColumnOrderActionData,
} from "./data.collection.actions"
import { cleanUpSchemas } from "../../__helpers___/cleanup-schemas.helpers"

const db = getConnection()

export const ON_RENAME_COLLECTION_ACTION = "on_rename_collection_action"
export const ON_DELETE_COLLECTION_ACTION = "on_delete_collection_action"
export const ON_NEW_COLLECTION_ACTION = "on_new_collection_action"
export const ON_UPDATE_COLUMN_ORDER_ACTION = "on_update_column_order_action"

const schemas = [
  ON_RENAME_COLLECTION_ACTION,
  ON_DELETE_COLLECTION_ACTION,
  ON_NEW_COLLECTION_ACTION,
  ON_UPDATE_COLUMN_ORDER_ACTION,
]

export async function cleanUpCmsCollectionsAction() {
  return cleanUpSchemas(schemas, db)
}

export async function setUpCmsCollectionsAction() {
  return Promise.all(
    schemas.map(async (schema) => {
      await db.raw(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`)
      await createCmsDatabase(schema)

      if (schema === ON_RENAME_COLLECTION_ACTION) {
        await db
          .withSchema(ON_RENAME_COLLECTION_ACTION)
          .insert(renameCollectionActionData, ["id"])
          .into("cms_collections")
      }

      if (schema === ON_DELETE_COLLECTION_ACTION) {
        await db
          .withSchema(ON_DELETE_COLLECTION_ACTION)
          .insert(deleteCollectionActionData, ["id"])
          .into("cms_collections")
      }

      if (schema === ON_NEW_COLLECTION_ACTION) {
        await db
          .withSchema(ON_NEW_COLLECTION_ACTION)
          .insert(addNewCollectionActionData, ["id"])
          .into("cms_collections")
      }

      if (schema === ON_UPDATE_COLUMN_ORDER_ACTION) {
        await db
          .withSchema(ON_UPDATE_COLUMN_ORDER_ACTION)
          .insert(updateColumnOrderActionData, ["id"])
          .into("cms_collections")
      }
      return
    })
  )
}
