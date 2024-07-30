import { notFound } from "next/navigation"

import type { SearchParams } from "@repo/cms/types.cms"
import Documents, {
  getDocuments,
  onDeleteColumnAction,
  onDeleteRowAction,
  onInsertColumnAction,
  onSortColumnAction,
  onUpdateColumnAction,
  onUpdateColumnOrderAction,
  onUpdateDataAction,
} from "@repo/cms/documents/documents"
import type { ToggleLayoutTypes } from "@repo/cms/ui/toggle-layout"
import { isEmpty } from "@repo/lib/isEmpty"
import { PageHeader } from "@repo/ui/page/page-header"
import TextField from "@repo/cms/fields/text"
import TitleField from "@repo/cms/fields/title"

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { collectionName: string }
  searchParams: SearchParams & {
    layout: ToggleLayoutTypes
  }
}) {
  const schema = "t_1"
  const userId = 1
  const { collectionName } = params

  if (isEmpty(collectionName)) {
    notFound()
  }

  const { data, totalPages } = await getDocuments({
    searchParams,
    collectionName,
    schema,
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
        collection={data}
        collectionName={collectionName}
        searchParams={searchParams}
        totalPages={totalPages}
        onDeleteColumn={onDeleteColumnAction({ schema })}
        onDeleteRow={onDeleteRowAction({ schema })}
        onInsertColumn={onInsertColumnAction({ schema })}
        onSortColumn={onSortColumnAction({
          searchParams,
          schema,
          collectionName,
        })}
        onUpdateColumn={onUpdateColumnAction({ schema })}
        onUpdateColumnOrder={onUpdateColumnOrderAction({ schema, userId })}
        onUpdateData={onUpdateDataAction({ schema })}
        fields={[TextField, TitleField]}
      />
    </>
  )
}
