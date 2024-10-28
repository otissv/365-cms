"use client"

import type {
  Column,
  Row,
  RowSelectionState,
  Column as TanstackColumn,
  Updater,
} from "@tanstack/react-table"
import React from "react"

import { notify } from "@repo/ui/sonner"

import { isEmpty } from "@repo/lib/isEmpty"
import { unique } from "@repo/lib/unique"
import { usePushQueryString } from "@repo/ui/querystring-hook"
import {
  type ArrayStoreState,
  type ObjectStoreState,
  initialArrayStoreState,
  initialObjectStoreState,
  useArrayStore,
  useObjectStore,
} from "@repo/ui/useCreateStore"
import type {
  AppResponse,
  CmsCollection,
  CmsCollectionColumn,
  CmsCollectionColumnInsert,
  CmsCollectionColumnUpdate,
  CmsCollectionDocument,
  CmsCollectionDocumentUpdate,
  CmsCollectionUpdate,
  CmsColumnDialog,
  CmsConfigField,
  CmsDocumentsView,
  CmsField,
  CollectionsReturnType,
  DocumentInsert,
  DocumentSlugUpdate,
  DocumentUpdate,
  SearchParams,
} from "@repo/cms/types.cms"

import { removeObjectKeys } from "@repo/lib/removeObjectKeys"
import SlugField from "./fields/slug"
import InfoField from "./fields/info"
import InfoDateField from "./fields/info-date"

export type CollectionStoreState = Omit<CmsCollection, "columnOrder" | "userId">

export type CmsContextState = {
  state: {
    collections: ArrayStoreState<CollectionStoreState>
    documentsCollection: ObjectStoreState<
      Omit<CmsDocumentsView, "data" | "columns">
    >
    columns: ArrayStoreState<CmsCollectionColumn>
    documents: ArrayStoreState<Record<string, any>>
    error: ObjectStoreState<Record<string, string>>
  }

  addNewCollection: (data: {
    name: string
    type: CmsCollection["type"]
  }) => Promise<CollectionsReturnType>
  addRow: () => Promise<void>
  columnOrderChange: (
    columnOrder: Updater<NonNullable<CmsCollectionUpdate["columnOrder"]>>
  ) => void
  columnVisibility: (
    column: TanstackColumn<CmsDocumentsView, unknown>
  ) => Promise<void>
  deleteCollection: (id: number) => Promise<CollectionsReturnType | undefined>
  deleteColumn: (fieldId: string) => Promise<void>
  deleteRow: () => Promise<void>
  duplicateRow: () => Promise<void>
  field: {
    component: Record<
      string,
      <TElement extends HTMLElement, Value extends Record<string, any>>(
        props: CmsField<TElement, Value>
      ) => JSX.Element
    >
    config: Record<string, CmsConfigField<any, any, any>>
    options: Record<
      string,
      (props: {
        type?: string
        fieldId: string
        onUpdate: (newValue: unknown, errorMessage?: "string") => void
        value: any
      }) => JSX.Element
    >
    validation: Record<
      string,
      (props: {
        type?: string
        value: any
        onUpdate: (value: any) => void
      }) => React.JSX.Element
    >

    icon: Record<string, (props: Record<string, any>) => React.JSX.Element>
  }
  getCollections: (props: {
    page: SearchParams["page"]
    limit: SearchParams["limit"]
  }) => Promise<
    AppResponse<CmsCollection> & {
      totalPages: number
    }
  >
  getDocuments: ({
    searchParams,
    collectionName,
  }: {
    collectionName: string
    searchParams?: SearchParams
  }) => Promise<{
    data: { [key: string]: never } | CmsDocumentsView
    error: string
    totalPages: number
  }>
  renameCollection: (props: {
    id: number
    name: string
  }) => Promise<CollectionsReturnType>
  rowSelection: RowSelectionState
  sortColumn: (props: {
    column: TanstackColumn<CmsDocumentsView, unknown>
    searchParams: Required<SearchParams>
  }) => Promise<void>
  setFields: (fields: FieldConfig[]) => void
  selectedRows: string[]
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>
  updateColumn: (props: {
    id?: number
    values: Omit<CmsColumnDialog, "collectionId">
  }) => Promise<Partial<CmsCollectionColumn>[] | undefined>
  updateData: (props: {
    row: Row<Record<string, any>>
    column: Column<Record<string, any>>
    value: unknown
    errorMessage: string
    type: string
    fieldId: string
  }) => Promise<void>
}

