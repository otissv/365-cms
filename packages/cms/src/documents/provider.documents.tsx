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
import {
  useGetSearchParams,
  usePushQueryString,
} from "@repo/ui/querystring-hook"
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
  CmsCollectionDocumentInsert,
  CmsCollectionDocumentUpdate,
  CmsCollectionUpdate,
  CmsColumnDialog,
  CmsConfigField,
  CmsDocumentsView,
  CmsField,
} from "../types.cms"

import { removeObjectKeys } from "@repo/lib/removeObjectKeys"
import InfoField from "../fields/info"
import InfoDateField from "../fields/info-date"

export type DocumentContextState = {
  state: {
    collection: ObjectStoreState<Omit<CmsDocumentsView, "data" | "columns">>
    columns: ArrayStoreState<CmsCollectionColumn>
    data: ArrayStoreState<Record<string, any>>
    error: ObjectStoreState<Record<string, string>>
  }
  rowSelection: RowSelectionState
  selectedRows: string[]
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>
  addRow: () => Promise<void>
  columnOrderChange: (
    columnOrder: Updater<CmsCollectionUpdate["columnOrder"]>
  ) => void
  columnVisibility: (
    column: TanstackColumn<CmsDocumentsView>
  ) => () => Promise<void>
  deleteColumn: ({
    documentId,
    fieldId,
  }: {
    documentId: number
    fieldId: string
  }) => Promise<void>
  deleteRow: () => Promise<void>
  updateColumn: (props: {
    id?: number
    values: Omit<CmsColumnDialog, "collectionId">
  }) => Promise<Partial<CmsCollectionColumn>[] | undefined>
  duplicateRow: () => Promise<void>
  sortColumn: (
    column: TanstackColumn<CmsDocumentsView>,
    sortBy: "asc" | "desc"
  ) => (_e: React.MouseEvent<HTMLDivElement>) => Promise<void>
  updateData: (props: {
    row: Row<Record<string, any>>
    column: Column<Record<string, any>>
    value: unknown
    errorMessage: string
    type: string
    fieldId: string
  }) => Promise<void>
  fieldComponent: Record<
    string,
    <TElement extends HTMLElement, Value extends Record<string, any>>(
      props: CmsField<TElement, Value>
    ) => JSX.Element
  >
  fieldConfig: Record<string, CmsConfigField<any, any, any>>
  fieldOptions: Record<
    string,
    (props: {
      type?: string
      fieldId: string
      onUpdate: (newValue: unknown, errorMessage?: "string") => void
      value: any
    }) => JSX.Element
  >
  fieldValidation: Record<
    string,
    (props: {
      type?: string
      value: any
      onUpdate: (value: any) => void
    }) => React.JSX.Element
  >

  fieldIcon: Record<string, (props: Record<string, any>) => React.JSX.Element>
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

const initialState: DocumentContextState = {
  state: {
    collection: initialObjectStoreState,
    columns: initialArrayStoreState,
    data: initialArrayStoreState,
    error: initialObjectStoreState,
  },
  fieldConfig: {},
  fieldOptions: {},
  fieldValidation: {},
  fieldComponent: {},
  fieldIcon: {},

  rowSelection: {},
  selectedRows: [],
  setRowSelection: () => {},
  addRow: async () => {},
  columnOrderChange: () => {},
  columnVisibility: () => async () => {},
  deleteColumn: async () => {},
  deleteRow: async () => {},
  updateColumn: async () => undefined,
  duplicateRow: async () => {},
  sortColumn: () => async () => {},
  updateData: async () => {},
}

const DocumentContext = React.createContext(initialState)

export function useDocument() {
  return React.useContext<DocumentContextState>(DocumentContext)
}
// InfoField, InfoDateField
export function getFieldConfig(
  fields: FieldConfig[]
): Pick<
  DocumentContextState,
  | "fieldConfig"
  | "fieldOptions"
  | "fieldValidation"
  | "fieldComponent"
  | "fieldIcon"
> {
  return fields.concat([InfoField, InfoDateField]).reduce(
    (acc, field) => {
      const FieldIcon = field.fieldConfig.Icon

      acc.fieldConfig = {
        ...acc.fieldConfig,
        [field.fieldConfig.type]: field.fieldConfig,
      }
      acc.fieldOptions = {
        ...acc.fieldOptions,
        [field.fieldConfig.type]: field.FieldOptions,
      }
      acc.fieldValidation = {
        ...acc.fieldValidation,
        [field.fieldConfig.type]: field.FieldValidation,
      }
      acc.fieldComponent = {
        ...acc.fieldComponent,
        [field.fieldConfig.type]: field.Field,
      }
      acc.fieldIcon = {
        ...acc.fieldIcon,
        [field.fieldConfig.type]: (props: Record<string, any>) =>
          FieldIcon ? <FieldIcon {...props} /> : <></>,
      }

      return acc
    },
    {
      fieldConfig: {},
      fieldValidation: {},
      fieldOptions: {},
      fieldComponent: {},
      fieldIcon: {},
    }
  )
}

export interface DocumentProviderProps {
  children: React.ReactNode
  collection: CmsDocumentsView
  fields: FieldConfig[]
  toast?: typeof notify
  onDeleteColumn: (props: {
    fieldId: string
    documentId: number
  }) => Promise<AppResponse<Partial<CmsCollectionColumn>>>
  onDeleteRow: (
    ids: number[]
  ) => Promise<
    AppResponse<
      Partial<CmsCollectionDocument> | Partial<CmsCollectionDocument>[]
    >
  >
  onInsertColumn: (
    data: Omit<
      CmsCollectionColumnInsert,
      "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
    >
  ) => Promise<AppResponse<Partial<CmsCollectionColumn>>>
  onSortColumn: (
    id: number,
    data: { sortBy: CmsCollectionColumn["sortBy"] }
  ) => Promise<{
    data: CmsDocumentsView
    error: string
    totalPages: number
  }>
  onUpdateColumn: (
    id: number,
    data: CmsCollectionColumnUpdate
  ) => Promise<AppResponse<Partial<CmsCollectionColumn>>>
  onUpdateColumnOrder: (
    id: number,
    data: {
      columnOrder: CmsCollection["columnOrder"]
    }
  ) => Promise<AppResponse<Partial<CmsCollection>>>
  onUpdateData: (
    // props: {
    //   id?: number
    //   data: CmsCollectionDocumentUpdate | CmsCollectionDocumentInsert
    // },
    {
      id,
      ...data
    }: Record<string, unknown> & {
      id?: number
      // meta: {
      //   collectionId: number
      //   fieldId: string
      //   type: string
      // }
    },
    columns?: string[]
  ) => Promise<AppResponse<Partial<CmsCollectionDocument>>>
}

export function DocumentProvider({
  children,
  collection,
  fields,
  toast = notify,
  onDeleteColumn,
  onDeleteRow,
  onInsertColumn,
  onSortColumn,
  onUpdateColumn,
  onUpdateColumnOrder,
  onUpdateData,
}: DocumentProviderProps) {
  const [isPending, startTransition] = React.useTransition()
  const searchParams = useGetSearchParams()
  const pushQueryString = usePushQueryString(startTransition)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const selectedRows = Object.keys(rowSelection)

  const { data, columns, ...col } = collection || { data: [], col: {} }

  const { fieldConfig } = getFieldConfig(fields)

  const prepareCollection = ({
    collection,
    columns,
  }: {
    collection: Omit<CmsDocumentsView, "data" | "columns" | "columnOrder"> & {
      columnOrder: string[]
    }
    columns: CmsDocumentsView["columns"]
  }) => {
    return {
      ...collection,
      columnOrder: unique([
        "_select",
        "_action",
        ...((!isEmpty(collection.columnOrder)
          ? (collection.columnOrder as string[])
          : columns.reduce((acc: string[], { fieldId }) => {
              acc.push(fieldId)
              return acc
            }, [])) as any),
      ]),
      roles: collection.roles || [],
    }
  }

  const collectionState: ObjectStoreState<
    Omit<CmsDocumentsView, "data" | "columns">
  > = useObjectStore<Omit<CmsDocumentsView, "data" | "columns">>(
    prepareCollection({ collection: col, columns }) as any
  )

  const columnsState: ArrayStoreState<CmsCollectionColumn> =
    useArrayStore<CmsCollectionColumn>(columns, "fieldId")

  const dataState: ArrayStoreState<Record<string, any>> = useArrayStore<
    Record<string, any>
  >(data, "id")

  console.log("dataState: ", dataState.data())
  console.log("columnsState: ", columnsState.data())

  const errorsState: ObjectStoreState<Record<string, string>> = useObjectStore<
    Record<string, string>
  >({})

  const handleOnAddRow = async () => {
    const row: {
      state: { [key: number]: unknown }[]
      data: CmsCollectionDocumentUpdate
    } = columnsState.reduce(
      (previousValue, [id, { type }]) => {
        const value = fieldConfig[type]?.initialState

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

    const collectionId = collectionState.get("collectionId") as number

    const { data, error } = await onUpdateData({
      id: collectionId,
      data: row.data,
    })

    if (error) {
      toast(error)
      return
    }
    const id = data[0]?.id

    if (id) {
      dataState.set(id, {
        ...row.data,
        id,
      })
    }
  }

  const handleOnColumnOrderChange = (
    columnOrder: Updater<CmsCollectionUpdate["columnOrder"]>
  ): void => {
    collectionState.update(
      "columnOrder",
      columnOrder as CmsCollectionUpdate["columnOrder"]
    )

    const id = collectionState.get<"collectionId">("collectionId")

    if (id) {
      onUpdateColumnOrder(id, { columnOrder } as {
        columnOrder: CmsCollectionUpdate["columnOrder"]
      })
    }
  }

  const handleOnColumnSort =
    (column: TanstackColumn<CmsDocumentsView>, sortBy: "asc" | "desc") =>
    async (_e: React.MouseEvent<HTMLDivElement>): Promise<void> => {
      try {
        const col = columnsState.get<"fieldId">(column.id as "fieldId")

        if (col?.id) {
          const response = await onSortColumn(col?.id, { sortBy })

          const { data, columns, ...collection } = response.data

          if (response.error) {
            toast(response.error)
          }

          dataState.replace(data)
          columnsState.replace(columns)
          collectionState.replace(
            prepareCollection({ collection, columns }) as any
          )

          pushQueryString({
            ...searchParams,
            page: 1,
            orderBy: [column.id, sortBy],
          })
        }
      } catch (error) {
        console.error(error)
      }
    }

  const handleOnColumnVisibility =
    (column: TanstackColumn<CmsDocumentsView>) => async (): Promise<void> => {
      try {
        const visibility = !column.getIsVisible()
        column.toggleVisibility(visibility)

        const col = columnsState.get<"fieldId">(column.id as "fieldId")

        if (col?.id) {
          const { error } = await onUpdateColumn(col?.id, { visibility })

          if (!error) {
            columnsState.update(column.id, { visibility })
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

  const handleOnDeleteColumn = async ({
    documentId,
    fieldId,
  }: {
    documentId: number
    fieldId: string
  }): Promise<void> => {
    const { error } = await onDeleteColumn({ documentId, fieldId })

    if (error) {
      toast(error)
      return
    }

    const columnOrder = collectionState.get<"columnOrder">("columnOrder") || []
    const newColumnOrder = columnOrder.filter((c) => c !== fieldId)

    collectionState.update("columnOrder", newColumnOrder)
    columnsState.delete(fieldId)
  }

  const handleOnDeleteRow = async () => {
    const { error } = await onDeleteRow(selectedRows as any)

    if (error) {
      toast(error)
      return
    }

    dataState.delete(selectedRows.map((i) => Number.parseInt(i)))

    const rows = { ...rowSelection }
    for (const row of selectedRows) {
      delete rows[row]
    }

    setRowSelection(rows)
  }

  const handleOnDuplicateRow = async () => {
    const rows = [
      ...dataState.filter(([id]) => {
        return (selectedRows as any).includes(`${id}`)
      }),
    ].map((data) => {
      return removeObjectKeys(data as CmsCollectionDocument, [
        "id",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
      ])
    })

    //TODO: check if onUpdateData data is an object or array
    const response = await onUpdateData(
      {
        collectionId: collectionState.get("collectionId"),
        data: rows,
      },
      [
        "id",
        "collectionId",
        "data",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
      ]
    )

    if (response.error) {
      toast(response.error)
      return
    }

    dataState.add(
      response.data.map(({ data, ...doc }) => ({
        ...data,
        ...doc,
      }))
    )
  }

  const handleOnUpdateColumn = async ({
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
      response = await onUpdateColumn(id, {
        ...values,
        collectionId: collectionState.get("collectionId") as number,
      })
    } else {
      response = await onInsertColumn({
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

    columnsState.set(values.fieldId, {
      ...values,
      ...data[0],
    } as CmsCollectionColumn)

    collectionState.update("columnOrder", updateColumnOrder)

    return data
  }

  const handleOnUpdateData = async ({
    column,
    errorMessage = "",
    fieldId,
    row,
    type,
    value,
  }: {
    column: Column<Record<string, any>>
    errorMessage: string
    fieldId: string
    row: Row<Record<string, any>>
    type: string
    value: unknown
  }): Promise<void> => {
    try {
      const data = dataState.get(row.id)
      const id = data?.id

      if (id) {
        const celId = `${column.id}:${id}`
        if (errorMessage.trim() !== "") {
          errorsState.update(celId, errorMessage)
        } else {
          errorsState.delete(celId)
        }

        const { data, error } = await onUpdateData({
          id,
          meta: {
            fieldId,
            collectionId: collectionState.get<"collectionId">(
              "collectionId"
            ) as number,
            type,
          },
          data: { id, [column.id]: value },
        })
        if (error) {
          console.error(error)
          toast(error)
          return
        }

        dataState.update(id, { [column.id]: data })
      }
    } catch (error) {
      toast(error as any)
    }
  }

  const value: DocumentContextState = {
    state: {
      collection: collectionState,
      columns: columnsState,
      data: dataState,
      error: errorsState,
    },
    rowSelection,
    selectedRows,
    setRowSelection,
    addRow: handleOnAddRow,
    columnOrderChange: handleOnColumnOrderChange,
    columnVisibility: handleOnColumnVisibility,
    deleteColumn: handleOnDeleteColumn,
    deleteRow: handleOnDeleteRow,
    updateColumn: handleOnUpdateColumn,
    duplicateRow: handleOnDuplicateRow,
    sortColumn: handleOnColumnSort,
    updateData: handleOnUpdateData,
    ...getFieldConfig(fields),
  }

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  )
}
