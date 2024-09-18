import "server-only"

import { getConnection } from "@repo/config/database"
import { isEmpty } from "@repo/lib/isEmpty"
import { mayBeToNumber } from "@repo/lib/mayBeToNumber"
import { errorResponse } from "@repo/lib/utils/customError"

import type {
  AppResponse,
  CmsCollectionDocument,
  CmsCollectionDocumentInsert,
  CmsCollectionDocumentTableColumn,
  CmsCollectionDocumentUpdate,
  CmsDocumentsView,
} from "../types.cms"

type CmsDocumentsDaoGetReturnType =
  | {
      data: []
      error: string
      totalPages: 0
    }
  | {
      data: CmsDocumentsView[]
      error: string
      totalPages: number
    }

type CmsDocumentsDaoRemoveWhereEquals = [
  CmsCollectionDocumentTableColumn<keyof CmsCollectionDocument>,
  string,
  any,
]

type CmsDocumentsDaoRemoveWhereAndOr = (
  | CmsDocumentsDaoRemoveWhereEquals
  | "AND"
  | "OR"
)[]

export type CmsDocumentsDaoRemoveWhere =
  | CmsDocumentsDaoRemoveWhereEquals
  | CmsDocumentsDaoRemoveWhereAndOr

export type CmsDocumentsDao = {
  get(props: {
    page?: number
    limit?: number
    /** [column, direction, nulls] */
    orderBy?: [string, "asc" | "desc", "first" | "last"]
    collectionName: string
  }): Promise<CmsDocumentsDaoGetReturnType>
  remove(props: {
    where: CmsDocumentsDaoRemoveWhere
    returning?: (keyof CmsCollectionDocument)[]
  }): Promise<
    AppResponse<
      Partial<CmsCollectionDocument> | Partial<CmsCollectionDocument>[]
    >
  >
  insert(props: {
    data: CmsCollectionDocumentInsert
    returning?: (keyof CmsCollectionDocument)[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollectionDocument>>>
  update(props: {
    where: [
      CmsCollectionDocumentTableColumn<keyof CmsCollectionDocument>,
      string,
      any,
    ]
    data: CmsCollectionDocumentUpdate["data"]
    returning?: (keyof CmsCollectionDocument)[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollectionDocument>>>
}

function cmsCollectionDocumentsDao(schema: string): CmsDocumentsDao {
  if (!schema)
    throw new Error("Must provide a schema for cmsCollectionDocumentsDao")

  const db = getConnection()

  const methods: CmsDocumentsDao = {
    async get(props): Promise<CmsDocumentsDaoGetReturnType> {
      try {
        if (!props?.collectionName) {
          return {
            data: [],
            error: "",
            totalPages: 0,
          }
        }

        const page = props?.page || 1
        const limit = props?.limit || 10
        const offset = (page - 1) * limit
        const orderBy = props?.orderBy || []

        const collection = await db
          .withSchema(schema)
          .select("id")
          .from("cms_collections")
          .where("cms_collections.name", "=", props?.collectionName)

        if (isEmpty(collection[0])) {
          return {
            data: [],
            error: "",
            totalPages: 0,
          }
        }

        const keys = [
          "id",
          "collectionId",
          "createdAt",
          "createdBy",
          "updatedAt",
          "updatedBy",
        ]

        let keysOrderBy = ""
        let dataOrderBy = ""

        if (keys.includes(orderBy[0] || "")) {
          keysOrderBy = `ORDER BY "${orderBy[0] || "id"}" ${orderBy[1] || "asc"} NULLS ${orderBy[2] || "last"}`
        } else if (orderBy[0]) {
          dataOrderBy = `ORDER BY cms_documents.data->>'${orderBy[0] || "id"}' ${orderBy[1] || "asc"} NULLS ${orderBy[2] || "last"}`
        }

        const collectionId = collection[0].id

        const documents = await db
          .raw(
            `
                SELECT
                  json_agg(
                    json_build_object(
                        'id', cms_documents.id,
                        'collectionId', cms_documents."collectionId",
                        'data', cms_documents.data,
                        'createdBy', cms_documents."createdBy",
                        'createdAt', cms_documents."createdAt",
                        'updatedBy', cms_documents."updatedBy",
                        'updatedAt', cms_documents."updatedAt"
                    )
                    ${dataOrderBy}
                  ) as data
                FROM (
                  SELECT *
                    FROM ${schema}.cms_documents
                    WHERE cms_documents."collectionId" = ${collectionId}
                    ${keysOrderBy}
                    LIMIT ${limit}
                    OFFSET ${offset}
                ) as cms_documents
      `
          )
          .then(({ rows }) => rows[0].data)

        const query = await db
          .with("collection_docs", function () {
            // @ts-ignore
            this.withSchema(schema)
              .select([
                "cms_collections.id as collectionId",
                "cms_collections.name as collectionName",
                "cms_collections.columnOrder as columnOrder",
                "cms_collections.type as type",
                "cms_collections.roles as roles",
              ])
              .from("cms_collections")
              .where("cms_collections.id", "=", collectionId)
              .leftJoin(
                "cms_documents",
                "cms_collections.id",
                "cms_documents.collectionId"
              )
              .groupBy([
                "cms_collections.id",
                "cms_collections.name",
                "cms_collections.columnOrder",
                "cms_collections.type",
                "cms_collections.roles",
              ])
          })
          .with("collection_columns", function () {
            // @ts-ignore
            this.withSchema(schema)
              .from("cms_collection_columns")
              .select(
                "collectionId",
                db.raw(`
                  json_agg(
                      json_build_object(
                          'id', cms_collection_columns."id",
                          'columnName', cms_collection_columns."columnName",
                          'fieldId', cms_collection_columns."fieldId",
                          'type', cms_collection_columns."type",
                          'fieldOptions', cms_collection_columns."fieldOptions",
                          'validation', cms_collection_columns."validation",
                          'help', cms_collection_columns."help",
                          'enableDelete', cms_collection_columns."enableDelete",
                          'enableSort', cms_collection_columns."enableSort",
                          'enableHide', cms_collection_columns."enableHide",
                          'enableFilter', cms_collection_columns."enableFilter",
                          'sortBy', cms_collection_columns."sortBy",
                          'visibility', cms_collection_columns."visibility",
                          'index', cms_collection_columns."index"
                      )
                  ) AS columns
              `)
              )
              .groupBy("cms_collection_columns.collectionId")
              .where("cms_collection_columns.collectionId", "=", collectionId)
          })
          .select([
            "cd.collectionId",
            "cd.collectionName",
            "cd.columnOrder",
            "cd.type",
            "cd.roles",
            "cc.columns",
          ])
          .from(db.raw('"collection_docs" as cd'))
          .leftJoin(
            db.raw('"collection_columns" as cc'),
            "cd.collectionId",
            "cc.collectionId"
          )

        const totalDocs = await db
          .withSchema(schema)
          .count("collectionId")
          .from("cms_documents")
          .where("collectionId", "=", collectionId)

        const docCollection = query[0]

        const data: CmsDocumentsView[] = [
          {
            ...docCollection,
            columnOrder: docCollection.columnOrder || [],
            roles: docCollection.roles || [],
            columns: docCollection.columns || [],
            data: (documents || []).map(
              (doc: {
                id: number
                collectionId: number
                data: Record<string, any>
                createdBy: string
                createdAt: string
                updatedBy: string
                updatedAt: string
              }) => {
                const { data, ...rest } = doc
                return { ...data, ...rest }
              }
            ),
          },
        ]

        const totalPages = Math.ceil(
          mayBeToNumber()(totalDocs[0]?.count) / limit
        )

        return {
          data,
          totalPages,
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
      where,
      returning = ["id"],
    }): Promise<
      AppResponse<
        Partial<CmsCollectionDocument> | Partial<CmsCollectionDocument>[]
      >
    > {
      try {
        if (isEmpty(where)) {
          return {
            data: [],
            error:
              "cmsCollectionDocumentsDao.remove collection requires a 'where' tuple prop",
          }
        }

        if (Array.isArray(where[0])) {
          const whereRaw = db.raw(`${where.flat().join(" ")}`)
          const result = (await db
            .withSchema(schema)
            .from("cms_documents")
            .whereRaw(whereRaw)
            .del(returning)) as Partial<CmsCollectionDocument>[]

          return {
            data: result,
            error: "",
          }
        }

        const result = (await db
          .withSchema(schema)
          .from("cms_documents")
          .where(...(where as CmsDocumentsDaoRemoveWhereEquals))
          .del(returning)) as Partial<CmsCollectionDocument>[]

        return {
          data: result,
          error: "",
        }
      } catch (error) {
        return errorResponse(error)
      }
    },

    async insert({
      data: { collectionId, data },
      returning = ["id"],
      userId,
    }): Promise<AppResponse<Partial<CmsCollectionDocument>>> {
      try {
        if (isEmpty(data)) {
          return {
            data: [],
            error:
              "cmsCollectionDocumentsDao.insert collection requires a 'data' object prop",
          }
        }

        if (isEmpty(collectionId)) {
          return {
            data: [],
            error:
              "cmsCollectionDocumentsDao.insert collection requires a collectionId prop",
          }
        }

        if (isEmpty(userId)) {
          throw new Error(
            "cmsCollectionDocumentsDao.insert collection requires a 'userId'"
          )
        }

        const result = await db
          .withSchema(schema)
          .from("cms_documents")
          .insert(
            data.map((d: any) => ({
              collectionId,
              data: d,
              updatedAt: new Date(),
              updatedBy: userId,
              createdAt: new Date(),
              createdBy: userId,
            })),
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

    async update({
      data,
      where,
      returning = ["id"],
      userId,
    }): Promise<AppResponse<Partial<CmsCollectionDocument>>> {
      try {
        if (isEmpty(data)) {
          return {
            data: [],
            error:
              "cmsCollectionDocumentsDao.update collection requires a 'data' object prop",
          }
        }

        if (isEmpty(where)) {
          throw new Error(
            "cmsCollectionDocumentsDao.update collection requires a 'where' tuple prop"
          )
        }

        if (isEmpty(userId)) {
          throw new Error(
            "cmsCollectionDocumentsDao.update collection requires a 'userId'"
          )
        }
        const documents = await db
          .withSchema(schema)
          .from("cms_documents")
          .select("data")
          .where(...where)

        const result = await db
          .withSchema(schema)
          .from("cms_documents")
          .where(...where)
          .update(
            {
              data: { ...documents[0]?.data, ...data },
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

  return methods
}

export default cmsCollectionDocumentsDao
