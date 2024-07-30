"use server"

import "server-only"

import {
  cmsCollectionDocumentInsertValidate,
  cmsCollectionDocumentUpdateValidate,
} from "../validators.cms"
import type {
  AppResponse,
  CmsCollectionDocument,
  CmsCollectionDocumentInsert,
  CmsCollectionDocumentUpdate,
  CmsDocumentsView,
} from "../types.cms"
import documentDao from "../dao/documents.dao"

import { isError } from "@repo/lib/isError"
import { errorResponse } from "@repo/lib/utils/customError"

export type CmsDocumentServicesGetReturnType =
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

export type CmsDocumentServices = {
  get(
    props: {
      page?: number
      limit?: number
      where: [string, string, string]
      orderBy: [string, "asc" | "desc", "first" | "last"]
    },
    meta?: { userId: number }
  ): Promise<CmsDocumentServicesGetReturnType>

  remove(
    props: {
      id: number | number[]
      columns?: string[]
    },
    meta?: { userId: number }
  ): Promise<
    AppResponse<
      Partial<CmsCollectionDocument> | Partial<CmsCollectionDocument>[]
    >
  >
  insert(
    {
      data,
      columns,
    }: {
      data: CmsCollectionDocumentInsert
      columns?: string[]
    },
    meta?: { userId: number }
  ): Promise<AppResponse<Partial<CmsCollectionDocument>>>
  update(
    {
      data,
      id,
      columns,
    }: {
      data: CmsCollectionDocumentUpdate
      id?: number
      columns?: string[]
    },
    meta?: { userId: number }
  ): Promise<AppResponse<Partial<CmsCollectionDocument>>>
}

function cmsDocumentsServices(schema: string): CmsDocumentServices {
  if (!schema) throw new Error("Must provide a schema")

  return {
    async get(props): Promise<CmsDocumentServicesGetReturnType> {
      return documentDao(schema).get(props)
    },

    async remove(
      props
    ): Promise<
      AppResponse<
        Partial<CmsCollectionDocument> | Partial<CmsCollectionDocument>[]
      >
    > {
      return documentDao(schema).remove(props)
    },

    async insert(
      { data, columns = ["id"] },
      meta
    ): Promise<AppResponse<Partial<CmsCollectionDocument>>> {
      try {
        const error = await cmsCollectionDocumentInsertValidate(data)

        if (isError(error)) throw error
        return documentDao(schema).insert({
          data,
          columns,
          userId: meta?.userId as number,
        })
      } catch (error) {
        return errorResponse(error)
      }
    },

    async update(
      { data, id, columns = ["id"] },
      meta
    ): Promise<AppResponse<Partial<CmsCollectionDocument>>> {
      try {
        const error = await cmsCollectionDocumentUpdateValidate(data)
        if (isError(error)) throw error

        return documentDao(schema).update({
          id,
          data,
          columns,
          userId: meta?.userId as number,
        })
      } catch (error) {
        return errorResponse(error)
      }
    },
  }
}

export default cmsDocumentsServices
