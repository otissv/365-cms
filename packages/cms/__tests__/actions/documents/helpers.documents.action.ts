import { getConnection } from "@repo/config/database"

import { cleanUpSchemas } from "../../__helpers___/cleanup-schemas.helpers"
import { createCmsDatabase } from "../../../src/schema/collections.schema"
import {
  fakeCollectionData,
  fakeColumnData,
} from "../../__helpers___/data.helpers"
import {
  getDocumentsActionData,
  onUpdateDataActionData,
  onDeleteRowActionData,
} from "./data.documents.actions"

const db = getConnection()

export const GET_DOCUMENTS_ACTION = "get_documents_action"
export const ON_DELETE_ROW_ACTION_DATA = "on_delete_row_action_data"
export const ON_UPDATE_DATA_ACTION = "on_update_data_action"
export const ON_UPDATE_INSERT_DATA_ACTION = "on_update_data__insert_action"

const schemas = [
  GET_DOCUMENTS_ACTION,
  ON_DELETE_ROW_ACTION_DATA,
  ON_UPDATE_DATA_ACTION,
  ON_UPDATE_INSERT_DATA_ACTION,
]

export async function cleanUpCmsDocumentsActions() {
  return cleanUpSchemas(schemas, db)
}

export async function setUpCmsDocumentsActions() {
  return Promise.all(
    schemas.map(async (schema) => {
      await db.raw(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`)
      await createCmsDatabase(schema)

      if (schema === GET_DOCUMENTS_ACTION) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(GET_DOCUMENTS_ACTION)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(GET_DOCUMENTS_ACTION)
            .insert(fakeColumnData(), ["id"])
            .into("cms_collection_columns")
          await trx
            .withSchema(GET_DOCUMENTS_ACTION)
            .insert(getDocumentsActionData, ["id"])
            .into("cms_documents")
        })
      }

      if (schema === ON_UPDATE_DATA_ACTION) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(ON_UPDATE_DATA_ACTION)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(ON_UPDATE_DATA_ACTION)
            .insert(onUpdateDataActionData, ["id"])
            .into("cms_documents")
        })
      }

      if (schema === ON_UPDATE_INSERT_DATA_ACTION) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(ON_UPDATE_INSERT_DATA_ACTION)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(ON_UPDATE_INSERT_DATA_ACTION)
            .insert(onUpdateDataActionData, ["id"])
            .into("cms_documents")
        })
      }

      if (schema === ON_DELETE_ROW_ACTION_DATA) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(ON_DELETE_ROW_ACTION_DATA)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(ON_DELETE_ROW_ACTION_DATA)
            .insert(onDeleteRowActionData, ["id"])
            .into("cms_documents")
        })
      }
    })
  )
}
