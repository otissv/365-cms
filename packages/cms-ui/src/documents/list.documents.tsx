"use client"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Table as TanstackTable,
} from "@tanstack/react-table"
import { BookPlus, Copy, Download, Plus, Trash2 } from "lucide-react"
import React from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { cn } from "@repo/ui/cn"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table"
import { isEmpty } from "@repo/lib/isEmpty"
import { Button } from "@repo/ui/button"
import { Checkbox } from "@repo/ui/checkbox"
import type { SearchParams, ToggleLayoutTypes } from "@repo/cms/types.cms"
import { Pagination } from "@repo/ui/page/pagination"

import { useDocument } from "../documents/provider.documents"
import { CmsButton, CmsToolbar } from "../ui/cms-button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@repo/ui/dropdown-menu"

import { getTableColumns } from "./columns.documents"
import { ColumnDialog } from "./column-dialog.documents"
import { ManageCollection } from "./manage-collection.documents"
import { ToggleLayout } from "../ui/toggle-layout"

function DocumentListToolBar({
  table,
  layout = "grid",
  page,
  limit,
  collectionName,
}: DocumentListToolBarProps) {
  const [isColumnDialogOpen, setIsColumnDialogOpen] = React.useState(false)
  const { state, addRow } = useDocument()

  return (
    <CmsToolbar>
      {state.columns.size() ? (
        <CmsButton title='Add Item' Icon={Plus} onClick={addRow}>
          Add Item
        </CmsButton>
      ) : null}

      <ColumnDialog
        isOpen={isColumnDialogOpen}
        setIsOpen={setIsColumnDialogOpen}
      >
        <CmsButton
          title='Add Column'
          onClick={() => setIsColumnDialogOpen(!isColumnDialogOpen)}
          Icon={Plus}
        >
          Add Column
        </CmsButton>
      </ColumnDialog>

      <ManageCollection table={table} />

      <ToggleLayout
        layout={layout}
        size='sm'
        searchParams={{
          page,
          limit,
          layout: layout,
        }}
        onChange={console.log}
        path={`/collections/${collectionName}`}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <CmsButton title='Download file'>
            <Download />
          </CmsButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>CSV</DropdownMenuItem>
          <DropdownMenuItem>JSON</DropdownMenuItem>
          <DropdownMenuItem>Excel</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button className='rounded-md'>
        <BookPlus /> Publish
      </Button>
    </CmsToolbar>
  )
}

export function DocumentList({
  className,
  collectionName,
  layout = "grid",
  limit,
  page,
  totalPages,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  collectionName: string
  layout: ToggleLayoutTypes
  limit: number
  page: number
  totalPages: number
}): React.JSX.Element {
  const {
    state,
    addRow,
    columnOrderChange,
    columnVisibility,
    deleteColumn,
    deleteRow,
    duplicateRow,
    rowSelection,
    selectedRows,
    setRowSelection,
    sortColumn,
    updateData,
  } = useDocument()

  const _collectionName =
    state.collection.get<"collectionName">("collectionName") || ""

  const _collectionId =
    state.collection.get<"collectionId">("collectionId") || -1

  const _collectionType =
    state.collection.get<"type">("collectionType") || "single"

  const _columns = state.columns.values()
  const _errors = state.error.data()

  const { fieldConfig, fieldComponent, fieldOptions } = useDocument()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const tableColumns = React.useMemo(
    () =>
      getTableColumns({
        collectionId: _collectionId,
        collectionName: _collectionName,
        collectionType: _collectionType,
        columns: _columns,
        errors: _errors,
        fieldConfig,
        fieldComponent,
        fieldOptions,
        onSortColumn: sortColumn,
        onColumnVisibility: columnVisibility,
        onDeleteColumn: deleteColumn,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return state.data.values()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state.data.values())])

  const table = useReactTable({
    state: {
      rowSelection,
      columnVisibility: state.columns
        .values()
        .reduce((acc: Record<string, any>, column) => {
          acc[column.fieldId] = column.visibility
          return acc
        }, {}),
      columnOrder: state.collection.get<"columnOrder">("columnOrder"),
    },
    data: dataMemo as any[],
    columns: (layout === "grid"
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
        <DocumentListToolBar
          collectionName={collectionName}
          table={table as any}
          layout={layout}
          page={page}
          limit={limit}
        />

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

          {state.data.size() ? (
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

              {state.collection.get("type") === "multiple" &&
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
          <Pagination totalPages={totalPages} limit={limit} page={page} />
        ) : null}
      </div>
    </DndProvider>
  )
}

export interface DocumentListToolBarProps {
  table: TanstackTable<Record<string, any>>
  layout: SearchParams["layout"]
  limit: number
  page: number
  collectionName: string
}
