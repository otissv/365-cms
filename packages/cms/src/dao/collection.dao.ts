import "server-only"

import { getConnection } from "@repo/config/database"
import { isEmpty } from "@repo/lib/isEmpty"
import { errorResponse } from "@repo/lib/utils/customError"

import type {
  AppResponse,
  CmsCollection,
  CmsCollectionInsert,
  CmsCollectionTableColumn,
  CmsCollectionUpdate,
  CmsCollectionView,
} from "../types.cms"
import { omitColumnFromCollection } from "@repo/lib/utils/omitColumnFromCollection"

//TODO: test returning '*'
//TODO: test omit
export type CmsCollectionsDao = {
  get(props?: {
    page?: number
    limit?: number
    select?: Record<string, CmsCollectionTableColumn<keyof CmsCollection>>
    orderBy?: [string, "asc" | "desc", "first" | "last"]
  }): Promise<
    AppResponse<CmsCollection> & {
      totalPages: number
    }
  >
  getAll(props?: {
    select?: Record<string, CmsCollectionTableColumn<keyof CmsCollection>>
  }): Promise<AppResponse<CmsCollectionView>>
  remove(props: {
    where: [CmsCollectionTableColumn<keyof CmsCollection>, string, any]
    omit?: (keyof CmsCollection)[]
    returning?: (keyof CmsCollection | "*")[]
  }): Promise<AppResponse<Partial<CmsCollection>>>
  insert(props: {
    data: CmsCollectionInsert
    omit?: (keyof CmsCollection)[]
    returning?: (keyof CmsCollection | "*")[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollection>>>
  update(props: {
    where: [CmsCollectionTableColumn<keyof CmsCollection>, string, any]
    data: CmsCollectionUpdate
    omit?: (keyof CmsCollection)[]
    returning?: (keyof CmsCollection | "*")[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollection>>>
}

function cmsCollectionsDao(schema: string): CmsCollectionsDao {
  if (!schema) throw new Error("Must provide a schema for cmsCollectionsDao")

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
        const orderBy = props?.orderBy || ["id", "asc", "last"]

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
            props?.select
              ? { ...props?.select, id: "cms_collections.id" }
              : {
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
          .orderBy(...orderBy)
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
            props?.select || {
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
      omit,
      returning = ["id"],
      where,
    }): Promise<AppResponse<Partial<CmsCollection>>> {
      try {
        if (isEmpty(where)) {
          throw new Error(
            "cmsCollectionsDao.remove requires a 'where' tuple argument"
          )
        }

        return db.transaction(async (trx) => {
          try {
            const result = await trx
              .withSchema(schema)
              .from("cms_collections")
              .where(...where)
              .del([...returning, "id"])

            const collectionId = result[0]?.id

            if (isEmpty(result)) {
              return errorResponse("")
            }

            await trx
              .withSchema(schema)
              .from("cms_collection_columns")
              .where("collectionId", "=", collectionId)
              .del("id")

            await trx
              .withSchema(schema)
              .from("cms_documents")
              .where("collectionId", "=", collectionId)
              .del("id")

            return {
              data: omit
                ? omitColumnFromCollection<CmsCollection>()(omit)(result)
                : result,
              error: "",
            }
          } catch (error) {
            return errorResponse(error)
          }
        })
      } catch (error) {
        return errorResponse(error)
      }
    },

    async insert({
      data,
      omit,
      returning = ["id"],
      userId,
    }): Promise<AppResponse<Partial<CmsCollection>>> {
      try {
        if (isEmpty(data)) {
          throw new Error(
            "cmsCollectionsDao.insert requires a 'data' object argument"
          )
        }

        if (isEmpty(userId)) {
          throw new Error(
            "cmsCollectionsDao.insert requires a 'userId' argument"
          )
        }

        return db.transaction(async (trx) => {
          try {
            const collections = await trx
              .withSchema(schema)
              .insert(
                [
                  {
                    ...data,
                    updatedAt: new Date(),
                    updatedBy: userId,
                    createdAt: new Date(),
                    createdBy: userId,
                  },
                ],
                [...returning, "id"]
              )
              .into("cms_collections")

            const collectionId = collections[0].id

            const columnCount = await trx
              .withSchema(schema)
              .from("cms_collection_columns")
              .where("collectionId", "=", collectionId)
              .count()

            if (columnCount[0].count === "0") {
              const defaultColumnFields = [
                {
                  columnName: "Slug",
                  fieldId: "slug",
                  type: "text",
                  visibility: true,
                },
                {
                  columnName: "Created By",
                  fieldId: "createdBy",
                  type: "infoDate",
                },
                {
                  columnName: "Created At",
                  fieldId: "createdAt",
                  type: "info",
                },
                {
                  columnName: "Updated By",
                  fieldId: "updatedBy",
                  type: "infoDate",
                },
                {
                  columnName: "Updated At",
                  fieldId: "updatedAt",
                  type: "info",
                },
              ].map((fields) => ({
                collectionId,
                updatedAt: new Date(),
                updatedBy: userId,
                createdAt: new Date(),
                createdBy: userId,
                visibility: false,
                ...fields,
              }))

              // TODO: add text
              await trx
                .withSchema(schema)
                .insert(defaultColumnFields)
                .into("cms_collection_columns")

              // TODO: add text
              await trx
                .withSchema(schema)
                .insert({
                  collectionId,
                  data: {
                    slug: "",
                  },
                  updatedAt: new Date(),
                  updatedBy: userId,
                  createdAt: new Date(),
                  createdBy: userId,
                })
                .into("cms_documents")
            }

            return {
              data: omit
                ? omitColumnFromCollection<CmsCollection>()(omit)(collections)
                : collections,
              error: "",
            }
          } catch (error) {
            return errorResponse(error)
          }
        })
      } catch (error) {
        return errorResponse(error)
      }
    },

    async update({
      data,
      omit,
      returning = ["id"],
      userId,
      where,
    }): Promise<AppResponse<Partial<CmsCollection>>> {
      try {
        if (isEmpty(data)) {
          throw new Error(
            "cmsCollectionsDao.update collection requires a 'data' object argument"
          )
        }

        if (isEmpty(where)) {
          throw new Error(
            "cmsCollectionsDao.update collection requires a 'where' tuple argument"
          )
        }

        if (isEmpty(userId)) {
          throw new Error(
            "cmsCollectionsDao.update collection requires a 'userId' tuple argument"
          )
        }
        const result = await db
          .withSchema(schema)
          .from("cms_collections")
          .where(...where)
          .update(
            {
              ...data,
              updatedAt: new Date(),
              updatedBy: userId,
            },
            returning
          )

        return {
          data: omit
            ? omitColumnFromCollection<CmsCollection>()(omit)(result)
            : result,
          error: "",
        }
      } catch (error) {
        return errorResponse(error)
      }
    },
  }
}

export default cmsCollectionsDao
