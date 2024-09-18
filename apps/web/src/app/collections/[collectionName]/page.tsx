import { notFound } from "next/navigation"

import type { CmsDocumentsView, SearchParams } from "@repo/cms/types.cms"
import { onUpdateColumnOrderAction } from "@repo/cms/actions/collection.actions"

import {
  getDocumentsAction,
  onDeleteRowAction,
  onUpdateDataAction,
} from "@repo/cms/actions/document.actions"
import {
  onDeleteColumnAction,
  onInsertColumnAction,
  onSortColumnAction,
  onUpdateColumnAction,
} from "@repo/cms/actions/column.actions"

import { isEmpty } from "@repo/lib/isEmpty"
import { PageHeader } from "@repo/ui/page/page-header"
import TextField from "@repo/cms-ui/fields/text"
import Documents from "@repo/cms-ui/documents/documents"
import type { FieldConfig } from "@repo/cms-ui/documents/provider.documents"

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { collectionName: string }
  searchParams: SearchParams
}) {
  const schema = "t_1"
  const userId = 1

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
          { label: "Collections", crumb: "/collections" },
          { label: `${collectionName} collection` },
        ]}
      />
      <Documents
        collection={data as CmsDocumentsView}
        collectionName={collectionName}
        searchParams={searchParams}
        totalPages={totalPages}
        onDeleteColumn={onDeleteColumnAction({ schema })}
        onDeleteRow={onDeleteRowAction({ schema })}
        onInsertColumn={onInsertColumnAction({ schema, userId })}
        onSortColumn={onSortColumnAction({
          schema,
          collectionName,
          searchParams,
          userId,
        })}
        onUpdateColumn={onUpdateColumnAction({ schema, userId })}
        onUpdateColumnOrder={onUpdateColumnOrderAction({ schema, userId })}
        onUpdateData={onUpdateDataAction({ schema, userId })}
        fields={[TextField] as FieldConfig[]}
      />
    </>
  )
}
