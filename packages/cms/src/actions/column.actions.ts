import "server-only"

import cmsCollectionColumnServices from "../services/column.service"

import type {
  CmsCollectionColumnInsert,
  CmsCollectionColumnUpdate,
  SearchParams,
} from "../types.cms"
import { getDocumentsAction } from "./document.actions"
import { isEmpty } from "@repo/lib/isEmpty"

export function deleteColumnAction({ schema }: { schema: string }) {
  return async (props: {
    fieldId: string
  }) => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: [],
        error: "deleteColumnAction requires a 'schema' prop",
      }
    }

    if (isEmpty(props) || isEmpty(props?.fieldId)) {
      return {
        data: [],
        error:
          "deleteColumnAction requires a 'props' argument with fieldId and documentId props",
      }
    }

    return cmsCollectionColumnServices(schema).remove(props)
  }
}

export function insertColumnAction({
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
        error: "insertColumnAction requires a 'schema' prop",
      }
    }

    if (isEmpty(userId)) {
      return {
        data: [],
        error: "insertColumnAction requires a 'userId' prop",
      }
    }

    if (isEmpty(data)) {
      return {
        data: [],
        error: "insertColumnAction requires a 'data' prop",
      }
    }
    return cmsCollectionColumnServices(schema).insert({
      data,
      returning: ["*"],
      omit: ["createdAt", "createdBy", "updatedAt", "updatedBy"],
      userId,
    })
  }
}

export function sortColumnAction({
  schema,
  userId,
}: {
  schema: string
  userId: number
}) {
  return async ({
    id,
    collectionId,
    collectionName,
    searchParams,
  }: {
    id: number
    collectionId: number
    collectionName: string
    searchParams: Required<SearchParams>
  }) => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: {},
        error: "sortColumnAction requires a 'schema' prop",
        totalPages: 0,
      }
    }

    if (isEmpty(collectionName)) {
      return {
        data: {},
        error: "sortColumnAction requires a 'collectionName' prop",
        totalPages: 0,
      }
    }

    if (isEmpty(userId)) {
      return {
        data: {},
        error: "sortColumnAction requires a 'userId' prop",
        totalPages: 0,
      }
    }

    if (isEmpty(id)) {
      return {
        data: {},
        error: "sortColumnAction requires an 'id' prop",
        totalPages: 0,
      }
    }

    if (isEmpty(collectionId)) {
      return {
        data: {},
        error: "sortColumnAction requires an 'collectionId' prop",
        totalPages: 0,
      }
    }

    if (isEmpty(searchParams?.direction) || isEmpty(searchParams?.sortBy)) {
      return {
        data: {},
        error:
          "sortColumnAction requires searchParams with a direction and sortBy props",
        totalPages: 0,
      }
    }

    const { error } = await cmsCollectionColumnServices(schema).update({
      collectionId,
      id,
      data: { sortBy: searchParams?.direction },
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

export function updateColumnAction({
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
        error: "updateColumnAction requires a 'schema' prop",
      }
    }

    if (isEmpty(userId)) {
      return {
        data: [],
        error: "updateColumnAction requires a 'userId' prop",
      }
    }

    if (isEmpty(props)) {
      return {
        data: [],
        error: "updateColumnAction requires a 'props' prop",
      }
    }

    return cmsCollectionColumnServices(schema).update({
      ...props,
      userId,
    })
  }
}
