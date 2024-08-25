import { getConnection } from "@repo/config/database"

import { cleanUpSchemas } from "../../__helpers___/cleanup-schemas.helpers"
import {
  fakeCollectionData,
  fakeColumnData,
} from "../../__helpers___/data.helpers"
import { createCmsDatabase } from "../../../src/schema/collections.schema"
import {
  documentsDaoGet,
  documentsDaoRemoveData,
  documentsDaoUpdateData,
} from "./data.documents.dao"

const db = getConnection()

export const DOCUMENTS_SCHEMA_DAO_GET = "documents_dao_get"
export const DOCUMENTS_SCHEMA_DAO_INSERT = "documents_dao_insert"
export const DOCUMENTS_SCHEMA_DAO_REMOVE = "documents_dao_remove"
export const DOCUMENTS_SCHEMA_DAO_UPDATE = "documents_dao_update"

const schemas = [
  DOCUMENTS_SCHEMA_DAO_GET,
  DOCUMENTS_SCHEMA_DAO_INSERT,
  DOCUMENTS_SCHEMA_DAO_REMOVE,
  DOCUMENTS_SCHEMA_DAO_UPDATE,
]

export async function cleanUpCmsDocumentsDao() {
  return cleanUpSchemas(schemas, db)
}

export async function setUpCmsDocumentsDao() {
  return Promise.all(
    schemas.map(async (schema) => {
      await db.raw(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`)
      await createCmsDatabase(schema)

      if (schema === DOCUMENTS_SCHEMA_DAO_GET) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(DOCUMENTS_SCHEMA_DAO_GET)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(DOCUMENTS_SCHEMA_DAO_GET)
            .insert(fakeColumnData(), ["id"])
            .into("cms_collection_columns")
          await trx
            .withSchema(DOCUMENTS_SCHEMA_DAO_GET)
            .insert(documentsDaoGet, ["id"])
            .into("cms_documents")
        })
      }

      if (schema === DOCUMENTS_SCHEMA_DAO_INSERT) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(DOCUMENTS_SCHEMA_DAO_INSERT)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
        })
      }

      if (schema === DOCUMENTS_SCHEMA_DAO_REMOVE) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(DOCUMENTS_SCHEMA_DAO_REMOVE)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(DOCUMENTS_SCHEMA_DAO_REMOVE)
            .insert(documentsDaoRemoveData, ["id"])
            .into("cms_documents")
        })
      }

      if (schema === DOCUMENTS_SCHEMA_DAO_UPDATE) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(DOCUMENTS_SCHEMA_DAO_UPDATE)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(DOCUMENTS_SCHEMA_DAO_UPDATE)
            .insert(documentsDaoUpdateData, ["id"])
            .into("cms_documents")
        })
      }

      return
    })
  )
}

export const docCollection1Dao = {
  collectionId: 1,
  collectionName: "collection_1",
  columnOrder: ["col1", "col2"],
  type: "multiple",
  roles: ["ADMIN"],
  columns: [
    {
      id: 1,
      columnName: "col_1",
      fieldId: "field_1",
      type: "text",
      fieldOptions: {
        defaultValue: 1,
      },
      validation: {
        required: true,
      },
      help: "Help text",
      enableDelete: false,
      enableSort: false,
      enableHide: false,
      enableFilter: false,
      sortBy: "asc",
      visibility: true,
      index: {
        nulls: "last",
        direction: "asc",
      },
    },
  ],
}
