"use client"

import React from "react"

import type {
  CmsCollectionColumn,
  CmsErrorState,
  CmsField,
} from "@repo/cms/types.cms"
import type { CellContext } from "@tanstack/react-table"

export function DataTableCell<TData, TValue>({
  collectionId,
  getValue,
  row,
  column,
  table,
  fieldId,
  type,
  columnName,
  errors,
  fieldComponent,
}: {
  row: CellContext<TData, TValue>["row"]
  getValue: CellContext<TData, TValue>["getValue"]
  column: CellContext<TData, TValue>["column"]
  table: CellContext<TData, TValue>["table"]
  fieldId: string
  type?: CmsCollectionColumn["type"]
  collectionId: number
  errors: CmsErrorState
  columnName: string
  fieldComponent: Record<
    string,
    <TElement extends HTMLElement, Value extends Record<string, any>>(
      props: CmsField<TElement, Value>
    ) => JSX.Element
  >
}): JSX.Element {
  const initialValue = getValue()
  const [value, setValue] = React.useState(initialValue)
  const [isMounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const onUpdate = (value: unknown, errorMessage = "") => {
    isMounted &&
      (table.options.meta as Record<string, any>)?.updateData({
        type,
        fieldId,
        row,
        column,
        value,
        errorMessage,
      })
  }

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const celId = `${column.id}:${row.id}`

  const errorMessage = errors.get(celId) || ""

  const Field = type ? fieldComponent[type] : null

  console.log(
    "DataTableCell: ",
    type,
    (column.columnDef as any).values.fieldOptions
  )

  return Field ? (
    <Field
      collectionId={collectionId}
      columnName={columnName}
      errorMessage={errorMessage}
      fieldId={fieldId}
      id={celId}
      isInline={true}
      options={(column.columnDef as any).values.fieldOptions}
      type={type}
      validate={(column.columnDef as any).validate}
      validation={(column.columnDef as any).values.validation}
      value={value as any}
      onUpdate={onUpdate}
    />
  ) : (
    <></>
  )
}
