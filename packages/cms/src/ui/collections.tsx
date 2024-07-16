import { maybeNumber } from "@repo/lib/maybeNumber"

import type { AppResponse, CmsCollection } from "../cms.types"
import { CollectionsList } from "../collections/collections-list"
import type { ToggleLayoutTypes } from "../components/toggle-layout"
import cmsCollectionServices from "../services/collection.service"

export function onRenameCollectionAction({
  schema,
  userId,
}: {
  schema: string
  userId: number
}) {
  return async (
    id: number,
    name: string
  ): Promise<AppResponse<Partial<CmsCollection>>> => {
    "use server"
    return cmsCollectionServices(schema).update({ id, data: { name }, userId })
  }
}

export function onDeleteCollectionAction({ schema }: { schema: string }) {
  return async (id: number): Promise<AppResponse<Partial<CmsCollection>>> => {
    "use server"
    return cmsCollectionServices(schema).remove({ id })
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

    return cmsCollectionServices(schema).insert({
      data: {
        ...data,
        userId,
      },
      userId,
      columns: [
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

export default async function Collections({
  searchParams,
  onRenameCollection,
  onDeleteCollection,
  onNewCollection,
}: {
  onRenameCollection: (
    id: number,
    name: string
  ) => Promise<AppResponse<Partial<CmsCollection>>>
  onDeleteCollection: (
    id: number
  ) => Promise<AppResponse<Partial<CmsCollection>>>
  onNewCollection: (data: {
    name: string
    type: CmsCollection["type"]
  }) => Promise<AppResponse<Partial<CmsCollection>>>

  searchParams: { page?: number; limit?: number; layout: ToggleLayoutTypes }
}): Promise<JSX.Element> {
  const tenantSchema = "t_1"

  const page = maybeNumber(1)(searchParams.page)
  const limit = maybeNumber(10)(searchParams.limit)
  const layout = searchParams.layout

  const { data, totalPages } = await cmsCollectionServices(tenantSchema).get({
    page,
    limit,
  })

  return (
    <CollectionsList
      layout={layout === "grid" || layout === "list" ? layout : "grid"}
      data={data}
      totalPages={totalPages}
      page={page}
      limit={limit}
      onRenameCollection={onRenameCollection}
      onDeleteCollection={onDeleteCollection}
      onNewCollection={onNewCollection}
    />
  )
}