export type FieldConfig = {
  fieldConfig: CmsConfigField<any, any, any>
  FieldOptions: (props: {
    type?: string
    fieldId: string
    onUpdate: (newValue: unknown, errorMessage?: "string") => void
    value: any
  }) => JSX.Element
  FieldValidation: (props: {
    type?: string
    value: any
    onUpdate: (value: any) => void
  }) => React.JSX.Element
  Field: <TElement extends HTMLElement, Value extends Record<string, any>>(
    props: CmsField<TElement, Value>
  ) => JSX.Element
}

const initialState: CmsContextState = {
  state: {
    collections: initialArrayStoreState,
    documentsCollection: initialObjectStoreState,
    columns: initialArrayStoreState,
    documents: initialArrayStoreState,
    error: initialObjectStoreState,
  },

  addNewCollection: async () => ({ data: [], error: "" }),
  addRow: async () => {},
  columnOrderChange: () => {},
  columnVisibility: async () => {},
  deleteCollection: async () => ({ data: [], error: "" }),
  deleteColumn: async () => {},
  deleteRow: async () => {},
  duplicateRow: async () => {},
  field: {
    component: {},
    config: {},
    icon: {},
    options: {},
    validation: {},
  },
  getCollections: async () => ({ data: [], error: "", totalPages: 0 }),
  getDocuments: async () => ({ data: {}, error: "", totalPages: 0 }),
  renameCollection: async () => ({ data: [], error: "" }),
  rowSelection: {},
  selectedRows: [],
  setFields: () => {},
  setRowSelection: () => {},
  sortColumn: async () => {},
  updateColumn: async () => undefined,
  updateData: async () => {},
}

const CmsContext = React.createContext(initialState)

export function useCmsStore() {
  return React.useContext<CmsContextState>(CmsContext)
}

export function getFieldConfig(fields: FieldConfig[] = []) {
  const field = fields
    .concat([SlugField, InfoField, InfoDateField] as FieldConfig[])
    .reduce(
      (acc, field) => {
        const FieldIcon = field.fieldConfig.Icon

        acc.config = {
          ...acc.config,
          [field.fieldConfig.type]: field.fieldConfig,
        }
        acc.options = {
          ...acc.options,
          [field.fieldConfig.type]: field.FieldOptions,
        }
        acc.validation = {
          ...acc.validation,
          [field.fieldConfig.type]: field.FieldValidation,
        }
        acc.component = {
          ...acc.component,
          [field.fieldConfig.type]: field.Field,
        }
        acc.icon = {
          ...acc.icon,
          [field.fieldConfig.type]: (props: Record<string, any>) =>
            FieldIcon ? <FieldIcon {...props} /> : <></>,
        }

        return acc
      },
      {
        config: {},
        validation: {},
        options: {},
        component: {},
        icon: {},
      }
    )

  return field
}

export function prepareDocuments({
  collection,
  columns = [],
}: {
  collection:
    | (Omit<CmsDocumentsView, "data" | "errors" | "columns" | "columnOrder"> & {
        columnOrder: string[]
      })
    | { [key: string]: never }
  columns: CmsDocumentsView["columns"]
}) {
  return {
    ...collection,
    columnOrder: unique([
      "_select",
      "_action",
      ...((!isEmpty(collection.columnOrder)
        ? (collection.columnOrder as string[])
        : columns.reduce((acc: string[], { fieldId }) => {
            fieldId && acc.push(fieldId)
            return acc
          }, [])) as any),
    ]),
    roles: collection.roles || [],
  }
}

export interface CmsProviderProps {
  children: React.ReactNode
  fields?: FieldConfig[]
  addNewCollection: (props: {
    name: string
    type: CmsCollection["type"]
  }) => Promise<CollectionsReturnType>

