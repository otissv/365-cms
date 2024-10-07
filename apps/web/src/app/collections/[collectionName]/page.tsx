import { notFound } from "next/navigation"

import type { CmsDocumentsView, SearchParams } from "@repo/cms/types.cms"

import { getDocumentsAction } from "@repo/cms/actions/document.actions"

import { isEmpty } from "@repo/lib/isEmpty"
import { PageHeader } from "@repo/ui/page/page-header"
import TextField from "@repo/cms-ui/fields/text"
import Documents from "@repo/cms-ui/documents/documents"

import type { FieldConfig } from "@repo/cms-ui/store.cms"
import { Collections } from "@/routes"

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { collectionName: string }
  searchParams: SearchParams
}) {
  const schema = "t_1"

  const { collectionName } = params

  if (isEmpty(collectionName)) {
    notFound()
  }

  const { data, totalPages } = await getDocumentsAction({ schema })({
    searchParams,
    collectionName,
  })

  if (isEmpty(data)) {
    notFound()
  }

  return (
    <>
      <PageHeader
        heading={`${collectionName}`}
        breadcrumbs={[
          { label: "Collections", crumb: `/${Collections.getPathname()}` },
          { label: `${collectionName} collection` },
        ]}
      />
      <Documents
        collection={data as CmsDocumentsView}
        collectionName={collectionName}
        searchParams={searchParams}
        totalPages={totalPages}
        fields={[TextField] as FieldConfig[]}
      />
    </>
  )
}
