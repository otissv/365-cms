/* eslint-disable @typescript-eslint/explicit-function-return-type */
"use client"

import type {
  CellContext,
  ColumnDef,
  ColumnOrderState,
  Column as TanstackColumn,
  Table as TanstackTable,
} from "@tanstack/react-table"
import {
  ArrowDownAZ,
  ArrowDownSquare,
  ArrowDownZA,
  ArrowUpRightFromSquare,
  EyeOff,
  GripVertical,
  Info,
  MoreVertical,
  MoveLeft,
  MoveRight,
  Settings,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import React from "react"
import { useDrag, useDrop } from "react-dnd"

import { Button } from "@repo/ui/button"
import { Checkbox } from "@repo/ui/checkbox"
import { cn } from "@repo/ui/cn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/alert-dialog"

import type {
  CmsCollectionColumn,
  CmsConfigField,
  CmsDocumentsView,
  CmsErrorState,
  CmsField,
} from "@repo/cms/types.cms"
import { notBuiltInColumns } from "./builtin-columns.documents"
import { DataTableCell } from "./data-table-cell.documents"
import { CmsButton } from "../ui/cms-button"
import { ColumnDialog } from "./column-dialog.documents"
import type { CmsContextState } from "../store.cms"

export function getTableColumns<TData, TValue>({
  collectionId,
  collectionName,
  columns,
  errors,
  fieldComponent,
  fieldConfig,
  onDeleteColumn,
  onSortColumn,
  onColumnVisibility,
}: {
  collectionId: CmsDocumentsView["collectionId"]
  collectionName: CmsDocumentsView["collectionName"]
  collectionType: CmsDocumentsView["type"]
  columns: CmsDocumentsView["columns"]
  errors: CmsErrorState
  fieldConfig: Record<string, CmsConfigField<any, any, any>>
  fieldComponent: Record<
    string,
    <TElement extends HTMLElement, Value extends Record<string, any>>(
      props: CmsField<TElement, Value>
    ) => JSX.Element
  >
  fieldOptions: Record<
    string,
    (props: {
      type?: string
      fieldId: string
      onUpdate: (newValue: unknown, errorMessage?: "string") => void
      value: any
    }) => JSX.Element
  >
  onDeleteColumn: CmsContextState["deleteColumn"]
  onSortColumn: (props: {
    column: TanstackColumn<CmsDocumentsView>
    direction: "asc" | "desc"
  }) => Promise<void>
  onColumnVisibility: CmsContextState["columnVisibility"]
}): ColumnDef<TData, TValue>[] {
  return [
    {
      id: "_select",
      header: () => <></>,
      cell: ({ row }) => (
        <div className='flex items-center h-10 border border-t-0'>
          <Checkbox
            className='mx-4'
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "_action",
      header: () => (
        <div className='flex items-center px-4 min-h-10 min-w-10 text-muted-foreground '>
          ID
        </div>
      ),
      cell: ({ row }) => {
        return (
          <Link
            className='flex items-center border-t-0 text-sm h-10 border rounded-none'
            href={`/admin/cms/collections/${collectionName}/${row.id}`}
            passHref
          >
            <Button
              variant='ghost'
              size='sm'
              className='w-full px-3 justify-start h-10 text-accent-foreground font-medium rounded-none hover:bg-accent hover:text-accent-foreground '
            >
              <ArrowUpRightFromSquare className='h-4' />
              <span className='ml-1 whitespace-nowrap'>{Number(row.id)}</span>
            </Button>
          </Link>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },

    ...columns.map(
      ({
        id,
        columnName,
        fieldId,
        type,
        help,
        fieldOptions,
        validation,
        ...values
      }) => {
        return dynamicColumn({
          collectionId,
          columnName,
          fieldId,
          type,
          help: help || "",
          fieldOptions: fieldOptions || {},
          validation: validation || {},
          values,
          onSortColumn,
          onColumnVisibility,
          onDeleteColumn,
          errors,
          fieldConfig,
          fieldComponent,
        })
      }
    ),
  ]
}

export function dynamicColumn({
  collectionId,
  columnName,
  errors,
  fieldComponent,
  fieldConfig,
  fieldId,
  fieldOptions,
  help,
  type,
  validation,
  values,
  onDeleteColumn,
  onSortColumn,
  onColumnVisibility,
}: {
  collectionId: number
  columnName: string
  errors: CmsErrorState
  fieldId: string
  fieldOptions: Record<string, any>
  fieldComponent: Record<
    string,
    <TElement extends HTMLElement, Value extends Record<string, any>>(
      props: CmsField<TElement, Value>
    ) => JSX.Element
  >
  fieldConfig: Record<string, CmsConfigField<any, any, any>>
  help: string
  type: CmsCollectionColumn["type"]
  validation: Record<string, any>
  values: Partial<CmsCollectionColumn>
  onDeleteColumn: CmsContextState["deleteColumn"]
  onSortColumn: (props: {
    column: TanstackColumn<CmsDocumentsView>
    direction: "asc" | "desc"
  }) => Promise<void>
  onColumnVisibility: CmsContextState["columnVisibility"]
}) {
  const field = (fieldConfig as any)[type]

  if (!field) {
    throw new Error(`Documents is missing ${type} field`)
  }

  return {
    accessorKey: fieldId,
    header: ({
      table,
      column,
    }: {
      column: TanstackColumn<any>
      table: TanstackTable<any>
    }) => {
      const Icon = field?.Icon || (() => null)

      return (
        <ColumnHeader column={column as any} table={table}>
          <GripVertical className='h-5 p-0' />
          <Icon className='h-4 text-muted-foreground' />

          <span>
            {columnName}
            <span className='!ml-none text-destructive'>
              {validation?.required ? "*" : ""}
            </span>
          </span>

          <div className='!ml-auto flex gap-2 justify-center'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className='h-5' />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{help || field.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ColumnHeaderDropdown
              type={type}
              fieldId={fieldId}
              className='!ml-auto"'
              column={column}
              onColumnVisibility={onColumnVisibility}
              onSortColumn={onSortColumn}
              onDeleteColumn={onDeleteColumn}
            />
          </div>
        </ColumnHeader>
      )
    },
    cell: <TData, TValue>(props: CellContext<TData, TValue>) => {
      return (
        <DataTableCell
          {...props}
          collectionId={collectionId}
          fieldComponent={fieldComponent}
          columnName={columnName}
          fieldId={fieldId}
          type={type}
          errors={errors}
        />
      )
    },
    values: {
      columnName,
      fieldId,
      type,
      fieldOptions: { ...field?.optionsDefaults, ...fieldOptions },
      validation: { ...field?.validationDefaults, ...validation },
      ...values,
    },
    validate: field.validate,
  }
}

function reorderColumn(
  draggedColumnId: string,
  targetColumnId: number,
  columnOrder: string[]
): ColumnOrderState {
  columnOrder.splice(
    columnOrder.indexOf(`${targetColumnId}`),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  )
  return [...columnOrder]
}

export function ColumnHeader({
  table,
  column,
  children,
  canDrag = true,
}: {
  column: CmsCollectionColumn
  table: TanstackTable<CmsCollectionColumn>
  children: React.ReactNode
  canDrag?: boolean
}) {
  const { getState, setColumnOrder } = table
  const { columnOrder } = getState()

  const [{ isOver }, dropRef] = useDrop({
    accept: "column",
    drop: (draggedColumn: TanstackColumn<CmsCollectionColumn>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder
      )
      setColumnOrder(newColumnOrder)
    },
    collect: (monitor) => {
      const item = monitor.getItem()
      if (item) {
      }
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }
    },
  })

  const [_, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: "column",
    canDrag,
  })

  return (
    <div ref={dropRef} className={cn(isOver && "bg-gray-700")}>
      <div ref={previewRef}>
        <div className='flex items-center w-full space-x-4' ref={dragRef}>
          {children}
        </div>
      </div>
    </div>
  )
}

function ColumnHeaderDropdown({
  fieldId,
  className,
  column,
  type,
  onDeleteColumn,
  onSortColumn,
  onColumnVisibility,
}: {
  fieldId: string
  className: string
  column: TanstackColumn<any>
  type: string
  onDeleteColumn: CmsContextState["deleteColumn"]
  onSortColumn: (props: {
    column: TanstackColumn<CmsDocumentsView>
    direction: "asc" | "desc"
  }) => Promise<void>
  onColumnVisibility: CmsContextState["columnVisibility"]
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className={cn("text-accent-foreground", className)}
        >
          <MoreVertical className='h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {type !== "info" && type !== "infoDate" ? (
          <>
            <ColumnDialog
              fieldId={fieldId}
              isOpen={isOpen}
              step={1}
              setIsOpen={setIsOpen}
              isEdit={true}
            >
              <CmsButton
                variant='ghost'
                title='Edit Column'
                Icon={Settings}
                className='w-full h-10 justify-start py-1.5 px-2'
                onClick={() => setIsOpen(!isOpen)}
              >
                Edit
              </CmsButton>
            </ColumnDialog>

            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem
          className='h-10'
          onClick={() => onColumnVisibility(column)}
        >
          <EyeOff className='h-4 w-4 mr-4' /> Hide
        </DropdownMenuItem>
        <DropdownMenuItem
          className='h-10'
          onClick={() => onSortColumn({ column, direction: "asc" })}
        >
          <ArrowDownAZ className='h-4 w-4 mr-4' /> Sort A
          <MoveRight className='h-4 w-4 mx-2' /> Z
        </DropdownMenuItem>
        <DropdownMenuItem
          className='h-10'
          onClick={() => onSortColumn({ column, direction: "desc" })}
        >
          <ArrowDownZA className='h-4 w-4 mr-4' /> Sort Z
          <MoveLeft className='h-4 w-4 mx-2 p-0' />A
        </DropdownMenuItem>
        {notBuiltInColumns(fieldId) && (
          <>
            <DropdownMenuItem>
              <ArrowDownSquare className='h-4 w-4 mr-4' /> Index
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <AlertDialog open={isDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-red-600 h-10 w-full px-2 py-[6px] flex justify-start'
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 className='h-4 w-4 mr-4' /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the column and it's column's data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setIsDeleteOpen(false)}
                    className='rounded-md'
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      variant='destructive'
                      onClick={() => onDeleteColumn(fieldId)}
                      className='rounded-md'
                    >
                      Delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
