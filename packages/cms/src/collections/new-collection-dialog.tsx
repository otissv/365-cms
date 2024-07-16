"use client"

import { Plus } from "lucide-react"
import * as React from "react"

import { CustomError } from "@repo/lib/customError"
import { isEmpty } from "@repo/lib/isEmpty"
import { type FormField, FormProvider, useFormContext } from "@repo/ui/form"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { LoadingButton } from "@repo/ui/loading-button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/sheet"
import { ToggleSwitch } from "@repo/ui/toggle-switch"

import {
  cmsCollectionUpdateValidate,
  formCmsCollectionInsertFormValidate,
} from "../cms-validators"
import type { CollectionState } from "../cms.types"
import { CmsButton } from "../components/cms-button"
import { useCollectionContext } from "./provider.collection"

export function NewCollectionDialogProvider({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const formValue: FormField[] = [
    {
      id: "name",
      value: "",
      error: "",
      validate: (data, _state): Promise<Record<string, any> | CustomError> => {
        return cmsCollectionUpdateValidate(data)
      },
    },
    {
      id: "type",
      value: false,
      error: "",
      validate: (data, _state): Promise<Record<string, any> | CustomError> => {
        return cmsCollectionUpdateValidate(data)
      },
    },
  ] as const

  return <FormProvider value={formValue}>{children}</FormProvider>
}

export function NewCollectionDialog(): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  const collection = useCollectionContext()

  const form = useFormContext()
  const nameField = form.get("name")
  const typeField = form.get("type")

  const reset = (): void => {
    form.clear()
  }

  const handleOnSubmit = async (): Promise<void> => {
    const data: {
      name: string
      type: CollectionState["type"]
      roles: CollectionState["roles"]
    } = {
      name: nameField.value,
      type: typeField.value ? "single" : "multiple",
      roles: [],
    }
    const error = await formCmsCollectionInsertFormValidate(data)

    if (error instanceof CustomError) {
      console.log(error.entries)

      if (error.issues.name) {
        nameField.updateError(error.issues.name)
        console.error(error.issues)
      }

      return
    }

    setIsSaving(true)
    const result = await collection.onNew(data)
    setIsSaving(false)

    if (!isEmpty(result.data)) {
      const id = result.data[0]?.id
      id && collection.set(id, result.data[0] as any)

      setIsOpen(false)
      reset()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={reset}>
      <SheetTrigger asChild>
        <CmsButton
          variant='outline'
          title='Add collection'
          onClick={() => setIsOpen(!isOpen)}
          Icon={Plus}
        >
          New Collection
        </CmsButton>
      </SheetTrigger>
      <SheetContent
        onClose={() => {
          setIsOpen(false)
        }}
        className='w-[440px] max-w-[80%] min-w-[300px]'
      >
        <SheetHeader className='mb-4'>
          <SheetTitle>Create New Collection</SheetTitle>
        </SheetHeader>

        {nameField.error ? (
          <p className='px-2 bg-destructive rounded-md mb-6'>
            {nameField.error}
          </p>
        ) : null}

        <form className='space-y-4'>
          <div>
            <Label>Name</Label>
            <Input
              value={nameField.value}
              onChange={(e: React.MouseEvent<HTMLButtonElement>) =>
                nameField.updateValue(e.currentTarget.value)
              }
            />
          </div>

          <div className='grid gap-1'>
            <Label htmlFor='type'>Type</Label>

            <ToggleSwitch
              title='toggle collection type'
              id='type'
              onOff='Single,Multiple'
              checked={typeField.value}
              onCheckedChange={() => typeField.updateValue(!typeField.value)}
              className='w-[11rem]'
            />
          </div>
        </form>

        <LoadingButton
          onClick={handleOnSubmit}
          title='Delete collection'
          loadingText='Saving'
          isLoading={isSaving}
          className='mt-8'
        >
          Add Collection
        </LoadingButton>
      </SheetContent>
    </Sheet>
  )
}
