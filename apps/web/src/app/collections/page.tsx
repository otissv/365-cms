import { notFound } from "next/navigation"

import { isEmpty } from "@repo/lib/isEmpty"
import type { SearchParams } from "@repo/cms/types.cms"
import { PageHeader } from "@repo/ui/page/page-header"
import { Toaster } from "@repo/ui/sonner"
import Collections from "@repo/cms-ui/collections/collections"

import { Collections as CollectionsRoute } from "@/routes"
import { getCollectionsAction } from "@repo/cms/actions/collection.actions"

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const schema = "t_1"

  const { data, totalPages } = await getCollectionsAction({ schema })({
    page: searchParams.page,
    limit: searchParams.limit,
  })

  if (isEmpty(data)) {
    notFound()
  }

  return (
    <>
      <PageHeader heading='Collections' breadcrumbs={[{ label: "CMS" }]} />

      <Toaster />

      <Collections
        collections={data}
        route={CollectionsRoute.getPathname()}
        searchParams={searchParams}
        totalPages={totalPages}
      />
    </>
  )
}
