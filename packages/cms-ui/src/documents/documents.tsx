"use client"

import React from "react"

import { Plus, Download, BookPlus, Copy, Trash2 } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column as TanstackColumn,
  type ColumnDef,
  type Table as TanstackTable,
} from "@tanstack/react-table"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import type { CmsDocumentsView, SearchParams } from "@repo/cms/types.cms"
import { cn } from "@repo/ui/cn"
import { Button } from "@repo/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@repo/ui/dropdown-menu"

import { isEmpty } from "@repo/lib/isEmpty"
import { Checkbox } from "@repo/ui/checkbox"
import { Pagination } from "@repo/ui/page/pagination"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@repo/ui/table"
import {
  exportToCsv,
  exportToExcel,
  exportToJson,
} from "@repo/ui/download-file"

import {
  CmsContextState,
  prepareDocuments,
  useCmsStore,
  type FieldConfig,
} from "../store.cms"
import { searchParamsWithDefaults } from "../searchParamsWithDefaults.cms"
import { type CmsToolbarProps, CmsToolbar, CmsButton } from "../ui/cms-button"
import { ToggleLayout } from "../ui/toggle-layout"
import { ColumnDialog } from "./column-dialog.documents"
import { ManageCollection } from "./manage-collection.documents"
import { getTableColumns } from "./columns.documents"

