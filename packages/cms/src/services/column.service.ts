"use server"

import "server-only"

import columnDao from "@/dao/column.dao"
import {
  cmsCollectionColumnInsertValidate,
  cmsCollectionColumnUpdateValidate,
} from "@/cms-validators"
import type {
  CmsCollectionColumn,
  CmsCollectionColumnInsert,
  CmsCollectionColumnUpdate,
  AppResponse,
} from "@/cms.types"
import { isNumber } from "@repo/lib/isNumber"
import { errorResponse } from "@repo/lib/utils/customError"

export type CmsDocumentServices = {
  getByCollectionIdAndFieldId(
    props?: {
      collectionId: number
      fieldId: string
      columns?: Record<string, string> | string[]
    },
    meta?: { userId: number }
  ): Promise<
    AppResponse<Partial<CmsCollectionColumn>> & {
      totalPages: number
    }
  >
  remove(
    props: {
      fieldId: string
      columns?: (keyof CmsCollectionColumn)[]
    },
    meta?: { userId: number }
  ): Promise<AppResponse<Partial<CmsCollectionColumn>>>
  insert(
    props: {
      data: Omit<
        CmsCollectionColumnInsert,
        "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
      >
      columns?: (keyof CmsCollectionColumn)[]
    },
    meta?: { userId: number }
  ): Promise<AppResponse<Partial<CmsCollectionColumn>>>

  update(
    props: {
      id: number
      data: CmsCollectionColumnUpdate
      columns?: (keyof CmsCollectionColumn)[]
    },
    meta?: { userId: number }
  ): Promise<AppResponse<Partial<CmsCollectionColumn>>>
}

function cmsCollectionColumnServices(schema: string): CmsDocumentServices {
  if (!schema) throw new Error("Must provide a schema")

  return {
    async getByCollectionIdAndFieldId(props): Promise<
      AppResponse<Partial<CmsCollectionColumn>> & {
        totalPages: number
      }
    > {
      return columnDao(schema).getByCollectionIdAndFieldId(props)
    },

    async remove(props): Promise<AppResponse<Partial<CmsCollectionColumn>>> {
      return columnDao(schema).remove(props)
    },

    async insert(
      { data: { columnOrder, ...data }, columns },
      meta
    ): Promise<AppResponse<Partial<CmsCollectionColumn>>> {
      try {
        const dataWithMeta: CmsCollectionColumnInsert = {
          ...data,
          columnOrder,
          updatedAt: new Date(),
          updatedBy: meta?.userId as number,
          createdAt: new Date(),
          createdBy: meta?.userId as number,
        }

        const error = await cmsCollectionColumnInsertValidate(dataWithMeta)

        if (error instanceof Error) throw error

        const result = await columnDao(schema).insert({
          data: dataWithMeta,
          columns,
          userId: meta?.userId as number,
        })

        return result
      } catch (error) {
        return errorResponse(error)
      }
    },

    async update(
      { id, data, columns = ["id"] },
      meta
    ): Promise<AppResponse<Partial<CmsCollectionColumn>>> {
      try {
        if (!isNumber(id)) throw new Error("ID must be a number")

        const error = await cmsCollectionColumnUpdateValidate(data)

        if (error instanceof Error) throw error

        const result = await columnDao(schema).update({
          id,
          data,
          columns,
          userId: meta?.userId as number,
        })

        return result
      } catch (error) {
        return errorResponse(error)
      }
    },
  }
}

export default cmsCollectionColumnServices
