"use client"

import * as React from "react"
import { FileText, MoreVertical, Table } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cmsCollectionUpdateValidate } from "@repo/cms/validators.cms"
import type { CmsCollectionUpdate, CollectionsState } from "@repo/cms/types.cms"
import type { CustomError } from "@repo/lib/customError"
import { Button } from "@repo/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card"
import { cn } from "@repo/ui/cn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { type FormField, FormProvider, useFormContext } from "@repo/ui/form"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { LoadingButton } from "@repo/ui/loading-button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/sheet"
import { TypographyParagraph } from "@repo/ui/typography/paragraph.typography"

import { useCmsStore } from "../store.cms"

export function CollectionCardRenameFormProvider({
  name,
  children,
}: {
  children: React.ReactNode
  name: string
}): React.JSX.Element {
  const formValue: FormField[] = [
    {
      id: "name",
      value: name,
      error: "",
      validate: (data, _state): CmsCollectionUpdate | CustomError => {
        return cmsCollectionUpdateValidate(data)
      },
    },
  ]

  return <FormProvider value={formValue}>{children}</FormProvider>
}

export interface CollectionCardProps
  extends Omit<React.HTMLAttributes<HTMLAnchorElement>, "id"> {
  name: string
  id: number
  isGridLayout: boolean
  type: CollectionsState["type"]
  documentCount: number
}

export function CollectionCard({
  name,
  id,
  isGridLayout,
  type,
  documentCount,
}: CollectionCardProps): React.JSX.Element {
  let itemCount: string

  if (documentCount > 1) {
    itemCount = `${documentCount} items`
  } else if (!documentCount || documentCount === 0) {
    itemCount = `No items`
  } else {
    itemCount = `${documentCount} item`
  }

  const pathname = usePathname()

  return (
    <Link
      data-testid={`card-collection-${name}`}
      key={id}
      href={`${pathname}/${name}`}
      className={cn(
        "h-28 w-full lg:max-w-[1440px] transition-all",
        isGridLayout && "lg:max-w-96"
      )}
    >
      <Card className='rounded-md h-inherit p-4 space-y-4 transition-colors hover:text-accent-foreground hover:bg-accent'>
        <CardHeader>
          <CollectionCardTitle id={id} name={name} />
          <CardDescription className='text-sm' />
        </CardHeader>
        <CardContent className='p-0 h-4 flex justify-start items-center text-sm text-muted-foreground'>
          {type === "single" ? (
            <FileText className='h-4 mr-1' />
          ) : (
            <Table className='h-4 mr-1' />
          )}
          {itemCount}
        </CardContent>
      </Card>
    </Link>
  )
}

export interface CollectionCardTitleProps {
  id: number
  name: string
}

export function CollectionCardTitle({
  id,
  name,
}: CollectionCardTitleProps): React.JSX.Element {
  return (
    <CardTitle
      data-testid={`collection-card-title-${name}`}
      className='flex items-center'
    >
      <span className='truncate mr-4'>{name}</span>
      <CollectionActionMenu id={id} name={name} />
    </CardTitle>
  )
}

export interface CollectionActionMenuProps {
  id: number
  name: string
}