  deleteCollection: (props: { id: number }) => Promise<
    CollectionsReturnType | undefined
  >
  deleteColumn: (props: {
    fieldId: string
  }) => Promise<AppResponse<Partial<CmsCollectionColumn>>>
  deleteRow: (props: { ids: number[] }) => Promise<
    AppResponse<
      Partial<CmsCollectionDocument> | Partial<CmsCollectionDocument>[]
    >
  >
  getCollections: (props: {
    page: SearchParams["page"]
    limit: SearchParams["limit"]
  }) => Promise<
    AppResponse<CmsCollection> & {
      totalPages: number
    }
  >
  getDocuments: ({
    searchParams,
    collectionName,
  }: {
    collectionName: string
    searchParams?: SearchParams
  }) => Promise<{
    data: { [key: string]: never } | CmsDocumentsView
    error: string
    totalPages: number
  }>
  insertColumn: (
    data: Omit<
      CmsCollectionColumnInsert,
      "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
    >
  ) => Promise<AppResponse<Partial<CmsCollectionColumn>>>
  renameCollection(props: {
    id: number
    name: string
  }): Promise<CollectionsReturnType>
  sortColumn: (props: {
    id: number
    collectionId: number
    collectionName: string
    searchParams: Required<SearchParams>
  }) => Promise<{
    data: { [key: string]: never } | CmsDocumentsView
    error: string
    totalPages: number
  }>
  updateColumn: (props: {
    id: number
    collectionId: number
    data: CmsCollectionColumnUpdate
  }) => Promise<AppResponse<Partial<CmsCollectionColumn>>>
  updateColumnOrder: (props: {
    id: number
    columnOrder: CmsCollection["columnOrder"]
  }) => Promise<AppResponse<Partial<CmsCollection>>>
  updateData: (
    props: DocumentInsert | DocumentUpdate
  ) => Promise<AppResponse<Partial<CmsCollectionDocument>>>
  updateSlug: (
    props: DocumentSlugUpdate
  ) => Promise<AppResponse<Partial<CmsCollectionDocument>>>
}

