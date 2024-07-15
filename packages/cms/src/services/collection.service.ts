"use server"

import "server-only"

import collectionDao from "@/dao/collection.dao"
import {
  cmsCollectionInsertValidate,
  cmsCollectionUpdateValidate,
} from "@/cms-validators"
import type {
  CmsCollection,
  CmsCollectionInsert,
  CmsCollectionUpdate,
  AppResponse,
  CmsCollectionView,
} from "@/cms.types"
import { isNumber } from "@repo/lib/isNumber"
import { errorResponse } from "@repo/lib/utils/customError"

export type CmsCollectionServices = {
  get(
    props?: {
      page?: number
      limit?: number
      columns?: Record<string, string>
    },
    meta?: { userId: number }
  ): Promise<
    AppResponse<CmsCollection> & {
      totalPages: number
    }
  >
  getAll(
    props?: {
      columns?: Record<string, string>
    },
    meta?: { userId: number }
  ): Promise<AppResponse<CmsCollectionView>>
  insert(
    props: {
      data: CmsCollectionInsert
      columns?: string[]
    },
    meta?: { userId: number }
  ): Promise<AppResponse<Partial<CmsCollection>>>
  remove(props: {
    id: number
    columns?: (keyof CmsCollection)[]
  }): Promise<AppResponse<Partial<CmsCollection>>>
  update(
    props: {
      id: number
      data: CmsCollectionUpdate
      columns?: (keyof CmsCollection)[]
    },
    meta?: { userId: number }
  ): Promise<AppResponse<Partial<CmsCollection>>>
}

function cmsCollectionServices(schema: string): CmsCollectionServices {
  if (!schema) throw new Error("Must provide a schema")

  return {
    async get(props): Promise<
      AppResponse<CmsCollection> & {
        totalPages: number
      }
    > {
      return collectionDao(schema).get(props)
    },

    async getAll(props): Promise<AppResponse<CmsCollectionView>> {
      return collectionDao(schema).getAll(props)
    },

    async insert(
      { data, columns },
      meta
    ): Promise<AppResponse<Partial<CmsCollection>>> {
      try {
        const dataWithUserId: CmsCollectionInsert = {
          ...data,
          userId: meta?.userId as number,
        }

        const error = await cmsCollectionInsertValidate(dataWithUserId)
        if (error instanceof Error) throw error

        const result = await collectionDao(schema).insert({
          data,
          columns,
          userId: meta?.userId as number,
        })

        return result
      } catch (error) {
        return errorResponse(error)
      }
    },

    async remove(props): Promise<AppResponse<Partial<CmsCollection>>> {
      return collectionDao(schema).remove(props)
    },

    async update(
      { id, data, columns = ["id"] },
      meta
    ): Promise<AppResponse<Partial<CmsCollectionUpdate>>> {
      try {
        if (!isNumber(id)) {
          throw new Error("ID must be a number")
        }

        const error = await cmsCollectionUpdateValidate(data)

        if (error instanceof Error) throw error

        const result = await collectionDao(schema).update({
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

export default cmsCollectionServices