export function CollectionActionMenu({
  id,
  name,
}: CollectionActionMenuProps): React.JSX.Element {
  const [dropdownMenuIsOpen, setDropdownMenuIsOpen] =
    React.useState<boolean>(false)
  const [renameDialogIsOpen, setRenameDialogIsOpen] =
    React.useState<boolean>(false)
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] =
    React.useState<boolean>(false)
  const [renameIsSaving, setRenameIsSaving] = React.useState<boolean>(false)
  const [deleteIsSaving, setDeleteIsSaving] = React.useState<boolean>(false)

  const form = useFormContext()
  const nameField = form.get("name")

  const {
    state: { collections },
    renameCollection,
    deleteCollection,
  } = useCmsStore()

  const handleOnRenameSubmit = async (
    _e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    if (id) {
      const isValid = await form.validate()

      if (!isValid) return

      let error = ""

      if (name !== nameField.value) {
        setRenameIsSaving(true)
        const response = await renameCollection({
          id,
          name: nameField.value,
        })
        error = response.error
        setRenameIsSaving(false)
      }

      if (error) {
        nameField.updateError(error)
        return
      }

      setRenameDialogIsOpen(false)
      setDropdownMenuIsOpen(false)

      collections.update(id, { name: nameField.value })
    }
  }

  const handleOnDeleteSubmit = async (
    _e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    if (id) {
      setDeleteIsSaving(true)
      await deleteCollection(id)
      setDeleteIsSaving(false)

      collections.delete(id)
      setDeleteDialogIsOpen(false)
      setDropdownMenuIsOpen(false)
    }
  }

  return (
    <DropdownMenu open={dropdownMenuIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size='sm'
          variant='outline'
          className='ml-auto text-sm'
          title='Collections action menu'
          onClick={() => setDropdownMenuIsOpen(!dropdownMenuIsOpen)}
        >
          Actions <MoreVertical className='h-3 ml-1 w-auto p-0' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Sheet open={renameDialogIsOpen}>
          <SheetTrigger asChild>
            <Button
              size='sm'
              variant='ghost'
              className='justify-start w-full font-normal'
              title='Rename collection'
              onClick={() => setRenameDialogIsOpen(!renameDialogIsOpen)}
            >
              Rename
            </Button>
          </SheetTrigger>
          <SheetContent
            description='Rename collection dialog'
            onClose={() => {
              setRenameDialogIsOpen(false)
              setDropdownMenuIsOpen(!dropdownMenuIsOpen)
            }}
          >
            <SheetHeader className='mb-4'>
              <SheetTitle>Rename Collection</SheetTitle>

              {nameField.error ? (
                <TypographyParagraph className='bg-destructive text-destructive-foreground rounded-md px-2'>
                  {nameField.error}
                </TypographyParagraph>
              ) : null}

              <form>
                <div className='space-y-1'>
                  <Label htmlFor='rename'>Collections new name</Label>
                  <Input
                    id='rename'
                    value={nameField.value}
                    onChange={(e: React.MouseEvent<HTMLInputElement>) => {
                      nameField.updateValue(e.currentTarget.value)
                    }}
                  />
                </div>

                <LoadingButton
                  isLoading={renameIsSaving}
                  onClick={handleOnRenameSubmit}
                  title='Rename collection'
                  loadingText='Renaming...'
                  className='mb-8'
                >
                  Save
                </LoadingButton>
              </form>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <Sheet open={deleteDialogIsOpen}>
          <SheetTrigger asChild>
            <Button
              size='sm'
              variant='ghost'
              className='justify-start w-full font-normal text-destructive hover:text-destructive-foreground hover:bg-destructive'
              title='Rename collection'
              onClick={() => setDeleteDialogIsOpen(!deleteDialogIsOpen)}
            >
              Delete
            </Button>
          </SheetTrigger>
          <SheetContent
            description='Delete confirmation dialog'
            className='w-[440px] max-w-[80%] min-w-[300px]'
            onClose={() => {
              setDeleteDialogIsOpen(false)
              setDropdownMenuIsOpen(!dropdownMenuIsOpen)
            }}
          >
            <SheetHeader className='mb-4'>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
            </SheetHeader>

            <SheetDescription>
              You are about to permanently{" "}
              <span className='font-semibold'>delete</span> the
              {name} collection. This action cannot be undone.
            </SheetDescription>

            <LoadingButton
              variant='destructive'
              onClick={handleOnDeleteSubmit}
              title='Delete collection'
              loadingText='Deleting...'
              isLoading={deleteIsSaving}
              className='mt-8'
            >
              Delete {name}
            </LoadingButton>
          </SheetContent>
        </Sheet>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
