import "server-only"

import type { AppResponse, CmsCollection } from "../types.cms"
import cmsCollectionServices from "../services/collection.service"
import { isEmpty } from "@repo/lib/isEmpty"

export function onRenameCollectionAction({
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
        error: "onRenameCollectionAction requires an 'schema' prop",
      }
    }

    if (isEmpty(userId)) {
      return {
        data: [],
        error: "onRenameCollectionAction requires an 'userId' prop",
      }
    }

    if (isEmpty(id)) {
      return {
        data: [],
        error: "onRenameCollectionAction requires an 'id' prop",
      }
    }

    if (isEmpty(name)) {
      return {
        data: [],
        error: "onRenameCollectionAction requires an 'name' prop",
      }
    }

    return cmsCollectionServices(schema).update({
      where: ["cms_collections.id", "=", id],
      data: { name },
      userId,
    })
  }
}

export function onDeleteCollectionAction({ schema }: { schema: string }) {
  return async ({
    id,
  }: { id: number }): Promise<AppResponse<Partial<CmsCollection>>> => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: [],
        error: "onDeleteCollectionAction requires an 'schema' prop",
      }
    }

    if (isEmpty(id)) {
      return {
        data: [],
        error: "onDeleteCollectionAction requires an 'id' prop",
      }
    }

    return cmsCollectionServices(schema).remove({
      where: ["cms_collections.id", "=", id],
    })
  }
}

export function onNewCollectionAction({
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
        error: "onNewCollectionAction requires an 'schema' prop",
      }
    }

    if (isEmpty(userId)) {
      return {
        data: [],
        error: "onNewCollectionAction requires an 'userId' prop",
      }
    }

    if (isEmpty(data) || isEmpty(data?.name) || isEmpty(data?.type)) {
      return {
        data: [],
        error:
          "onNewCollectionAction requires an 'data' argument with a 'name' and a 'type'",
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

export function onUpdateColumnOrderAction({
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
        error: "onUpdateColumnOrderAction requires an 'schema' prop",
      }
    }

    if (isEmpty(userId)) {
      return {
        data: [],
        error: "onUpdateColumnOrderAction requires an 'userId' prop",
      }
    }

    if (isEmpty(id)) {
      return {
        data: [],
        error: "onUpdateColumnOrderAction requires an 'id' prop",
      }
    }

    if (isEmpty(columnOrder)) {
      return {
        data: [],
        error: "onUpdateColumnOrderAction requires an 'columnOrder' prop",
      }
    }

    return cmsCollectionServices(schema).update({
      where: ["cms_collections.id", "=", id],
      data: { columnOrder },
      userId,
    })
  }
}
