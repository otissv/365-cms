"use client"

import type { Table, Column as TanstackColumn } from "@tanstack/react-table"
import {
  ArrowDownAZ,
  ArrowDownSquare,
  ArrowDownZA,
  EyeIcon,
  EyeOff,
  GripVertical,
  MoreVertical,
  MoveLeft,
  MoveRight,
  Settings,
  Trash2,
} from "lucide-react"
import * as React from "react"

import { type FormField, FormProvider, useFormContext } from "@repo/ui/form"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/sheet"

import { Divider } from "@repo/ui/divider"
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
import { Button } from "@repo/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { Toggle } from "@repo/ui/toggle"

import { cmsCollectionUpdateValidate } from "@repo/cms/validators.cms"
import { CmsButton } from "../ui/cms-button"
import { notBuiltInColumns } from "./builtin-columns.documents"
import { ColumnHeader } from "./columns.documents"
import { useCmsStore } from "../store.cms"
import type { CmsDocumentsView, SearchParams } from "@repo/cms/types.cms"

export function ManageCollectionDialogProvider({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const formValue: FormField[] = [
    {
      id: "name",
      value: "",
      error: "",
      validate(data, _state) {
        return cmsCollectionUpdateValidate(data)
      },
    },
    {
      id: "type",
      value: false,
      error: "",
      validate(data, _state) {
        return cmsCollectionUpdateValidate(data)
      },
    },
  ] as const

  return <FormProvider value={formValue}>{children}</FormProvider>
}

export interface ManageCollectionDialogProps {
  table: Table<Record<string, any>>
  searchParams: Required<SearchParams>
}

export function ManageCollection({
  table,
  searchParams,
}: ManageCollectionDialogProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  const { state, columnVisibility, deleteColumn, sortColumn, field } =
    useCmsStore()

  const columnOrder =
    state.documentsCollection.get<"columnOrder">("columnOrder") || []

  const form = useFormContext()

  const columns = columnOrder.map((fieldId) => {
    const column = table.getColumn(fieldId) as unknown as TanstackColumn<
      CmsDocumentsView,
      unknown
    >

    if (!column) return

    const values = (column?.columnDef as any).values

    if (!values) return

    const { columnName, type } = values
    const Icon = field.config[type as keyof typeof field.config].Icon

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
          ...searchParams,
          direction,
        },
      })
    }

    return (
      <ColumnHeader key={fieldId} column={column as any} table={table as any}>
        <div className='flex items-center h-12 border w-full text-sm gap-2'>
          <GripVertical className='h-4 ml-4' />

          <Toggle
            onClick={() => columnVisibility(column)}
            className='w-10 hover:text-accent-foreground hover:bg-accent'
          >
            {column?.getIsVisible() ? (
              <EyeIcon className='size-4' />
            ) : (
              <EyeOff className='size-4' />
            )}
          </Toggle>

          {Icon ? <Icon /> : null}
          <span className='truncate'>{columnName}</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <CmsButton
                variant='ghost'
                title={`${columnName} column menu`}
                className='ml-auto text-accent-foreground'
              >
                <MoreVertical className='h-4' />
              </CmsButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {type !== "info" && type !== "infoDate" ? (
                <>
                  <DropdownMenuItem>
                    <Settings className='h-4 mr-2' /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              ) : null}

              <DropdownMenuItem
                className='h-10'
                onClick={() =>
                  handleSortColumn({
                    column,
                    direction: "asc",
                  })
                }
              >
                <ArrowDownAZ className='h-4 w-4 mr-4' /> Sort A
                <MoveRight className='h-4 w-4 mx-2' /> Z
              </DropdownMenuItem>

              <DropdownMenuItem
                className='h-10'
                onClick={() =>
                  handleSortColumn({
                    column,
                    direction: "desc",
                  })
                }
              >
                <ArrowDownZA className='h-4 w-4 mr-4' /> Sort Z
                <MoveLeft className='h-4 w-4 mx-2 p-0' />A
              </DropdownMenuItem>

              <DropdownMenuItem>
                <ArrowDownSquare className='h-4 w-4 mr-4' /> Index
              </DropdownMenuItem>

              {notBuiltInColumns(type) && (
                <>
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
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the column and it's column's data.
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
                            className='rounded-md'
                            onClick={() => deleteColumn(fieldId)}
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
        </div>
      </ColumnHeader>
    )
  })

  return (
    <Sheet open={isOpen} onOpenChange={() => form.clear()}>
      <SheetTrigger asChild>
        <CmsButton
          title='Manage collection'
          onClick={() => setIsOpen(!isOpen)}
          Icon={Settings}
        >
          Manage Collection
        </CmsButton>
      </SheetTrigger>
      <SheetContent
        description='Manage Collection dialog'
        onClose={() => {
          setIsOpen(false)
        }}
        className='md:w-[440px] max-w-[80%]'
      >
        <SheetHeader className='mb-4'>
          <SheetTitle>Manage Collection</SheetTitle>
        </SheetHeader>

        <Divider />

        <SheetDescription
          className='text-foreground mb-1'
          aria-label='manage-collection'
        >
          Columns
        </SheetDescription>

        <div id='manage-collection' className='h-full overflow-y-auto'>
          {columns}
        </div>
      </SheetContent>
    </Sheet>
  )
}