export function CmsProvider({
  children,
  fields,
  getCollections,
  getDocuments,
  addNewCollection,
  deleteCollection,
  deleteColumn,
  deleteRow,
  insertColumn,
  renameCollection,
  sortColumn,
  updateColumn,
  updateColumnOrder,
  updateData,
  updateSlug,
  toast = notify,
}: CmsProviderProps) {
  const [_isPending, startTransition] = React.useTransition()
  const pushQueryString = usePushQueryString(startTransition)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const selectedRows = Object.keys(rowSelection)

  const collectionMemo = React.useMemo(
    () => ({
      data: [],
      col: {},
      columns: [],
    }),
    []
  ) as any

  const { data, columns, ...col } = collectionMemo || {
    data: [],
    col: {},
    columns: [],
  }

  const [fieldConfig, setFields] = React.useState(
    fields
      ? getFieldConfig(fields)
      : {
          component: {},
          config: {},
          icon: {},
          options: {},
          validation: {},
        }
  )

  const collectionsMemo = React.useMemo(() => [], [])
  const collectionsState: ArrayStoreState<CollectionStoreState> =
    useArrayStore<CollectionStoreState>(collectionsMemo as any, "id")

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const prepareCollectionMemo = React.useMemo(
    () => prepareDocuments({ collection: col, columns }),
    [JSON.stringify(col), JSON.stringify(columns)]
  )
  const collectionState: ObjectStoreState<
    Omit<CmsDocumentsView, "data" | "columns">
  > = useObjectStore<Omit<CmsDocumentsView, "data" | "columns">>(
    prepareCollectionMemo as any
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const columnsMemo = React.useMemo(() => columns, [JSON.stringify(columns)])
  const columnsState: ArrayStoreState<CmsCollectionColumn> =
    useArrayStore<CmsCollectionColumn>(columnsMemo, "fieldId")

  const documentsState: ArrayStoreState<Record<string, any>> = useArrayStore<
    Record<string, any>
  >(data, "id")

  const errorsMemo = React.useMemo(() => ({}), [])
  const errorsState: ObjectStoreState<Record<string, string>> =
    useObjectStore<Record<string, string>>(errorsMemo)

  const handleAddNewCollection = async (props: {
    name: string
    type: CmsCollection["type"]
  }) => {
    return addNewCollection(props)
  }

  const handleAddRow = async () => {
    const collectionId = collectionState.get("collectionId") as number

    const row: {
      state: { [key: number]: unknown }[]
      data: CmsCollectionDocumentUpdate
    } = columnsState.reduce(
      (previousValue, [id, { type }]) => {
        const value = (fieldConfig.config as any)[type]?.initialState

        const ignore = ["createdBy", "createdAt", "updatedBy", "updatedAt"]

        return {
          state: [...previousValue.state, { [id]: value }],
          data: {
            ...previousValue.data,
            ...(ignore.includes(id as any) ? {} : { [id]: value }),
          },
        }
      },
      {
        state: [],
        data: {},
      }
    )

    const { data, error } = await updateData({
      collectionId,
      data: [row.data],
    })

    if (error) {
      toast(error)
      return
    }
    const id = data[0]?.id

    if (id) {
      documentsState.set(id, {
        ...row.data,
        id,
      })
    }
  }

  const handleColumnOrderChange = (
    columnOrder: Updater<NonNullable<CmsCollection["columnOrder"]>>
  ): void => {
    const argColumnOrder = columnOrder as CmsCollectionUpdate["columnOrder"]
    collectionState.update("columnOrder", argColumnOrder)

    const id = collectionState.get<"collectionId">("collectionId")

    if (id) {
      updateColumnOrder({
        id,
        columnOrder: argColumnOrder,
      })
    }
  }

  const handleColumnSort = async ({
    column,
    searchParams,
  }: {
    column: TanstackColumn<CmsDocumentsView>
    searchParams: Required<SearchParams>
  }) => {
    try {
      const col = columnsState.get<"fieldId">(column.id as "fieldId")

      if (col?.id) {
        const collectionId = collectionState.get("collectionId") as number

        const response = await sortColumn({
          id: col?.id,
          collectionId,
          collectionName: collectionState.get("collectionName") as string,
          searchParams: {
            ...searchParams,
            sortBy: col.columnName,
            direction: searchParams?.direction || "asc",
          },
        })

        const { data, columns, ...collection } = response.data

        if (response.error) {
          toast(response.error)
        }

        documentsState.replace(data)
        columnsState.replace(columns)
        collectionState.replace(
          prepareDocuments({ collection, columns }) as any
        )

        pushQueryString({
          ...searchParams,
          page: 1,
          sortBy: column.id,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleColumnVisibility = async (
    column: TanstackColumn<CmsDocumentsView, unknown>
  ): Promise<void> => {
    try {
      const visibility = !column.getIsVisible()
      column.toggleVisibility(visibility)

      const col = columnsState.get<"fieldId">(column.id as "fieldId")
      const collectionId = collectionState.get("collectionId") as number

      if (col?.id) {
        const { error } = await updateColumn({
          id: col?.id,
          data: { visibility },
          collectionId,
        })

        if (!error) {
          columnsState.update(column.id, { visibility })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteCollection = async (id: number) => {
    const response = await deleteCollection({ id })

    if (response?.error) {
      toast("Collection was not deleted. Try again.", { type: "error" })
      return
    }

    collectionsState.delete(id)

    return response
  }

  const handleDeleteColumn = async (fieldId: string): Promise<string> => {
    const { error } = await deleteColumn({ fieldId })

    if (error) {
      return error
    }

    const columnOrder = collectionState.get<"columnOrder">("columnOrder") || []
    const newColumnOrder = columnOrder.filter((c) => c !== fieldId)

    collectionState.update("columnOrder", newColumnOrder)
    columnsState.delete(fieldId)

    const newErrorState = errorsState.reduce((acc, [id, value]) => {
      if ((id as string).startsWith(fieldId)) return acc
      acc[id] = value

      return acc
    }, {})

    errorsState.replace(newErrorState)

    return ""
  }

  const handleDeleteRow = async (): Promise<void> => {
    const { error } = await deleteRow({ ids: selectedRows.map(Number) })

    if (error) {
      toast(error)
      return
    }

    documentsState.delete(selectedRows.map((i) => Number.parseInt(i)))

    const rows = { ...rowSelection }
    for (const row of selectedRows) {
      delete rows[row]
    }

    setRowSelection(rows)
  }

  const handleDuplicateRow = async (): Promise<void> => {
    const rows = [
      ...documentsState.filter(([id]) => {
        return (selectedRows as any).includes(`${id}`)
      }),
    ].map((data) => {
      return removeObjectKeys(data as CmsCollectionDocument, [
        "id",
        "collectionId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
      ])
    })

    const response = await updateData({
      collectionId: collectionState.get("collectionId") as number,
      data: rows,
    })

    if (response.error) {
      toast(response.error)
      return
    }

    documentsState.add(
      response.data.map((props) => ({
        ...rows[0],
        ...props,
      }))
    )
  }

  const handleGetCollections = async (props: {
    page: SearchParams["page"]
    limit: SearchParams["limit"]
  }) => {
    return getCollections(props)
  }

  const handleGetDocuments = async (props: {
    collectionName: string
    searchParams?: SearchParams
  }) => {
    return getDocuments(props)
  }

  const handleRenameCollection = async (props: {
    id: number
    name: string
  }) => {
    return renameCollection(props)
  }

  const handleSetFields = (fields: FieldConfig[]) => {
    setFields(getFieldConfig(fields))
  }

  const handleUpdateColumn = async ({
    id,
    values,
  }: {
    id?: number
    values: Omit<CmsColumnDialog, "collectionId">
  }): Promise<Partial<CmsCollectionColumn>[] | undefined> => {
    const columnOrder = collectionState.get<"columnOrder">("columnOrder")
    const updateColumnOrder = [...(columnOrder as any), values.fieldId]

    let response: AppResponse<Partial<CmsCollectionColumn>>

    if (id) {
      response = await updateColumn({
        data: values,
        id,
        collectionId: collectionState.get("collectionId") as number,
      })
    } else {
      response = await insertColumn({
        ...values,
        columnOrder: updateColumnOrder,
        collectionId: collectionState.get("collectionId") as number,
      })
    }

    const { data, error } = response

    if (error) {
      toast(error)
      return
    }

    const updateItem: Partial<CmsCollectionColumn> = {
      id: data[0].id,
      ...values,
    }

    if (id) {
      columnsState.update(updateItem.fieldId as string, updateItem)
    } else {
      columnsState.add([updateItem as CmsCollectionColumn])
      collectionState.update("columnOrder", updateColumnOrder)
    }

    if (!isEmpty(updateItem.fieldOptions?.defaultValue)) {
      documentsState.edit((previousValue, [id, value]) => {
        previousValue.push({
          ...value,
          id,
          [updateItem.fieldId as string]: updateItem.fieldOptions?.defaultValue,
        })
        return previousValue
      })
    }

    return [updateItem]
  }

  const handleUpdateData = async ({
    column,
    errorMessage = "",
    row,
    value,
  }: {
    column: Column<Record<string, any>>
    errorMessage: string
    fieldId: string
    row: Row<Record<string, any>>
    type: string
    value: unknown
  }): Promise<string> => {
    try {
      const data = documentsState.get(row.id)
      const id = data?.id
      const celId = `${column.id}:${id}`

      if (!id) {
        return ""
      }

      if (errorMessage.trim() !== "") {
        errorsState.update(celId, errorMessage)
      } else {
        errorsState.delete(celId)
      }

      let response: AppResponse<Partial<CmsCollectionDocument>>
      if (column.id === "slug") {
        response = await updateSlug({
          id,
          slug: value as string,
          errors: { [column.id]: errorMessage },
        })
      } else {
        response = await updateData({
          id,
          data: { [column.id]: value },
          errors: { [column.id]: errorMessage },
        })
      }

      if (response.error) {
        throw new Error(response.error)
      }

      documentsState.update(id, { [column.id]: value })
      return ""
    } catch (error) {
      return error as string
    }
  }

  const value: CmsContextState = {
    state: {
      collections: collectionsState,
      documentsCollection: collectionState,
      columns: columnsState,
      documents: documentsState,
      error: errorsState,
    },

    addNewCollection: handleAddNewCollection,
    addRow: handleAddRow,
    columnOrderChange: handleColumnOrderChange,
    columnVisibility: handleColumnVisibility,
    deleteCollection: handleDeleteCollection,
    deleteColumn: handleDeleteColumn,
    deleteRow: handleDeleteRow,
    duplicateRow: handleDuplicateRow,
    getCollections: handleGetCollections,
    getDocuments: handleGetDocuments,
    renameCollection: handleRenameCollection,
    rowSelection,
    selectedRows,
    setFields: handleSetFields,
    setRowSelection,
    sortColumn: handleColumnSort,
    updateColumn: handleUpdateColumn,
    updateData: handleUpdateData,

    field: fieldConfig,
  }

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}
