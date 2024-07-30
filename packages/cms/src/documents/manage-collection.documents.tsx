"use client"

import type { Table } from "@tanstack/react-table"
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

import type { CustomError } from "@repo/lib/customError"
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

import { cmsCollectionUpdateValidate } from "../validators.cms"
import { CmsButton } from "../ui/cms-button"
import { notBuiltInColumns } from "./builtin-columns.documents"
import { ColumnHeader } from "./columns.documents"
import { useDocument } from "./provider.documents"

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
  columnOrder: string[]
  table: Table<Record<string, any>>
}

export function ManageCollection({
  columnOrder,
  table,
}: ManageCollectionDialogProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  const { columnVisibility, sortColumn, fieldConfig } = useDocument()

  const form = useFormContext()

  const reset = (): void => {
    form.clear()
  }

  return (
    <Sheet open={isOpen} onOpenChange={reset}>
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
        className='w-[440px] max-w-[80%]'
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
          {columnOrder.map((fieldId) => {
            const column = table.getColumn(fieldId)

            if (!column) return

            const values = (column?.columnDef as any).values

            if (!values) return

            const { columnName, type } = values

            const Icon = fieldConfig[type as keyof typeof fieldConfig]?.Icon

            return (
              <ColumnHeader
                key={fieldId}
                column={column as any}
                table={table as any}
              >
                <div className='flex items-center h-14 border w-full text-sm gap-2'>
                  <GripVertical className='h-4 ml-4' />

                  <Toggle
                    onClick={columnVisibility(column as any)}
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
                        <MoreVertical className='size-4' />
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
                        onClick={sortColumn(column, "asc")}
                      >
                        <ArrowDownAZ className='h-4 w-4 mr-4' /> Sort A
                        <MoveRight className='h-4 w-4 mx-2' /> Z
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className='h-10'
                        onClick={sortColumn(column, "desc")}
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
                                  This action cannot be undone. This will
                                  permanently delete the column and it's
                                  column's data.
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
                                    // onClick={onDeleteColumn}
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
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
