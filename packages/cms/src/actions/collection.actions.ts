import "server-only"

import type { AppResponse, CmsCollection, SearchParams } from "../types.cms"
import cmsCollectionServices from "../services/collection.service"
import { isEmpty } from "@repo/lib/isEmpty"

//TODO: Add text
export function getCollectionsAction({
  schema,
}: {
  schema: string
}) {
  return async ({
    page,
    limit,
  }: { page: SearchParams["page"]; limit: SearchParams["limit"] }) => {
    "use server"

    return cmsCollectionServices(schema).get({
      page,
      limit,
    })
  }
}

export function renameCollectionAction({
  schema,
  userId,
}: {
  schema: string
  userId: number
}) {
  return async ({
    id,
    name,
  }: { id: number; name: string }): Promise<
    AppResponse<Partial<CmsCollection>>
  > => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: [],
        error: "renameCollectionAction requires an 'schema' prop",
      }
    }

    if (isEmpty(userId)) {
      return {
        data: [],
        error: "renameCollectionAction requires an 'userId' prop",
      }
    }

    if (isEmpty(id)) {
      return {
        data: [],
        error: "renameCollectionAction requires an 'id' prop",
      }
    }

    if (isEmpty(name)) {
      return {
        data: [],
        error: "renameCollectionAction requires an 'name' prop",
      }
    }

    return cmsCollectionServices(schema).update({
      where: ["cms_collections.id", "=", id],
      data: { name },
      userId,
    })
  }
}

export function deleteCollectionAction({ schema }: { schema: string }) {
  return async ({
    id,
  }: { id: number }): Promise<AppResponse<Partial<CmsCollection>>> => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: [],
        error: "deleteCollectionAction requires an 'schema' prop",
      }
    }

    if (isEmpty(id)) {
      return {
        data: [],
        error: "deleteCollectionAction requires an 'id' prop",
      }
    }

    return cmsCollectionServices(schema).remove({
      where: ["cms_collections.id", "=", id],
    })
  }
}

export function addNewCollectionAction({
  schema,
  userId,
}: {
  userId: number
  schema: string
}) {
  return async (data: {
    name: string
    type: CmsCollection["type"]
  }): Promise<AppResponse<Partial<CmsCollection>>> => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: [],
        error: "addNewCollectionAction requires an 'schema' prop",
      }
    }

    if (isEmpty(userId)) {
      return {
        data: [],
        error: "addNewCollectionAction requires an 'userId' prop",
      }
    }

    if (isEmpty(data) || isEmpty(data?.name) || isEmpty(data?.type)) {
      return {
        data: [],
        error:
          "addNewCollectionAction requires an 'data' argument with a 'name' and a 'type'",
      }
    }

    return cmsCollectionServices(schema).insert({
      data: {
        ...data,
        userId,
      },
      userId,
      returning: [
        "id",
        "name",
        "type",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
      ],
    })
  }
}

export function updateColumnOrderAction({
  schema,
  userId,
}: { schema: string; userId: number }) {
  return async ({
    id,
    columnOrder,
  }: { id: number; columnOrder: CmsCollection["columnOrder"] }) => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: [],
        error: "updateColumnOrderAction requires an 'schema' prop",
      }
    }

    if (isEmpty(userId)) {
      return {
        data: [],
        error: "updateColumnOrderAction requires an 'userId' prop",
      }
    }

    if (isEmpty(id)) {
      return {
        data: [],
        error: "updateColumnOrderAction requires an 'id' prop",
      }
    }

    if (isEmpty(columnOrder)) {
      return {
        data: [],
        error: "updateColumnOrderAction requires an 'columnOrder' prop",
      }
    }

    return cmsCollectionServices(schema).update({
      where: ["cms_collections.id", "=", id],
      data: { columnOrder },
      userId,
    })
  }
}
