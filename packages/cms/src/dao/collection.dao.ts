import "server-only"

import { getConnection } from "@repo/config/database"
import { isEmpty } from "@repo/lib/isEmpty"
import { errorResponse } from "@repo/lib/utils/customError"

import type {
  AppResponse,
  CmsCollection,
  CmsCollectionInsert,
  CmsCollectionUpdate,
  CmsCollectionView,
} from "../cms.types"

export type CmsCollectionsDao = {
  get(props?: {
    page?: number
    limit?: number
    columns?: Record<string, string>
  }): Promise<
    AppResponse<CmsCollection> & {
      totalPages: number
    }
  >
  getAll(props?: {
    columns?: Record<string, string>
  }): Promise<AppResponse<CmsCollectionView>>
  remove(props: {
    id: number
    columns?: string[]
  }): Promise<AppResponse<Partial<CmsCollection>>>
  insert(props: {
    data: CmsCollectionInsert
    columns?: string[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollection>>>
  update(props: {
    id: number
    data: CmsCollectionUpdate
    columns?: string[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollection>>>
}

function cmsCollectionsDao(schema: string): CmsCollectionsDao {
  if (!schema) throw new Error("Must provide a schema")

  const db = getConnection()

  return {
    async get(props): Promise<
      AppResponse<CmsCollection> & {
        totalPages: number
      }
    > {
      try {
        const page = props?.page || 1
        const limit = props?.limit || 10
        const offset = (page - 1) * limit

        const collections = await db
          .withSchema(schema)
          .from("cms_collections")
          .leftJoin(
            "cms_documents",
            "cms_documents.collectionId",
            "=",
            "cms_collections.id"
          )
          .distinct("collectionId")
          .select(
            props?.columns || {
              id: "cms_collections.id",
              name: "cms_collections.name",
              columnOrder: "cms_collections.columnOrder",
              type: "cms_collections.type",
              roles: "cms_collections.roles",
              createdBy: "cms_collections.createdBy",
              createdAt: "cms_collections.createdAt",
              updatedBy: "cms_collections.updatedBy",
              updatedAt: "cms_collections.updatedAt",
            }
          )
          .limit(limit)
          .offset(offset)

        if (isEmpty(collections)) {
          return {
            data: [],
            totalPages: 0,
            error: "",
          }
        }

        const collectionsCount = await db
          .withSchema(schema)
          .from("cms_collections")
          .count("id")
          .as("totalPages")

        return {
          data: collections,
          totalPages: (collectionsCount[0] as any)?.count || 0,
          error: "",
        }
      } catch (error) {
        return {
          ...errorResponse(error),
          totalPages: 0,
        }
      }
    },

    async getAll(props): Promise<AppResponse<CmsCollectionView>> {
      try {
        const collections: CmsCollectionView[] = await db
          .withSchema(schema)
          .from("cms_collections")
          .leftJoin(
            "cms_collection_columns",
            "cms_collection_columns.collectionId",
            "=",
            "cms_collections.id"
          )
          .distinct("collectionId")
          .select(
            props?.columns || {
              id: "cms_collections.id",
              name: "cms_collections.name",
              columnOrder: "cms_collections.columnOrder",
              type: "cms_collections.type",
              roles: "cms_collections.roles",
              createdBy: "cms_collections.createdBy",
              createdAt: "cms_collections.createdAt",
              updatedBy: "cms_collections.updatedBy",
              updatedAt: "cms_collections.updatedAt",
            }
          )
          .then((rows) => {
            // Transform the result into the desired output format
            const collectionsMap: Record<string, CmsCollectionView> = {}

            rows.forEach((row) => {
              if (!collectionsMap[row.id as any]) {
                collectionsMap[row.id as any] = {
                  id: row.id,
                  name: row.name,
                  columns: [],
                }
              }
              collectionsMap[row.id as any].columns.push({
                columnId: row.columnId,
                columnName: row.columnName,
              })
            })
            return Object.values(collectionsMap)
          })

        if (isEmpty(collections)) {
          return {
            data: [],
            error: "",
          }
        }

        return {
          data: collections,
          error: "",
        }
      } catch (error) {
        return errorResponse(error)
      }
    },

    async remove({
      id,
      columns = ["id"],
    }): Promise<AppResponse<Partial<CmsCollection>>> {
      try {
        //TODO: delete columns and documents
        const result = await db
          .withSchema(schema)
          .from("cms_collections")
          .where("cms_collections.id", "=", id)
          .del(columns)

        return {
          data: result,
          error: "",
        }
      } catch (error) {
        return errorResponse(error)
      }
    },

    async insert({
      data,
      columns = ["id"],
      userId,
    }): Promise<AppResponse<Partial<CmsCollection>>> {
      try {
        const result = await db.transaction(async (trx) => {
          try {
            const collections = await trx
              .withSchema(schema)
              .insert(
                {
                  ...data,
                  updatedAt: new Date(),
                  updatedBy: userId,
                  createdAt: new Date(),
                  createdBy: userId,
                },
                columns
              )
              .into("cms_collections")

            await trx
              .withSchema(schema)
              .insert([
                {
                  columnName: "Title",
                  collectionId: collections[0].id,
                  fieldId: "title",
                  type: "title",
                  updatedAt: new Date(),
                  updatedBy: userId,
                  createdAt: new Date(),
                  createdBy: userId,
                  visibility: false,
                },
                {
                  columnName: "Created By",
                  collectionId: collections[0].id,
                  fieldId: "createdBy",
                  type: "info",
                  visibility: false,
                  updatedAt: new Date(),
                  updatedBy: userId,
                  createdAt: new Date(),
                  createdBy: userId,
                },
                {
                  columnName: "Created At",
                  collectionId: collections[0].id,
                  fieldId: "createdAt",
                  type: "infoDate",
                  visibility: false,
                  updatedAt: new Date(),
                  updatedBy: userId,
                  createdAt: new Date(),
                  createdBy: userId,
                },
                {
                  columnName: "Updated At",
                  collectionId: collections[0].id,
                  fieldId: "updatedAt",
                  type: "info",
                  visibility: false,
                  updatedAt: new Date(),
                  updatedBy: userId,
                  createdAt: new Date(),
                  createdBy: userId,
                },
                {
                  columnName: "Updated By",
                  collectionId: collections[0].id,
                  fieldId: "updatedBy",
                  type: "infoDate",
                  visibility: false,
                  updatedAt: new Date(),
                  updatedBy: userId,
                  createdAt: new Date(),
                  createdBy: userId,
                },
              ])
              .into("cms_collection_columns")
            return collections
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
    }): Promise<AppResponse<Partial<CmsCollection>>> {
      try {
        //TODO: updatedAt / updatedBy

        const result = await db
          .withSchema(schema)
          .from("cms_collections")
          .where("cms_collections.id", "=", id)
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

export default cmsCollectionsDao
