import { maybeNumber } from "@repo/lib/maybeNumber"

import type {
  AppResponse,
  CmsCollection,
  ToggleLayoutTypes,
} from "@repo/cms/types.cms"
import cmsCollectionServices from "@repo/cms/services/collection.service"

import { CollectionsList } from "./list.collections"

export default async function Collections({
  searchParams,
  onRenameCollection,
  onDeleteCollection,
  onNewCollection,
}: {
  onRenameCollection: (props: { id: number; name: string }) => Promise<
    AppResponse<Partial<CmsCollection>>
  >
  onDeleteCollection: (props: { id: number }) => Promise<
    AppResponse<Partial<CmsCollection>>
  >
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
