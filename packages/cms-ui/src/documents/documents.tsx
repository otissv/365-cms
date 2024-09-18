// biome-ignore lint/style/useImportType: <explanation>
import { CmsDocumentsView, SearchParams } from "@repo/cms/types.cms"
import { maybeNumber } from "@repo/lib/maybeNumber"

import { DocumentList } from "./list.documents"
import {
  DocumentProvider,
  type DocumentProviderProps,
  type FieldConfig,
} from "./provider.documents"

export type DocumentProps = {
  collection: CmsDocumentsView
  collectionName: string
  searchParams: SearchParams
  totalPages: number
  fields: FieldConfig[]
  onDeleteColumn: DocumentProviderProps["onDeleteColumn"]
  onDeleteRow: DocumentProviderProps["onDeleteRow"]
  onInsertColumn: DocumentProviderProps["onInsertColumn"]
  onSortColumn: DocumentProviderProps["onSortColumn"]
  onUpdateColumn: DocumentProviderProps["onUpdateColumn"]
  onUpdateColumnOrder: DocumentProviderProps["onUpdateColumnOrder"]
  onUpdateData: DocumentProviderProps["onUpdateData"]
}
export default function Documents({
  collection,
  collectionName,
  searchParams,
  totalPages,
  onDeleteColumn,
  onDeleteRow,
  onInsertColumn,
  onSortColumn,
  onUpdateColumn,
  onUpdateColumnOrder,
  onUpdateData,
  fields,
}: DocumentProps) {
  const page = maybeNumber(1)(searchParams.page)
  const limit = maybeNumber(10)(searchParams.limit)
  const layout = searchParams.layout || "grid"

  return (
    <DocumentProvider
      collection={collection}
      onDeleteColumn={onDeleteColumn}
      onDeleteRow={onDeleteRow}
      onInsertColumn={onInsertColumn}
      onSortColumn={onSortColumn}
      onUpdateColumn={onUpdateColumn}
      onUpdateColumnOrder={onUpdateColumnOrder}
      onUpdateData={onUpdateData}
      fields={fields}
    >
      <DocumentList
        collectionName={collectionName}
        layout={layout}
        limit={limit}
        page={page}
        totalPages={totalPages}
      />
    </DocumentProvider>
  )
}
