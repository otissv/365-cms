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
import documentDao, {
  type CmsDocumentsDaoRemoveWhere,
} from "../dao/documents.dao"

import { isError } from "@repo/lib/isError"
import { insertBetween } from "@repo/lib/utils/insertBetween"
import { errorResponse } from "@repo/lib/utils/customError"
import { isEmpty } from "@repo/lib/isEmpty"

export type CmsDocumentServiceGetReturnType =
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

export type CmsDocumentService = {
  get(props: {
    page?: number
    limit?: number
    orderBy?: [string, "asc" | "desc", "first" | "last"]
    collectionName: string
  }): Promise<CmsDocumentServiceGetReturnType>

  remove(props: {
    ids: number[]
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
    data: CmsCollectionDocumentUpdate["data"]
    id?: number
    returning?: (keyof CmsCollectionDocument)[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollectionDocument>>>
}

function cmsDocumentsService(schema: string): CmsDocumentService {
  if (!schema) throw new Error("Must provide a schema for cmsDocumentsService")

  return {
    async get(props): Promise<CmsDocumentServiceGetReturnType> {
      return documentDao(schema).get(props)
    },

    async remove({
      ids,
      returning,
    }): Promise<
      AppResponse<
        Partial<CmsCollectionDocument> | Partial<CmsCollectionDocument>[]
      >
    > {
      const x = ids.map((id) => ["cms_documents.id", "=", id])
      const where = insertBetween("OR")(x) as CmsDocumentsDaoRemoveWhere

      // const combined

      return documentDao(schema).remove({
        where,
        returning,
      })
    },

    async insert({
      data,
      returning = ["id"],
      userId,
    }): Promise<AppResponse<Partial<CmsCollectionDocument>>> {
      try {
        if (isEmpty(userId)) {
          throw new Error("cmsDocumentsService.insert requires a 'userId' prop")
        }
        const error = await cmsCollectionDocumentInsertValidate(
          data,
          "cmsDocumentsService.insert has invalid 'data' object data"
        )

        if (isError(error)) throw error
        return documentDao(schema).insert({
          data,
          returning,
          userId,
        })
      } catch (error) {
        return errorResponse(error)
      }
    },

    async update({
      data,
      id,
      returning = ["id"],
      userId,
    }): Promise<AppResponse<Partial<CmsCollectionDocument>>> {
      try {
        if (isEmpty(userId)) {
          throw new Error("cmsDocumentsService.update requires a 'userId' prop")
        }

        const error = await cmsCollectionDocumentUpdateValidate(
          { data },
          "cmsDocumentsService.update has invalid 'data' object prop"
        )

        if (isError(error)) throw error

        return documentDao(schema).update({
          where: ["cms_documents.id", "=", id],
          data,
          returning,
          userId,
        })
      } catch (error) {
        return errorResponse(error)
      }
    },
  }
}

export default cmsDocumentsService
