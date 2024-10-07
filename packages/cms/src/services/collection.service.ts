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

//TODO: test returning '*'
//TODO: test omit
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
    omit?: (keyof CmsCollection)[]
    returning?: (keyof CmsCollection | "*")[]
  }): Promise<AppResponse<Partial<CmsCollection>>>
  insert(props: {
    data: CmsCollectionInsert
    omit?: (keyof CmsCollection)[]
    returning?: (keyof CmsCollection | "*")[]
    userId: CmsCollection["userId"]
  }): Promise<AppResponse<Partial<CmsCollection>>>
  update(props: {
    where: [CmsCollectionTableColumn<keyof CmsCollection>, string, any]
    data: CmsCollectionUpdate
    omit?: (keyof CmsCollection)[]
    returning?: (keyof CmsCollection | "*")[]
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

      userId,
      ...props
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
          ...props,
          data,
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
      userId,
      ...props
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
          ...props,
          where,
          data,
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