export interface DocumentProps extends React.HTMLAttributes<HTMLDivElement> {
  collection: CmsDocumentsView
  collectionName: string
  searchParams: SearchParams
  totalPages: number
  fields: FieldConfig[]
}
export default function Documents({
  collection,
  fields,
  searchParams,
  ...props
}: DocumentProps) {
  const { state, setFields } = useCmsStore()
  const [isLoaded, setIsLoaded] = React.useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once
  React.useEffect(() => {
    setFields(fields)
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once
  React.useEffect(() => {
    const { data, columns, ...col } = collection
    const documents = prepareDocuments({ collection: col, columns })

    state.documentsCollection.replace(documents as any)
    state.columns.replace(columns)
    state.documents.replace(data)

    setIsLoaded(true)
  }, [searchParams.page, searchParams.limit, JSON.stringify(collection)])

  return isLoaded ? (
    <Docs
      collection={collection}
      fields={fields}
      searchParams={searchParams}
      {...props}
    />
  ) : null
}

export interface DocsProps extends React.HTMLAttributes<HTMLDivElement> {
  collection: CmsDocumentsView
  collectionName: string
  searchParams: SearchParams
  totalPages: number
  fields: FieldConfig[]
}
export function Docs({
  collection,
  collectionName,
  searchParams,
  totalPages,
  fields,
  className,
  ...props
}: DocumentProps) {
  const documentSearchParams = searchParamsWithDefaults(searchParams)

  const {
    state,
    columnOrderChange,
    columnVisibility,
    deleteColumn,
    rowSelection,
    setRowSelection,
    sortColumn,
    updateData,
    field,
  } = useCmsStore()

  const _collectionName =
    state.documentsCollection.get<"collectionName">("collectionName") || ""

  const _collectionId =
    state.documentsCollection.get<"collectionId">("collectionId") || -1

  const _collectionType =
    state.documentsCollection.get<"type">("collectionType") || "single"

  const _columns = state.columns.values()
  const _errors = state.error.data()

  const handleSortColumn = ({
    column,
    direction,
  }: {
    column: TanstackColumn<CmsDocumentsView>
    direction: "asc" | "desc"
  }) => {
    return sortColumn({
      column,
      searchParams: {
        ...documentSearchParams,
        direction,
      },
    })
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const tableColumns = React.useMemo(
    () =>
      getTableColumns({
        collectionId: _collectionId,
        collectionName: _collectionName,
        collectionType: _collectionType,
        columns: _columns,
        errors: _errors,
        fieldConfig: field.config,
        fieldComponent: field.component,
        fieldOptions: field.options,
        onSortColumn: handleSortColumn,
        onColumnVisibility: columnVisibility,
        onDeleteColumn: deleteColumn,
      }),
    [
      _collectionName,
      _collectionType,
      _collectionId,
      JSON.stringify(_columns.sort),
      _errors,
    ]
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const dataMemo = React.useMemo(() => {
    return state.documents.values()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state.documents.values())])

  const table = useReactTable({
    state: {
      rowSelection,
      columnVisibility: state.columns
        .values()
        .reduce((acc: Record<string, any>, column) => {
          acc[column.fieldId] = column.visibility
          return acc
        }, {}),
      columnOrder: state.documentsCollection.get<"columnOrder">("columnOrder"),
    },
    data: dataMemo as any[],
    columns: (documentSearchParams.layout === "grid"
      ? tableColumns
      : tableColumns.filter(
          (item) => item.id === "_select" || item.id === "_action"
        )) as ColumnDef<{ id: string }, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnOrderChange: columnOrderChange,
    onRowSelectionChange: setRowSelection,
    getRowId: (row: { id: string }) => row.id,
    meta: {
      updateData,
    },
  })

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={cn("space-y-4", className)} {...props}>
        <DocumentListToolbar
          collectionName={collectionName}
          table={table as any}
          searchParams={documentSearchParams}
        />

        <DocumentsList
          table={table as any}
          searchParams={searchParams}
          totalPages={totalPages}
        />
      </div>
    </DndProvider>
  )
}

export interface DocumentListToolbarProps extends CmsToolbarProps {
  table: TanstackTable<Record<string, any>>
  searchParams: SearchParams
  collectionName: string
}
export function DocumentListToolbar({
  table,
  searchParams,
  collectionName,
  ...props
}: DocumentListToolbarProps) {
  const [isColumnDialogOpen, setIsColumnDialogOpen] = React.useState(false)

  const documentSearchParams = searchParamsWithDefaults(searchParams)

  const { state, addRow } = useCmsStore()

  const handleOnExport =
    (type: "csv" | "excel" | "json") =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      const arg = {
        fileName: collectionName,
        data: state.documents.values(),
      }

      switch (type) {
        case "csv":
          exportToCsv(arg)
          break
        case "excel":
          exportToExcel(arg)
          break
        case "json":
          exportToJson(arg)
          break
      }
    }

  return (
    <CmsToolbar {...props}>
      {state.columns.size() ? (
        <CmsButton title='Add Item' Icon={Plus} onClick={addRow}>
          Add Item
        </CmsButton>
      ) : null}

      <ColumnDialog
        isOpen={isColumnDialogOpen}
        setIsOpen={setIsColumnDialogOpen}
        step={0}
      >
        <CmsButton
          title='Add Column'
          onClick={() => setIsColumnDialogOpen(!isColumnDialogOpen)}
          Icon={Plus}
        >
          Add Column
        </CmsButton>
      </ColumnDialog>

      <ManageCollection table={table} searchParams={documentSearchParams} />

      <ToggleLayout
        size='sm'
        searchParams={documentSearchParams}
        path={`/collections/${collectionName}`}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <CmsButton title='Download file'>
            <Download />
          </CmsButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Button onClick={handleOnExport("csv")}>CSV</Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button onClick={handleOnExport("json")}>JSON</Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button onClick={handleOnExport("excel")}>Excel</Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button className='rounded-md'>
        <BookPlus /> Publish
      </Button>
    </CmsToolbar>
  )
}

export interface DocumentListProps {
  searchParams: SearchParams
  table: TanstackTable<Record<string, any>>
  totalPages: number
}
export function DocumentsList({
  searchParams,
  table,
  totalPages,
}: DocumentListProps) {
  const documentSearchParams = searchParamsWithDefaults(searchParams)

  const { state, selectedRows, deleteRow, duplicateRow, addRow } = useCmsStore()

  return (
    <>
      <div className='space-y-1'>
        <p
          className={cn(
            "w-full h-8 py-1 px-2",
            state.error.size()
              ? "bg-destructive text-destructive-foreground rounded-md"
              : "not-sr-only"
          )}
        >
          <span className={cn(!state.error.size() && "hidden")}>
            Data contains errors.
          </span>
        </p>

        {state.documents.size() ? (
          <div className='flex gap-4 mb-2 items-center'>
            <Checkbox
              className='size-10'
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label='Select all'
            />

            <div>
              {!isEmpty(selectedRows) && (
                <>
                  <Button
                    onClick={deleteRow}
                    variant='ghost'
                    className='size-10 p-0'
                  >
                    <Trash2 className='size-4' />
                  </Button>

                  <Button
                    onClick={duplicateRow}
                    variant='ghost'
                    className='size-10 p-0'
                  >
                    <Copy className='size-4' />
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : null}

        <Table className='data-table w-auto'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className='border bg-gray-900 h-10 p-0 text-base'
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className='border-0 data-[state=selected]:bg-gray-800'
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className='p-0' key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={state.columns.size() + 2}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}

            {state.documentsCollection.get("type") === "multiple" &&
            state.columns.size() ? (
              <TableRow>
                <TableCell
                  colSpan={state.columns.size() + 2}
                  className='p-0 text-center '
                >
                  <CmsButton
                    className='border h-10 w-full text-left justify-start text-sm rounded-none bg-gray-900 text-accent-foreground hover:bg-accent hover:text-accent-foreground'
                    onClick={addRow}
                    Icon={Plus}
                  >
                    <span className='whitespace-nowrap'>Add Item</span>
                  </CmsButton>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      {totalPages > 10 ? (
        <Pagination
          totalPages={totalPages}
          limit={documentSearchParams.limit}
          page={documentSearchParams.page}
        />
      ) : null}
    </>
  )
}
