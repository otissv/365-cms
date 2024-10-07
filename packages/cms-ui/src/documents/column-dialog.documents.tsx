"use client"

import { CheckCircle2Icon, RefreshCcw } from "lucide-react"
import * as React from "react"

import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"

import { isEmpty } from "@repo/lib/isEmpty"
import { isError } from "@repo/lib/isError"
import { maybeBoolean } from "@repo/lib/maybeBoolean"
import { maybeObject } from "@repo/lib/maybeObject"
import { maybeString } from "@repo/lib/maybeString"
import { validate } from "@repo/lib/validate"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/accordion"
import { Button } from "@repo/ui/button"
import { cn } from "@repo/ui/cn"
import { type FormField, FormProvider, useFormContext } from "@repo/ui/form"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Maybe } from "@repo/ui/maybe"
import type { CustomError } from "@repo/lib/customError"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import { ToggleSwitch } from "@repo/ui/toggle-switch"

import { cmsColumnDialogValidator } from "@repo/cms/validators.cms"
import type { CmsColumnDialog } from "@repo/cms/types.cms"
import { useCmsStore } from "../store.cms"

export type Step = 0 | 1

export function ColumnProvider({
  children,
  columnName,
  fieldId,
  fieldOptions = {},
  help,
  index,
  sortBy,
  type,
  validation = {},
}: {
  children: React.ReactNode
  type?: string
  columnName?: string
  fieldId?: string
  fieldOptions?: Record<string, any>
  help?: string
  index?: {
    direction: "asc" | "desc"
    nulls: "first" | "last"
  }
  sortBy?: "asc" | "desc"
  validation?: Record<string, any>
}): React.JSX.Element {
  const formValue: FormField[] = [
    {
      id: "type",
      value: maybeString(type),
      error: "",
      validate(value) {
        const validator = cmsColumnDialogValidator.pick({ type: true })
        return validate(validator)({ type: value })
      },
    },
    {
      id: "columnName",
      value: maybeString(columnName),
      error: "",
      validate(value) {
        const validator = cmsColumnDialogValidator.pick({ columnName: true })
        return validate(validator)({ columnName: value })
      },
    },
    {
      id: "fieldId",
      value: maybeString(fieldId),
      error: "",
      validate(value) {
        const validator = cmsColumnDialogValidator.pick({ fieldId: true })
        return validate(validator)({ fieldId: value })
      },
    },
    {
      id: "help",
      value: maybeString(help),
      error: "",
      validate(value) {
        const validator = cmsColumnDialogValidator.pick({ help: true })
        return validate(validator)({ help: value })
      },
    },
    {
      id: "validation",
      value: maybeObject(validation),
      error: "",
      validate(value) {
        const validator = cmsColumnDialogValidator.pick({ validation: true })
        return validate(validator)({ validation: value })
      },
    },
    {
      id: "fieldOptions",
      value: maybeObject(fieldOptions),
      error: "",
      validate(value) {
        const validator = cmsColumnDialogValidator.pick({ fieldOptions: true })
        return validate(validator)({ fieldOptions: value })
      },
    },
    {
      id: "index",
      value: {
        direction: !index || maybeBoolean(index?.direction === "asc"),
        nulls: maybeBoolean(index?.nulls === "first"),
      },
      error: "",
      validate(value) {
        const validator = cmsColumnDialogValidator.pick({ index: true })
        return validate(validator)({ index: value })
      },
    },
    {
      id: "indexing",
      value: !isEmpty(index),
      error: "",
    },
    {
      id: "sortBy",
      value: !sortBy || maybeBoolean(sortBy === "asc"),
      error: "",
      validate: (value) => {
        const validator = cmsColumnDialogValidator.pick({ sortBy: true })
        return validate(validator)({ sortBy: value })
      },
    },
  ] as const

  return <FormProvider value={formValue}>{children}</FormProvider>
}

