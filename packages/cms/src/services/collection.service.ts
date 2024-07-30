"use server"

import "server-only"

import { isNumber } from "@repo/lib/isNumber"
import { errorResponse } from "@repo/lib/utils/customError"

import {
  cmsCollectionInsertValidate,
  cmsCollectionUpdateValidate,
} from "../validators.cms"
import type {
  AppResponse,
  CmsCollection,
  CmsCollectionInsert,
  CmsCollectionUpdate,
  CmsCollectionView,
} from "../types.cms"
import collectionDao from "../dao/collection.dao"

export type CmsCollectionServices = {
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
  insert(props: {
    data: CmsCollectionInsert
    columns?: string[]
    userId: CmsCollection["userId"]
  }): Promise<AppResponse<Partial<CmsCollection>>>
  remove(props: {
    id: number
    columns?: (keyof CmsCollection)[]
  }): Promise<AppResponse<Partial<CmsCollection>>>
  update(props: {
    id: number
    data: CmsCollectionUpdate
    columns?: (keyof CmsCollection)[]
    userId: CmsCollection["userId"]
  }): Promise<AppResponse<Partial<CmsCollection>>>
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

    async insert({
      data,
      columns,
      userId,
    }): Promise<AppResponse<Partial<CmsCollection>>> {
      try {
        const dataWithUserId: CmsCollectionInsert = {
          ...data,
          userId,
        }

        const error = await cmsCollectionInsertValidate(dataWithUserId)
        if (error instanceof Error) throw error

        const result = await collectionDao(schema).insert({
          data,
          columns,
          userId,
        })

        return result
      } catch (error) {
        return errorResponse(error)
      }
    },

    async remove(props): Promise<AppResponse<Partial<CmsCollection>>> {
      return collectionDao(schema).remove(props)
    },

    async update({
      id,
      data,
      columns = ["id"],
      userId,
    }): Promise<AppResponse<Partial<CmsCollectionUpdate>>> {
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
          userId,
        })

        return result
      } catch (error) {
        return errorResponse(error)
      }
    },
  }
}

export default cmsCollectionServices
