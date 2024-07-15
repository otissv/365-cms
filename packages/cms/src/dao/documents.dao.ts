import "server-only"

import { isEmpty } from "@repo/lib/isEmpty"
import { getConnection } from "@repo/config/database"
import type {
  AppResponse,
  CmsCollectionDocument,
  CmsDocumentsView,
  CmsCollectionDocumentUpdate,
  CmsCollectionDocumentInsert,
  CmsCollectionColumn,
  CmsCollection,
} from "@/cms.types"
import { errorResponse } from "@repo/lib/utils/customError"
import { mayBeToNumber } from "@repo/lib/mayBeToNumber"

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

export type CmsDocumentsDao = {
  get(props: {
    page?: number
    limit?: number
    where: [keyof CmsCollectionDocument, string, string]
    orderBy: [string, "asc" | "desc", "first" | "last"]
  }): Promise<CmsDocumentsDaoGetReturnType>
  remove(props: {
    id: number | number[]
    columns?: string[]
  }): Promise<
    AppResponse<
      Partial<CmsCollectionDocument> | Partial<CmsCollectionDocument>[]
    >
  >
  insert(props: {
    data: CmsCollectionDocumentInsert
    id?: number
    columns?: string[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollectionDocument>>>
  update(props: {
    data: CmsCollectionDocumentUpdate
    id?: number
    columns?: string[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollectionDocument>>>
}

function cmsCollectionDocumentsDao(schema: string): CmsDocumentsDao {
  if (!schema) throw new Error("Must provide a schema")

  const db = getConnection()

  const methods: CmsDocumentsDao = {
    async get(props): Promise<CmsDocumentsDaoGetReturnType> {
      try {
        const page = props?.page || 1
        const limit = props?.limit || 10
        const offset = (page - 1) * limit
        const where: [any] = props.where as any
        const orderBy = props.orderBy

        const collection = await db
          .withSchema(schema)
          .select("id")
          .from("cms_collections")
          .where(...where)

        if (isEmpty(collection[0])) {
          return {
            data: [],
            error: "",
            totalPages: 0,
          }
        }

        let order = ""

        if (
          orderBy[0] === "createdBy" ||
          orderBy[0] === "createdAt" ||
          orderBy[0] === "updatedBy" ||
          orderBy[0] === "updatedAt"
        ) {
          order = `cms_documents."${orderBy[0]}" ${orderBy[1]}`
        } else {
          order = `(data->>'${orderBy[0]}')::text ${orderBy[1]}`
        }

        const collectionId = collection[0].id

        type Query = {
          collectionId: CmsCollectionDocument["collectionId"]
          collectionName: CmsCollection["name"]
          columnOrder: CmsCollection["columnOrder"]
          type: CmsCollection["type"]
          roles: CmsCollection["roles"]
          columns: CmsCollectionColumn[]
          data: Record<string, any>[]
        }

        const query: CmsDocumentsView[] = await db
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
                          'filter', cms_collection_columns."filter",
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
          .with("collection_data", function () {
            // @ts-ignore
            this.withSchema(schema)
              .from("cms_documents")
              .select(
                "collectionId",

                db.raw(`
                      json_agg(
                          json_build_object(
                              'id', cms_documents.id,
                              'data', cms_documents.data,
                              'createdBy', cms_documents."createdBy",
                              'createdAt', cms_documents."createdAt",
                              'updatedBy', cms_documents."updatedBy",
                              'updatedAt', cms_documents."updatedAt"
                          )
                          ORDER BY ${order}
                      ) AS data
                  `)
              )
              .where("cms_documents.collectionId", "=", collectionId)
              .groupBy("collectionId")
              .limit(limit)
              .offset(offset)
          })
          .select([
            "cd.collectionId",
            "cd.collectionName",
            "cd.columnOrder",
            "cd.type",
            "cd.roles",
            "cc.columns",
            "cdta.data",
          ])
          .from(db.raw('"collection_docs" as cd'))
          .leftJoin(
            db.raw('"collection_columns" as cc'),
            "cd.collectionId",
            "cc.collectionId"
          )
          .leftJoin(
            db.raw('"collection_data" as cdta'),
            "cd.collectionId",
            "cdta.collectionId"
          )

        const totalPages = await db
          .withSchema(schema)
          .count("collectionId")
          .from("cms_documents")
          .where("collectionId", "=", collectionId)

        const documents = query[0] || {}

        const data: CmsDocumentsView[] = [
          {
            ...documents,
            columnOrder: documents.columnOrder || [],
            roles: documents.roles || [],
            columns: documents.columns || [],
            data: (query[0]?.data || []).map(
              ({
                id,
                data,
                ...rest
              }: { id: string; data: Record<string, any>; rest: any[] }) => ({
                id,
                ...data,
                ...rest,
              })
            ),
          },
        ]

        return {
          data,
          totalPages: mayBeToNumber()(totalPages[0]?.count) || 0,
          error: "",
        }
      } catch (error) {
        return {
          ...errorResponse(error),
          totalPages: 0,
        }
      }
    },

    async remove({ id, columns = ["id"] }) {
      try {
        let result: (
          | Partial<CmsCollectionDocument>
          | Partial<CmsCollectionDocument>[]
        )[]

        if (Array.isArray(id)) {
          const ids = id as [number]

          result = await Promise.all(
            ids.map((i) =>
              db
                .withSchema(schema)
                .from("cms_documents")
                .where("cms_documents.id", "=", i)
                .del(columns)
            )
          )
        } else {
          result = (await db
            .withSchema(schema)
            .from("cms_documents")
            .where("cms_documents.id", "=", id)
            .del(columns)) as Partial<CmsCollectionDocument>[]
        }

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
      columns = ["id"],
      userId,
    }): Promise<AppResponse<Partial<CmsCollectionDocument>>> {
      try {
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

    async update({
      data,
      id,
      columns = ["id"],
      userId,
    }): Promise<AppResponse<Partial<CmsCollectionDocument>>> {
      try {
        const documents = await db
          .withSchema(schema)
          .from("cms_documents")
          .select("data")
          .where("cms_documents.id" as any, "=", id as any)

        const result = await db
          .withSchema(schema)
          .from("cms_documents")
          .where("cms_documents.id" as any, "=", id as any)
          .update(
            {
              data: { ...documents[0]?.data, ...data.data },
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

  return methods
}

export default cmsCollectionDocumentsDao
