import type { z } from "zod"

import type {
  cmsCollectionValidator,
  cmsCollectionColumnValidator,
  cmsCollectionDocumentValidator,
  cmsCollectionInsertValidator,
  cmsCollectionUpdateValidator,
  formCmsCollectionInsertValidator,
  cmsCollectionColumnInsertValidator,
  cmsCollectionColumnUpdateValidator,
  cmsCollectionDocumentInsertValidator,
  cmsCollectionDocumentUpdateValidator,
  cmsColumnDialogValidator,
} from "@/cms-validators"

export type AppResponse<Data> = {
  data: Data[] | []
  error: string
}

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

export type CmsDocumentsView = CmsCollectionDocument & {
  collectionName: CmsCollection["name"]
  columnOrder: CmsCollection["columnOrder"]
  type: CmsCollection["type"]
  roles: CmsCollection["roles"]
  columns: CmsCollectionColumn[]
}

/* CMS UI */

export type CmsFieldBase<Value> = {
  collectionId?: string
  columnName?: string
  className?: string
  errorMessage?: string
  fieldId: string
  id: string
  isInline?: boolean
  value: Value
  validate?: (
    value: Value,
    validation?: Record<string, any>,
    columnName?: string
  ) => {
    value: Value
    error: string
  }

  onUpdate: <Value>(newValue: Value, errorMessage?: string) => void
  validation?: Record<string, string>
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
