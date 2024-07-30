import "server-only"

import { getConnection } from "@repo/config/database"
import { isEmpty } from "@repo/lib/isEmpty"
import { errorResponse } from "@repo/lib/utils/customError"

import type {
  AppResponse,
  CmsCollectionColumn,
  CmsCollectionColumnInsert,
  CmsCollectionColumnUpdate,
} from "../types.cms"

export type CmsCollectionColumnsDao = {
  getByCollectionIdAndFieldId(props?: {
    collectionId: number
    fieldId: string
    columns?: Record<string, string> | string[]
  }): Promise<
    AppResponse<Partial<CmsCollectionColumn>> & {
      totalPages: number
    }
  >
  remove(props: {
    fieldId: string
    columns?: string[]
  }): Promise<AppResponse<Partial<CmsCollectionColumn>>>
  insert(props: {
    data: Omit<
      CmsCollectionColumnInsert,
      "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
    >
    columns?: string[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollectionColumn>>>
  update(props: {
    id: number
    data: CmsCollectionColumnUpdate
    columns?: string[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollectionColumn>>>
}

function cmsColumnsDao(schema: string): CmsCollectionColumnsDao {
  if (!schema) throw new Error("Must provide a schema")

  const db = getConnection()

  return {
    async getByCollectionIdAndFieldId(props): Promise<
      AppResponse<Partial<CmsCollectionColumn>> & {
        totalPages: number
      }
    > {
      try {
        const collectionColumns = await db
          .withSchema(schema)
          .from("cms_collection_columns")
          .select(
            props?.columns || {
              collectionId: "collectionId",
              columnName: "columnName",
              fieldId: "fieldId",
              type: "type",
              defaultValue: "defaultValue",
              help: "help",
              enableDelete: "enableDelete",
              enableSort: "enableSort",
              enableHide: "enableHide",
              enableFilter: "enableFilter",
              filter: "filter",
              sortBy: "sortBy",
              visibility: "visibility",
              index: "index",
              createdBy: "createdBy",
              createdAt: "createdAt",
              updatedAt: "updatedAt",
              updatedBy: "updatedBy",
              fieldOptions: "fieldOptions",
              validation: "validation",
            }
          )
          .where("collectionId" as any, "=", props?.collectionId as any)
          .andWhere("fieldId", props?.fieldId)

        if (isEmpty(collectionColumns)) {
          return {
            data: [],
            totalPages: 0,
            error: "",
          }
        }

        return {
          data: collectionColumns,
          totalPages: 1,
          error: "",
        }
      } catch (error) {
        return {
          ...errorResponse(error),
          totalPages: 0,
        }
      }
    },

    async remove({
      fieldId,
      columns = ["id"],
    }): Promise<AppResponse<Partial<CmsCollectionColumn>>> {
      try {
        return db.transaction(async (trx) => {
          try {
            const result = await trx
              .withSchema(schema)
              .from("cms_collection_columns")
              .where("cms_collection_columns.fieldId", "=", fieldId)
              .del([...columns, "collectionId"])

            const collections = await trx
              .withSchema(schema)
              .from("cms_collections")
              .select()
              .where("cms_collections.id", "=", result[0].collectionId)

            if (collections[0].columnOrder) {
              await trx
                .withSchema(schema)
                .from("cms_collections")
                .where("cms_collections.id", "=", result[0].collectionId)
                .update({
                  columnOrder: collections[0].columnOrder.filter(
                    (c: string) => c !== fieldId
                  ),
                })
            }

            await trx
              .withSchema(schema)
              .from("cms_documents")
              .where(trx.raw(`data->>'${fieldId}' IS NOT NULL`))
              .update({
                data: trx.raw(`data - '${fieldId}'`),
              })

            return {
              data: result,
              error: "",
            }
          } catch (error) {
            // biome-ignore lint/complexity/noUselessCatch: <explanation>
            throw error
          }
        })
      } catch (error) {
        return errorResponse(error)
      }
    },

    async insert({
      data: { columnOrder, ...data },
      columns = ["id"],
      userId,
    }): Promise<AppResponse<Partial<CmsCollectionColumn>>> {
      try {
        const result = await db.transaction(async (trx) => {
          try {
            const collectionColumns = await trx
              .withSchema(schema)
              .from("cms_collection_columns")
              .insert(
                {
                  ...data,
                  createdAt: new Date(),
                  createdBy: userId,
                  updatedAt: new Date(),
                  updatedBy: userId,
                },
                columns
              )

            await trx
              .withSchema(schema)
              .from("cms_collections")
              .where("cms_collections.id", "=", data.collectionId)
              .update(
                {
                  columnOrder,
                  updatedAt: new Date(),
                  updatedBy: userId,
                },
                ["id"]
              )
            return collectionColumns
          } catch (error) {
            // biome-ignore lint/complexity/noUselessCatch: <explanation>
            throw error
          }
        })

        return {
          data: result,
          error: "",
        }
      } catch (error) {
        return errorResponse(error)
      }
    },

    async update({
      id,
      data,
      columns = ["id"],
      userId,
    }): Promise<AppResponse<Partial<CmsCollectionColumn>>> {
      try {
        const result = await db
          .withSchema(schema)
          .from("cms_collection_columns")
          .where("cms_collection_columns.id", "=", id)
          .update(
            {
              ...data,
              updatedAt: new Date(),
              updatedBy: userId,
            },
            columns
          )

        return {
          data: result,
          error: "",
        }
      } catch (error) {
        return errorResponse(error)
      }
    },
  }
}

export default cmsColumnsDao
