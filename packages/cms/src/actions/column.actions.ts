import "server-only"

import cmsCollectionColumnServices from "../services/column.service"

import type {
  CmsCollectionColumn,
  CmsCollectionColumnInsert,
  CmsCollectionColumnUpdate,
  SearchParams,
} from "../types.cms"
import { getDocumentsAction } from "./document.actions"
import { isEmpty } from "@repo/lib/isEmpty"

export function onDeleteColumnAction({ schema }: { schema: string }) {
  return async (props: {
    fieldId: string
  }) => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: [],
        error: "onDeleteColumnAction requires a 'schema' prop",
      }
    }

    if (isEmpty(props) || isEmpty(props?.fieldId)) {
      return {
        data: [],
        error:
          "onDeleteColumnAction requires a 'props' argument with fieldId and documentId props",
      }
    }

    return cmsCollectionColumnServices(schema).remove(props)
  }
}

export function onInsertColumnAction({
  schema,
  userId,
}: { schema: string; userId: number }) {
  return async (
    data: Omit<
      CmsCollectionColumnInsert,
      "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
    >
  ) => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: [],
        error: "onInsertColumnAction requires a 'schema' prop",
      }
    }

    if (isEmpty(userId)) {
      return {
        data: [],
        error: "onInsertColumnAction requires a 'userId' prop",
      }
    }

    if (isEmpty(data)) {
      return {
        data: [],
        error: "onInsertColumnAction requires a 'data' prop",
      }
    }
    return cmsCollectionColumnServices(schema).insert({
      data,
      returning: [
        "id",
        "fieldId",
        "collectionId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
      ],
      userId,
    })
  }
}

export function onSortColumnAction({
  schema,
  collectionName,
  searchParams,
  userId,
}: {
  schema: string
  collectionName: string
  searchParams?: SearchParams
  userId: number
}) {
  return async ({
    id,
    collectionId,
    sortBy,
  }: {
    id: number
    collectionId: number
    sortBy: CmsCollectionColumn["sortBy"]
  }) => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: {},
        error: "onSortColumnAction requires a 'schema' prop",
        totalPages: 0,
      }
    }

    if (isEmpty(collectionName)) {
      return {
        data: {},
        error: "onSortColumnAction requires a 'collectionName' prop",
        totalPages: 0,
      }
    }

    if (isEmpty(userId)) {
      return {
        data: {},
        error: "onSortColumnAction requires a 'userId' prop",
        totalPages: 0,
      }
    }

    if (isEmpty(id)) {
      return {
        data: {},
        error: "onSortColumnAction requires an 'id' prop",
        totalPages: 0,
      }
    }

    if (isEmpty(collectionId)) {
      return {
        data: {},
        error: "onSortColumnAction requires an 'collectionId' prop",
        totalPages: 0,
      }
    }

    if (isEmpty(sortBy)) {
      return {
        data: {},
        error: "onSortColumnAction requires an 'sortBy' prop",
        totalPages: 0,
      }
    }

    const { error } = await cmsCollectionColumnServices(schema).update({
      collectionId,
      id,
      data: { sortBy },
      userId,
    })

    if (error) {
      return {
        data: {},
        error,
        totalPages: 0 as number,
      }
    }

    return getDocumentsAction({ schema })({
      ...(searchParams ? { searchParams } : {}),
      collectionName,
    })
  }
}

export function onUpdateColumnAction({
  schema,
  userId,
}: { schema: string; userId: number }) {
  return async (props: {
    id: number
    collectionId: number
    data: CmsCollectionColumnUpdate
  }) => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: [],
        error: "onUpdateColumnAction requires a 'schema' prop",
      }
    }

    if (isEmpty(userId)) {
      return {
        data: [],
        error: "onUpdateColumnAction requires a 'userId' prop",
      }
    }

    if (isEmpty(props)) {
      return {
        data: [],
        error: "onUpdateColumnAction requires a 'props' prop",
      }
    }

    return cmsCollectionColumnServices(schema).update({
      ...props,
      userId,
    })
  }
}