export interface ColumnDialogProps {
  children?: React.ReactNode
  fieldId?: string
  isEdit?: boolean
  isOpen: boolean
  step?: Step
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function ColumnDialog({
  fieldId,
  step: initialStep = 0,
  ...props
}: ColumnDialogProps) {
  const { state } = useCmsStore()
  const [step, setStep] = React.useState<Step>(initialStep)

  const column = state.columns.get<"fieldId">(fieldId as "fieldId")

  React.useEffect(() => {
    setStep(initialStep)
  }, [initialStep])

  return (
    <ColumnProvider
      {...column}
      fieldOptions={column?.fieldOptions || {}}
      validation={column?.validation || {}}
    >
      <ColumnDialogSheet
        {...props}
        columnId={column?.id}
        step={step}
        setStep={setStep}
      />
    </ColumnProvider>
  )
}

export interface ColumnDialogSheetProps {
  children?: React.ReactNode
  isEdit?: boolean
  isOpen: boolean
  step?: Step
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setStep: React.Dispatch<React.SetStateAction<Step>>
  columnId?: number
}

function ColumnDialogSheet({
  children,
  isEdit,
  isOpen,
  step = 0,
  setStep,
  setIsOpen,
  columnId,
}: ColumnDialogSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={() => setStep(0)}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className='w-80%' description='Edit column dialog'>
        <SheetHeader className='px-6'>
          <SheetTitle className='h-10 flex items-center '>
            {step ? <>Edit Column</> : <>Choose Column Type</>}
          </SheetTitle>
        </SheetHeader>

        <div className='relative h-[calc(100vh-144px)] mb-6 overflow-y-auto px-6'>
          {step ? (
            <EditColumnContent setStep={setStep} step={step} isEdit={isEdit} />
          ) : (
            <AddColumnContent setStep={setStep} step={step} />
          )}
        </div>

        <SubmitForm
          isEdit={isEdit}
          id={columnId}
          step={step}
          setStep={setStep}
          onClose={() => {
            setIsOpen(false)
          }}
          setIsOpen={setIsOpen}
        />
      </SheetContent>
    </Sheet>
  )
}

function SubmitForm({
  id,
  isEdit,
  step,
  setStep,
  setIsOpen,
  onClose,
}: {
  id?: number
  isEdit?: boolean
  step: Step
  setStep: React.Dispatch<React.SetStateAction<Step>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onClose: () => void
}) {
  const { state, updateColumn } = useCmsStore()
  const columnOrder =
    state.documentsCollection.get<"columnOrder">("columnOrder")

  const form = useFormContext()
  const typeField = form.get("type")
  const columnNameField = form.get("columnName")
  const fieldIdField = form.get("fieldId")
  const helpField = form.get("help")
  const validationField = form.get("validation")
  const fieldOptionsField = form.get("fieldOptions")
  const indexField = form.get("index")
  const indexingField = form.get("indexing")
  const sortByField = form.get("sortBy")

  const handleOnSubmit = async () => {
    const index = indexingField.value
      ? {
          index: {
            direction: indexField.value.direction ? "asc" : "desc",
            nulls: indexField.value.nulls ? "first" : "last",
          } as CmsColumnDialog["index"],
        }
      : {}

    const values: Omit<CmsColumnDialog, "collectionId"> & {
      id?: number
    } = {
      columnName: columnNameField.value,
      type: typeField.value,
      fieldId: fieldIdField.value,
      help: helpField.value,
      sortBy: sortByField.value ? "asc" : "desc",
      ...index,
      ...(!isEmpty(validationField.value)
        ? { validation: validationField.value }
        : {}),
      ...(!isEmpty(fieldOptionsField.value)
        ? { fieldOptions: fieldOptionsField.value }
        : {}),
    }

    if (!isEdit && (columnOrder || []).includes(fieldIdField.value)) {
      fieldIdField.updateError("Column already exists.")

      return
    }

    const errors = validate(cmsColumnDialogValidator)(values)

    if (isError(errors)) {
      for (const [key, error] of Object.entries(
        (errors as CustomError).issues
      )) {
        switch (key) {
          case "columnName":
            columnNameField.updateError(error as string)
            break
          case "type":
            typeField.updateError(error as string)
            break
          case "fieldId":
            fieldIdField.updateError(error as string)
            break
          case "help":
            indexField.updateError(error as string)
            break
          case "index":
            indexField.updateError(error as string)
            break
        }
      }

      return
    }

    const result = await updateColumn({ id, values })

    if (result) {
      setIsOpen(false)
      setStep(0)
      form.reset()
    }
  }

  return (
    <SheetFooter className='px-4'>
      {step ? (
        <div className='flex gap-4'>
          <Button
            variant='outline'
            onClick={() => {
              onClose?.()
            }}
            className='rounded-md'
          >
            Cancel
          </Button>
          <Button onClick={handleOnSubmit} className='rounded-md'>
            Save
          </Button>
        </div>
      ) : (
        <Button
          variant='outline'
          className='rounded-md'
          onClick={() => onClose?.()}
        >
          Cancel
        </Button>
      )}
    </SheetFooter>
  )
}

