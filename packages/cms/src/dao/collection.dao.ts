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
} from "../types.cms"

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
    where: [string, string, any]
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
      columns = ["id"],
      where,
    }): Promise<AppResponse<Partial<CmsCollection>>> {
      try {
        if (isEmpty(where)) {
          throw new Error("remove requires a where tuple argument")
        }
        //TODO: delete columns and documents
        const result = await db
          .withSchema(schema)
          .from("cms_collections")
          .where(...where)
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
        const collections = await db
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

        return {
          data: collections,
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
