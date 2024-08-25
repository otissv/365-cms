import { getConnection } from "@repo/config/database"

import { cleanUpSchemas } from "../../__helpers___/cleanup-schemas.helpers"
import {
  fakeCollectionData,
  fakeColumnData,
} from "../../__helpers___/data.helpers"
import { createCmsDatabase } from "../../../src/schema/collections.schema"
import {
  documentsServiceGet,
  documentsServiceRemoveData,
  documentsServiceUpdateData,
} from "./data.documents.service"

const db = getConnection()

export const DOCUMENTS_SCHEMA_SERVICE_GET = "documents_service_get"
export const DOCUMENTS_SCHEMA_SERVICE_INSERT = "documents_service_insert"
export const DOCUMENTS_SCHEMA_SERVICE_REMOVE = "documents_service_remove"
export const DOCUMENTS_SCHEMA_SERVICE_UPDATE = "documents_service_update"

const schemas = [
  DOCUMENTS_SCHEMA_SERVICE_GET,
  DOCUMENTS_SCHEMA_SERVICE_INSERT,
  DOCUMENTS_SCHEMA_SERVICE_REMOVE,
  DOCUMENTS_SCHEMA_SERVICE_UPDATE,
]

export async function cleanUpCmsDocumentsService() {
  return cleanUpSchemas(schemas, db)
}

export async function setUpCmsDocumentsService() {
  return Promise.all(
    schemas.map(async (schema) => {
      await db.raw(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`)
      await createCmsDatabase(schema)

      if (schema === DOCUMENTS_SCHEMA_SERVICE_GET) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(DOCUMENTS_SCHEMA_SERVICE_GET)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(DOCUMENTS_SCHEMA_SERVICE_GET)
            .insert(fakeColumnData(), ["id"])
            .into("cms_collection_columns")
          await trx
            .withSchema(DOCUMENTS_SCHEMA_SERVICE_GET)
            .insert(documentsServiceGet, ["id"])
            .into("cms_documents")
        })
      }

      if (schema === DOCUMENTS_SCHEMA_SERVICE_INSERT) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(DOCUMENTS_SCHEMA_SERVICE_INSERT)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
        })
      }

      if (schema === DOCUMENTS_SCHEMA_SERVICE_REMOVE) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(DOCUMENTS_SCHEMA_SERVICE_REMOVE)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(DOCUMENTS_SCHEMA_SERVICE_REMOVE)
            .insert(documentsServiceRemoveData, ["id"])
            .into("cms_documents")
        })
      }

      if (schema === DOCUMENTS_SCHEMA_SERVICE_UPDATE) {
        await db.transaction(async (trx) => {
          await trx
            .withSchema(DOCUMENTS_SCHEMA_SERVICE_UPDATE)
            .insert(fakeCollectionData(), ["id"])
            .into("cms_collections")
          await trx
            .withSchema(DOCUMENTS_SCHEMA_SERVICE_UPDATE)
            .insert(documentsServiceUpdateData, ["id"])
            .into("cms_documents")
        })
      }

      return
    })
  )
}

export const docCollection1Service = {
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