function AddColumnContent({
  className,
  setStep,
  step,
  ...props
}: {
  step: Step
  setStep: React.Dispatch<React.SetStateAction<Step>>
} & React.HTMLAttributes<HTMLDivElement>) {
  const { field } = useCmsStore()

  const form = useFormContext()
  const { value, updateValue } = form.get("type")

  const handleOnClick = (type: string) => () => {
    updateValue(type)
    setStep(1)
  }

  return (
    <div
      className={cn(
        "w-full my-4 space-y-4 ease-linear overflow-y-auto",
        className
      )}
      {...props}
    >
      {Object.values(field.config).map(({ type, title, description }) => {
        if (type === "title" || type === "info" || type === "infoDate")
          return null

        const FieldIcon = field.icon[type]

        const isActive = value === type

        return (
          <div key={type} className='relative'>
            <Card
              className={cn(
                "h-28 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer",
                isActive && "border-accent bg-accent text-accent-foreground"
              )}
              onClick={handleOnClick(type)}
            >
              <CardHeader className='p-3 space-y-4'>
                <CardTitle className='flex items-start'>
                  <FieldIcon className='p-0 h-4 mr-1' type={type} />
                  {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
            {isActive && (
              <CheckCircle2Icon className='absolute top-[0.75rem] right-[0.75rem] text-accent-foreground rounded-full bg-accent' />
            )}
          </div>
        )
      })}
    </div>
  )
}

function EditColumnContent({
  className,
  isEdit,
  setStep,
  step,
  ...props
}: {
  isEdit?: boolean
  setStep: React.Dispatch<React.SetStateAction<Step>>
  step: Step
} & React.HTMLAttributes<HTMLDivElement>) {
  const form = useFormContext()
  const validationField = form.get("validation")
  const fieldOptionsField = form.get("fieldOptions")
  const indexingField = form.get("indexing")
  const typeField = form.get("type")
  const columnNameField = form.get("columnName")
  const fieldIdField = form.get("fieldId")
  const indexField = form.get("index")
  const sortByField = form.get("sortBy")

  const type = typeField.value

  const { field } = useCmsStore()

  const config = field.config[type || "text"]
  const Validation = field.validation[type]
  const Options = field.options[type]

  if (!config) {
    throw new Error(`${type} is missing in config`)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: load field options and validation configuration into form
  React.useEffect(() => {
    form.update("fieldOptions", {
      value: {
        ...config.optionsDefaults,
        ...fieldOptionsField.value,
      },
    })
    form.update("validation", {
      value: {
        ...config.validationDefaults,
        ...validationField.value,
      },
    })
  }, [])

  return (
    <div
      className={cn("w-full my-4 space-y-4 ease-linear", className)}
      {...props}
    >
      <p
        className={cn(
          "px-2 py-1 rounded-md hidden",
          (columnNameField.error || fieldIdField.error) &&
            "block bg-destructive text-destructive-foreground"
        )}
      >
        Form contains errors
      </p>
      {type === "info" || type === "infoDate" ? (
        <SettingsTab setStep={setStep} isEdit={isEdit} />
      ) : (
        <Tabs defaultValue='setting' className='w-full'>
          <TabsList className='flex  mb-5'>
            <TabsTrigger
              value='setting'
              title='Field setting'
              className={
                (columnNameField.error || fieldIdField.error) &&
                "flex-1 bg-destructive text-destructive-foreground"
              }
            >
              Setting
            </TabsTrigger>

            <Maybe check={Boolean(Validation)}>
              <TabsTrigger
                value='validation'
                title='Field validation'
                className='flex-1'
              >
                Validation
              </TabsTrigger>
            </Maybe>

            <Maybe check={Boolean(Options)}>
              <TabsTrigger
                value='fieldOptions'
                title='Field fieldOptions'
                className='flex-1'
              >
                Options
              </TabsTrigger>
            </Maybe>
          </TabsList>

          <TabsContent value='setting' className='space-y-6'>
            <SettingsTab setStep={setStep} isEdit={isEdit} />
          </TabsContent>

          <Maybe check={Boolean(Validation)}>
            <TabsContent
              value='validation'
              className='space-y-6  overflow-y-auto'
            >
              <Validation
                type={type}
                value={validationField.value}
                onUpdate={validationField.updateValue}
              />
            </TabsContent>
          </Maybe>

          <Maybe check={Boolean(Options)}>
            <TabsContent value='fieldOptions' className='space-y-6'>
              <Options
                type={type}
                fieldId={fieldIdField.value}
                value={fieldOptionsField.value}
                onUpdate={fieldOptionsField.updateValue}
              />

              <Accordion type='single' collapsible>
                <AccordionItem value='advanced-options'>
                  <AccordionTrigger>Advanced Options</AccordionTrigger>
                  <AccordionContent className='space-y-6'>
                    <div>
                      <Label htmlFor='sort-by' className='mb-1 flex'>
                        Sort Direction
                      </Label>
                      <ToggleSwitch
                        title='sort-by'
                        id='indexing'
                        onOff='ASC,DESC'
                        checked={sortByField.value}
                        onCheckedChange={() =>
                          sortByField.updateValue(!sortByField.value)
                        }
                        className='w-[11rem]'
                      />
                    </div>

                    <fieldset className='space-y-6'>
                      <div>
                        <Label htmlFor='indexing' className='mb-1 flex'>
                          Indexing
                        </Label>
                        <ToggleSwitch
                          title='Indexing'
                          id='indexing'
                          checked={indexingField.value}
                          onCheckedChange={() =>
                            indexingField.updateValue(!indexingField.value)
                          }
                          className='w-[11rem]'
                        />
                      </div>

                      <div className='grid grid-cols-2 gap-2'>
                        <div>
                          <Label
                            htmlFor='index-direction'
                            className='mb-1 flex'
                          >
                            Index Sorting
                          </Label>

                          <ToggleSwitch
                            title='Index Sorting'
                            id='index-direction'
                            onOff='ASC,DESC'
                            className='w-[11rem]'
                            checked={indexField.value?.direction}
                            onCheckedChange={() =>
                              indexField.updateValue({
                                ...indexField.value,
                                direction: !indexField.value.direction,
                              })
                            }
                            disabled={!indexingField.value}
                          />
                        </div>
                        <div>
                          <Label htmlFor='index-nulls' className='mb-1 flex'>
                            Empty cells
                          </Label>
                          <ToggleSwitch
                            title='Empty cells'
                            id='index-nulls'
                            onOff='First,Last'
                            className='w-[11rem]'
                            checked={indexField.value?.nulls}
                            onCheckedChange={() =>
                              indexField.updateValue({
                                ...indexField.value,
                                nulls: !indexField.value.nulls,
                              })
                            }
                            disabled={!indexingField.value}
                          />
                        </div>
                      </div>
                    </fieldset>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Maybe>
        </Tabs>
      )}
    </div>
  )
}

function SettingsTab({
  isEdit,
  setStep,
}: {
  isEdit?: boolean
  setStep: React.Dispatch<React.SetStateAction<Step>>
}) {
  const { state, field } = useCmsStore()
  const columnOrder =
    state.documentsCollection.get<"columnOrder">("columnOrder") || []

  const form = useFormContext()
  const columnNameField = form.get("columnName")
  const typeField = form.get("type")
  const fieldIdField = form.get("fieldId")
  const helpField = form.get("help")

  const fieldId = isEdit
    ? {
        defaultValue: fieldIdField.value,
        disabled: true,
      }
    : {
        value: fieldIdField.value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.currentTarget.value

          fieldIdField.updateValue(newValue)
        },
        onBlur: (e: React.MouseEvent<HTMLInputElement>) => {
          if (columnOrder.includes(e.currentTarget.value)) {
            fieldIdField.updateError("Column already exists.")
          }

          const error = fieldIdField.validate?.(
            e.currentTarget.value,
            form.data()
          )

          if (isError(error)) {
            fieldIdField.updateError((error as CustomError)?.issues.fieldId)
            return
          }
        },
      }

  const FieldIcon = field.icon[typeField.value]

  return (
    <div className='space-y-6'>
      <div>
        <Label htmlFor='type' className='mb-1'>
          Column Type
        </Label>
        <div className='relative flex items-center gap-2'>
          <FieldIcon className='absolute pointer-events-none h-3 w-3 ml-4 text-muted-foreground' />
          <Input
            className={cn(
              "pl-8 text-muted-foreground w-30 flex-1",
              typeField.error && "border-destructive"
            )}
            id='type'
            defaultValue={typeField.value}
            disabled
          />

          {typeField.value !== "title" ||
            ((typeField.value !== "info" || typeField.value !== "infoDate") && (
              <Button
                variant='outline'
                className='px-2 w-80 text-sm rounded-md'
                title='Change content type'
                onClick={() => setStep?.(0)}
              >
                <RefreshCcw className='h-4 mr-1' /> Type
              </Button>
            ))}
        </div>

        {typeField.error ? (
          <p className='text-destructive text-sm mt-2'>{typeField.error}</p>
        ) : null}
      </div>

      <div>
        <Label htmlFor='fieldId' className='mb-1' required>
          Column ID
        </Label>
        <Input
          required
          id='fieldId'
          className={cn(fieldIdField.error && "border-destructive")}
          {...fieldId}
        />

        {fieldIdField.error ? (
          <p className='text-destructive text-sm mt-2'>{fieldIdField.error}</p>
        ) : null}
      </div>

      <div>
        <Label htmlFor='columnName' className='mb-1' required>
          Column Name
        </Label>
        <Input
          required
          id='columnName'
          className={cn(columnNameField.error && "border-destructive")}
          value={columnNameField.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            columnNameField.updateValue(e.target.value)
          }}
          onBlur={(e: React.MouseEvent<HTMLInputElement>) => {
            const error = columnNameField.validate?.(
              e.currentTarget.value,
              form.data()
            )
            if (isError(error)) {
              columnNameField.updateError(
                (error as CustomError)?.issues.columnName
              )
            }
          }}
        />

        {columnNameField.error ? (
          <p className='text-destructive text-sm mt-2'>
            {columnNameField.error}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor='help' className='mb-1'>
          Help text
          <span className='ml-1 text-muted-foreground'>(optional)</span>
        </Label>
        <Input
          required
          id='help'
          value={helpField.value}
          className={cn(helpField.error && "border-destructive")}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            helpField.updateValue(e.target.value)
          }}
        />
        {helpField.error ? (
          <p className='text-destructive text-sm mt-2'>{helpField.error}</p>
        ) : null}
      </div>
    </div>
  )
}
