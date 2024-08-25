import "server-only"

import { getConnection } from "@repo/config/database"
import { isEmpty } from "@repo/lib/isEmpty"
import { errorResponse } from "@repo/lib/utils/customError"

import type {
  AppResponse,
  CmsCollection,
  CmsCollectionColumn,
  CmsCollectionColumnInsert,
  CmsCollectionColumnTableColumn,
  CmsCollectionColumnUpdate,
} from "../types.cms"

export type CmsCollectionColumnsDao = {
  getByFieldId(props?: {
    collectionId: number
    fieldId: string
    select?: Record<string, keyof CmsCollectionColumn>
  }): Promise<
    AppResponse<Partial<CmsCollectionColumn>> & {
      totalPages: number
    }
  >
  remove(props: {
    fieldId: string
    returning?: (keyof CmsCollectionColumn)[]
  }): Promise<AppResponse<Partial<CmsCollectionColumn>>>
  insert(props: {
    data: Omit<
      CmsCollectionColumnInsert,
      "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
    >
    returning?: (keyof CmsCollectionColumn | "columnOrder")[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollectionColumn>>>
  update(props: {
    collectionId: number
    where: [
      CmsCollectionColumnTableColumn<keyof CmsCollectionColumn>,
      string,
      any,
    ]
    data: CmsCollectionColumnUpdate
    returning?: (keyof CmsCollectionColumn)[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollectionColumn>>>
}

function cmsColumnsDao(schema: string): CmsCollectionColumnsDao {
  if (!schema) throw new Error("Must provide a schema for cmsColumnsDao")

  const db = getConnection()

  return {
    async getByFieldId(props): Promise<
      AppResponse<Partial<CmsCollectionColumn>> & {
        totalPages: number
      }
    > {
      try {
        if (isEmpty(props?.collectionId)) {
          return {
            data: [],
            error: "cmsColumnsDao.getByFieldId requires 'collectionId' prop",
            totalPages: 0,
          }
        }

        if (isEmpty(props?.fieldId)) {
          return {
            data: [],
            error: "cmsColumnsDao.getByFieldId requires 'fieldId' prop",
            totalPages: 0,
          }
        }

        const collectionColumns = await db
          .withSchema(schema)
          .from("cms_collection_columns")
          .select(
            props?.select || {
              collectionId: "collectionId",
              columnName: "columnName",
              fieldId: "fieldId",
              type: "type",
              help: "help",
              enableDelete: "enableDelete",
              enableSort: "enableSort",
              enableHide: "enableHide",
              enableFilter: "enableFilter",
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
      returning = ["id"],
    }): Promise<AppResponse<Partial<CmsCollectionColumn>>> {
      try {
        if (isEmpty(fieldId)) {
          return {
            data: [],
            error: "cmsColumnsDao.remove requires a 'fieldId' prop",
          }
        }

        return db.transaction(async (trx) => {
          try {
            const result = await trx
              .withSchema(schema)
              .from("cms_collection_columns")
              .where("cms_collection_columns.fieldId", "=", fieldId)
              .del([...returning, "collectionId"])

            if (isEmpty(result)) {
              return {
                data: [],
                error: "",
              }
            }

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
      data: doc,
      returning = ["id"],
      userId,
    }): Promise<
      AppResponse<
        Partial<
          CmsCollectionColumn & { columnOrder: CmsCollection["columnOrder"] }
        >
      >
    > {
      try {
        const { columnOrder = [], ...data } = doc || {}

        if (isEmpty(data)) {
          return {
            data: [],
            error: "cmsColumnsDao.insert requires a 'data' prop",
          }
        }

        if (isEmpty(userId)) {
          return {
            data: [],
            error: "cmsColumnsDao.insert requires a 'userId' prop",
          }
        }

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
                returning
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
      collectionId,
      where,
      data,
      returning = ["id"],
      userId,
    }): Promise<AppResponse<Partial<CmsCollectionColumn>>> {
      try {
        if (isEmpty(collectionId)) {
          return {
            data: [],
            error: "cmsColumnsDao.update requires a 'collectionId' prop",
          }
        }

        if (isEmpty(data)) {
          return {
            data: [],
            error: "cmsColumnsDao.update requires a 'data' object prop",
          }
        }

        if (isEmpty(where)) {
          return {
            data: [],
            error: "cmsColumnsDao.update requires a 'where' tuple prop",
          }
        }

        if (isEmpty(userId)) {
          return {
            data: [],
            error: "cmsColumnsDao.update requires a 'userId' prop",
          }
        }

        const result = await db
          .withSchema(schema)
          .from("cms_collection_columns")
          .where("cms_collection_columns.collectionId", "=", collectionId)
          .andWhere(...where)
          .update(
            {
              ...data,
              updatedAt: new Date(),
              updatedBy: userId,
            },
            returning
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
