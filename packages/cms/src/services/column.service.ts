"use server"

import "server-only"

import { isNumber } from "@repo/lib/isNumber"
import { errorResponse } from "@repo/lib/utils/customError"

import {
  cmsCollectionColumnInsertValidate,
  cmsCollectionColumnUpdateValidate,
} from "../validators.cms"
import type {
  AppResponse,
  CmsCollectionColumn,
  CmsCollectionColumnInsert,
  CmsCollectionColumnUpdate,
} from "../types.cms"
import columnDao from "../dao/column.dao"

export type CmsColumnService = {
  get(props?: {
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
    returning?: (keyof CmsCollectionColumn)[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollectionColumn>>>

  update(props: {
    id: number
    collectionId: number
    data: CmsCollectionColumnUpdate
    returning?: (keyof CmsCollectionColumn)[]
    userId: number
  }): Promise<AppResponse<Partial<CmsCollectionColumn>>>
}

function cmsColumnService(schema: string): CmsColumnService {
  if (!schema) throw new Error("Must provide a schema for cmsColumnService")

  return {
    async get(props): Promise<
      AppResponse<Partial<CmsCollectionColumn>> & {
        totalPages: number
      }
    > {
      return columnDao(schema).getByFieldId(props)
    },

    async remove(props): Promise<AppResponse<Partial<CmsCollectionColumn>>> {
      return columnDao(schema).remove(props)
    },

    async insert({
      data: d,
      returning,
      userId,
    }): Promise<AppResponse<Partial<CmsCollectionColumn>>> {
      const { columnOrder = [], ...data } = d
      try {
        const dataWithMeta: CmsCollectionColumnInsert = {
          ...data,
          columnOrder,
          updatedAt: new Date(),
          updatedBy: userId,
          createdAt: new Date(),
          createdBy: userId,
        }

        const error = await cmsCollectionColumnInsertValidate(dataWithMeta)

        if (error instanceof Error) throw error

        const result = await columnDao(schema).insert({
          data: dataWithMeta,
          returning,
          userId,
        })

        return result
      } catch (error) {
        return errorResponse(error)
      }
    },

    async update({
      id,
      data,
      returning = ["id"],
      collectionId,
      userId,
    }): Promise<AppResponse<Partial<CmsCollectionColumn>>> {
      try {
        if (!isNumber(id)) throw new Error("ID must be a number")

        const error = await cmsCollectionColumnUpdateValidate(data)

        if (error instanceof Error) throw error

        const result = await columnDao(schema).update({
          collectionId,
          where: ["cms_collection_columns.id", "=", id],
          data,
          returning,
          userId,
        })

        return result
      } catch (error) {
        return errorResponse(error)
      }
    },
  }
}

export default cmsColumnService
