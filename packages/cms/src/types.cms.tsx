import type { z } from "zod"

import type {
  cmsCollectionColumnInsertValidator,
  cmsCollectionColumnUpdateValidator,
  cmsCollectionColumnValidator,
  cmsCollectionDocumentInsertValidator,
  cmsCollectionDocumentUpdateValidator,
  cmsCollectionDocumentValidator,
  cmsCollectionInsertValidator,
  cmsCollectionUpdateValidator,
  cmsCollectionValidator,
  cmsColumnDialogValidator,
  formCmsCollectionInsertValidator,
} from "./validators.cms"

export type ToggleLayoutTypes = "grid" | "list"

export type SearchParams = {
  page?: number
  limit?: number
  layout?: ToggleLayoutTypes
  orderBy?: string
  direction: "asc" | "desc"
  nulls: "first" | "last"
}

export type AppResponse<Data> = {
  data: Data[] | []
  error: string
}

export type CmsCollectionTableColumn<T extends keyof CmsCollection> =
  `cms_collections.${T}`
export type CmsCollectionColumnTableColumn<
  T extends keyof CmsCollectionColumn,
> = `cms_collection_columns.${T}`
export type CmsCollectionDocumentTableColumn<
  T extends keyof CmsCollectionDocument,
> = `cms_documents.${T}`

export type CollectionState = Omit<CmsCollection, "columnOrder" | "userId">
export type CollectionsReturnType = AppResponse<Partial<CollectionState>>

/* CMS Collection */
export type CmsCollection = z.infer<typeof cmsCollectionValidator>
export type CmsCollectionInsert = z.infer<typeof cmsCollectionInsertValidator>
export type CmsCollectionUpdate = z.infer<typeof cmsCollectionUpdateValidator>
export type FormCmsCollectionInsertValidator = z.infer<
  typeof formCmsCollectionInsertValidator
>

export type CmsCollectionView = {
  id: string
  name: string
  columns: {
    columnId: string
    columnName: string
  }[]
}

/* CMS Collection Column */
export type CmsCollectionColumn = z.infer<typeof cmsCollectionColumnValidator>
export type CmsCollectionColumnInsert = z.infer<
  typeof cmsCollectionColumnInsertValidator
>
export type CmsCollectionColumnUpdate = z.infer<
  typeof cmsCollectionColumnUpdateValidator
>

/* CMS Document */
export type CmsCollectionDocument = z.infer<
  typeof cmsCollectionDocumentValidator
>
export type CmsCollectionDocumentInsert = z.infer<
  typeof cmsCollectionDocumentInsertValidator
>
export type CmsCollectionDocumentUpdate = z.infer<
  typeof cmsCollectionDocumentUpdateValidator
>

export type CmsDocumentsView = Omit<CmsCollectionDocument, "data"> & {
  collectionName: CmsCollection["name"]
  columnOrder: string[]
  type: CmsCollection["type"]
  roles: CmsCollection["roles"]
  columns: CmsCollectionColumn[]
  data: Record<string, any>[]
}

/* CMS UI */

export type CmsErrorState = Map<string, string>

export type CmsFieldBase<Value> = {
  className?: string
  collectionId?: number
  columnName?: string
  errorMessage?: string
  fieldId: string
  id: string
  isInline?: boolean
  options?: Record<string, string>
  validate?: (
    value: Value,
    validation?: Record<string, any>,
    columnName?: string
  ) => {
    value: Value
    error: string
  }
  validation?: Record<string, string>
  value: Value
  onUpdate: <Value>(newValue: Value, errorMessage?: string) => void
}

export type CmsField<TElement, Value> = Omit<
  React.InputHTMLAttributes<TElement>,
  "value" | "onChange" | "id"
> &
  CmsFieldBase<Value>

export type CmsConfigField<Value, Validation, Options> = {
  description: string
  title: string
  type: CmsCollectionColumn["type"]
  optionsDefaults?: Options
  validationDefaults?: Validation
  initialState: any
  Icon?: (props: Record<string, any>) => React.JSX.Element
  validate?: (
    value: Value,
    validation: Validation,
    columnName: string
  ) => {
    value: Value
    error: string
  }
}

export type CmsColumnDialog = z.infer<typeof cmsColumnDialogValidator>

export type DocumentInsert = {
  collectionId: CmsCollectionDocument["collectionId"]
  data: CmsCollectionDocumentInsert["data"]
}

export type DocumentUpdate = {
  id?: CmsCollectionDocument["id"]
  data: CmsCollectionDocumentUpdate["data"]
}
