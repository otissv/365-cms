"use server"

import "server-only"

import { errorResponse } from "@repo/lib/utils/customError"

import {
  cmsCollectionInsertValidate,
  cmsCollectionUpdateValidate,
} from "../validators.cms"
import type {
  AppResponse,
  CmsCollection,
  CmsCollectionInsert,
  CmsCollectionTableColumn,
  CmsCollectionUpdate,
  CmsCollectionView,
} from "../types.cms"
import collectionDao from "../dao/collection.dao"
import { isEmpty } from "@repo/lib/isEmpty"

export type CmsCollectionService = {
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
    returning?: (keyof CmsCollection)[]
  }): Promise<AppResponse<Partial<CmsCollection>>>
  insert(props: {
    data: CmsCollectionInsert
    returning?: (keyof CmsCollection)[]
    userId: CmsCollection["userId"]
  }): Promise<AppResponse<Partial<CmsCollection>>>
  update(props: {
    where: [CmsCollectionTableColumn<keyof CmsCollection>, string, any]
    data: CmsCollectionUpdate
    returning?: (keyof CmsCollection)[]
    userId: CmsCollection["userId"]
  }): Promise<AppResponse<Partial<CmsCollection>>>
}

function cmsCollectionService(schema: string): CmsCollectionService {
  if (!schema) throw new Error("Must provide a schema for cmsCollectionService")

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

    async remove(props): Promise<AppResponse<Partial<CmsCollection>>> {
      return collectionDao(schema).remove(props)
    },

    async insert({
      data,
      returning,
      userId,
    }): Promise<AppResponse<Partial<CmsCollection>>> {
      try {
        if (isEmpty(userId)) {
          throw new Error(
            "cmsCollectionService.insert requires a 'userId' prop"
          )
        }

        const dataWithUserId: CmsCollectionInsert = {
          ...data,
          userId,
        }

        const error = await cmsCollectionInsertValidate(
          dataWithUserId,
          "cmsCollectionService.insert has invalid 'data' object prop"
        )
        if (error instanceof Error) throw error

        const result = await collectionDao(schema).insert({
          data,
          returning,
          userId,
        })

        return result
      } catch (error) {
        return errorResponse(error)
      }
    },

    async update({
      where,
      data,
      returning = ["id"],
      userId,
    }): Promise<AppResponse<Partial<CmsCollectionUpdate>>> {
      try {
        if (isEmpty(userId)) {
          throw new Error(
            "cmsCollectionService.update requires a 'userId' prop"
          )
        }

        const error = await cmsCollectionUpdateValidate(
          data,
          "cmsCollectionService.update has invalid 'data' object prop"
        )

        if (error instanceof Error) throw error

        const result = await collectionDao(schema).update({
          where,
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

export default cmsCollectionService
