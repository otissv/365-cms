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
import { isEmpty } from "@repo/lib/isEmpty"

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
        if (isEmpty(userId)) {
          throw new Error("cmsColumnsService.insert requires a 'userId' prop")
        }

        const dataWithMeta: CmsCollectionColumnInsert = {
          ...data,
          columnOrder,
          updatedAt: new Date(),
          updatedBy: userId,
          createdAt: new Date(),
          createdBy: userId,
        }

        const error = await cmsCollectionColumnInsertValidate(
          dataWithMeta,
          "cmsColumnService.insert has invalid 'data' object prop"
        )

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
        if (!isNumber(id)) {
          throw new Error("cmsColumnsService.update 'id' must be a number")
        }
        if (isEmpty(userId)) {
          throw new Error("cmsColumnsService.update requires a 'userId' prop")
        }

        const error = await cmsCollectionColumnUpdateValidate(
          data,
          "cmsColumnService.update has invalid 'data' object prop"
        )

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
