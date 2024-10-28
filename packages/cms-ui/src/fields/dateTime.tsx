"use client"

import React from "react"
import { z } from "zod"
import { CalendarIcon, TriangleAlert } from "lucide-react"
import { format, isWithinInterval, parseISO } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@repo/ui/cn"
import { Calendar } from "@repo/ui/calendar"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { ToggleSwitch } from "@repo/ui/toggle-switch"
import { isFieldRequired } from "@repo/lib/isFieldRequired"
import type {
  CmsCollectionColumn,
  CmsConfigField,
  CmsField,
} from "@repo/cms/types.cms"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip"
import { toInt } from "@repo/lib/toInt"
import { isNullOrUndefined } from "@repo/lib/isNullOrUndefined"

import { DateTimeValidation } from "../validation.cms"

type Option = {
  value: {
    defaultValue?: string
    isRange?: boolean
    numberOfMonths?: number
    showTime?: boolean
    excludeDates?: string[]
  }
}

export type FieldOptionsProps = {
  fieldId: string
  onUpdate: (
    newValue: NonNullable<CmsCollectionColumn["fieldOptions"]>,
    errorMessage?: "string"
  ) => void
} & Option
export type FieldProps = CmsField<HTMLTextAreaElement, Date | DateRange> & {
  id: string
  value: { from: string; to: string }
}

const validationValidator = z
  .object({
    required: z.boolean().optional(),
    betweenDates: z
      .object({
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
      .optional(),
  })
  .optional()
export type ParagraphFieldValidation = z.infer<typeof validationValidator>

const FieldValidation = DateTimeValidation

const fieldConfig: CmsConfigField<
  Date | DateRange,
  ParagraphFieldValidation,
  Option
> = {
  initialState: "",
  title: "DateTime",
  Icon: ({ className, ...props }: Record<string, any>) => (
    <CalendarIcon
      className={cn("h-3 text-muted-foreground", className)}
      {...props}
    />
  ),
  type: "dateTime",
  description: "Data of event, date added",
  validationDefaults: {
    required: false,
    betweenDates: { from: "", to: "" },
  },
  validate: ({ value, validation, columnName, options }) => {
    const { required, betweenDates } = validation || {}

    const isRange = options?.isRange

    function isDateInRange(startDate: Date, endDate: Date) {
      return (dateToCheck: unknown) => {
        if (!(dateToCheck instanceof Date)) {
        }
        return isWithinInterval(dateToCheck as Date, {
          start: startDate,
          end: endDate,
        })
      }
    }

    if (isRange) {
      console.log("range: ", { value, options })
      switch (true) {
        case isFieldRequired(value, required):
          return {
            value,
            error: `${columnName} field is required`,
          }

        default:
          return {
            value,
            error: "",
          }
      }
    }
    const betweenDatesFrom = (betweenDates?.from || value) as Date
    const betweenDatesTo = (betweenDates?.to || value) as Date

    console.log("single: ", { value, options, validation })
    switch (true) {
      case isFieldRequired(value, required):
        return {
          value,
          error: `${columnName} field is required`,
        }

      case !isDateInRange(betweenDatesFrom, betweenDatesTo)(value):
        return {
          value,
          error: `Date must be between ${format(betweenDatesFrom as Date, "PPP")} and ${format(betweenDatesTo as Date, "PPP")}`,
        }

      default:
        return {
          value,
          error: "",
        }
    }
  },
}

function Field({
  id,
  value = {},
  onBlur,
  fieldId,
  onUpdate,
  errorMessage,
  validate,
  validation,
  isInline,
  type,
  field,
  columnName,
  options,
}: FieldProps): JSX.Element {
  const [state, setState] = React.useState<Date | DateRange>()
  const [startTime, setStartTime] = React.useState("")
  const [label, setLabel] = React.useState<React.ReactNode>(
    <span>Pick a date</span>
  )
  const isRange = !!options?.isRange
  const mode = isRange ? "range" : "single"
  const showTime = !!options?.showTime

  // console.log(options)

  // biome-ignore lint/correctness/useExhaustiveDependencies: run on mount only
  React.useEffect(() => {
    if (isRange) {
      setState({
        from: value.from ? parseISO(value.from) : undefined,
        to: value.to ? parseISO(value.to) : undefined,
      } as DateRange)
    } else {
      setState(value.from ? parseISO(value.from) : undefined)
    }
    setStartTime(
      value.from && value.from !== "" ? format(value.from, "HH:mm") : "00:00"
    )
  }, [])

  React.useEffect(() => {
    if (isRange) {
      const date = state as DateRange

      if (!date?.from && !date?.to) {
        setLabel(<span>Pick a dates</span>)
        return
      }

      const fromDate = format(date?.from as any, "PPP")
      const toDate = date?.to ? format(date?.to as any, "PPP") : "Pick a date"

      const newLabel = (
        <>
          {fromDate}{" "}
          <span className='inline-flex mx-1 text-muted-full'>&mdash;</span>{" "}
          {toDate}
        </>
      )

      setLabel(newLabel)
    } else {
      setLabel(state ? format(state as Date, "PPP") : <span>Pick a date</span>)
    }
  }, [isRange, state])

  const handleOnUpdate = () => {
    const { error } = validate?.({
      value: state,
      validation,
      columnName,
      options,
    }) || {
      error: "",
    }

    if (!state) {
      onUpdate?.({ from: "", to: "" }, error)
      return
    }

    let newDateValue = {}
    if (state instanceof Date) {
      const date = new Date(state)
      const [hours, minutes] = startTime.split(":")
      date.setHours(Number(hours))
      date.setMinutes(Number(minutes))

      newDateValue = {
        from: date.toISOString(),
        to: "",
      }
    } else {
      const from = new Date(state.from as Date)
      const [hours, minutes] = startTime.split(":")
      from.setHours(Number(hours))
      from.setMinutes(Number(minutes))

      newDateValue = {
        from: from?.toISOString() || "",
        to: state?.to?.toISOString() || "",
      }
    }

    onUpdate?.(newDateValue, error)
  }

  const handleOnDateChange = (dateRange?: Date | DateRange) => {
    setState(dateRange)

    if (dateRange instanceof Date) {
      setLabel(
        dateRange ? format(dateRange as Date, "PPP") : <span>Pick a date</span>
      )
    } else {
      setLabel(
        dateRange?.from ? (
          format(dateRange.from, "PPP")
        ) : (
          <span>Pick a date</span>
        )
      )
    }
  }

  return (
    <Popover onOpenChange={(open) => !open && handleOnUpdate()}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex min-w-48 justify-start text-left font-normal rounded-md border cursor-pointer",
            !state && "text-muted-foreground",
            isInline && "rounded-none border-y-0"
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {label}
          {errorMessage ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <TriangleAlert className='mr-2 size-5 text-destructive' />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{errorMessage}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
      </PopoverTrigger>
      <PopoverContent className='relative w-auto p-0'>
        <Calendar
          id={`${fieldId}-date`}
          mode={mode}
          selected={state as any}
          onSelect={handleOnDateChange}
          numberOfMonths={(isRange && options?.numberOfMonths) || 1}
          initialFocus
          disabled={(day) =>
            (options?.excludeDates || []).includes(day.toISOString())
          }
        />

        {showTime ? (
          <div className='flex items-center justify-center border-t py-1 px-6'>
            <Label htmlFor={`${fieldId}-startTime`}>Time </Label>
            <Input
              id={`${fieldId}-startTime`}
              type='time'
              className='p-0 border-0 ml-3 w-auto'
              value={startTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStartTime(e.target.value)
              }
            />
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

function FieldOptions({
  value = {},
  onUpdate,
  fieldId,
}: FieldOptionsProps): JSX.Element {
  const defaultValue = value.defaultValue || {}
  const excludeDates = value.excludeDates || []
  const isRange = value.isRange || false
  const numberOfMonths = value.numberOfMonths || 2
  const showTime = value.showTime || false

  const handleOnUpdate =
    (
      key:
        | "defaultValue"
        | "isRange"
        | "showTime"
        | "numberOfMonths"
        | "excludeDates"
    ) =>
    (value: unknown) => {
      onUpdate?.({
        defaultValue,
        excludeDates,
        isRange,
        numberOfMonths:
          isRange && isNullOrUndefined(numberOfMonths)
            ? 2
            : toInt(1)(numberOfMonths),
        showTime,
        [key]: value,
      })
    }

  return (
    <>
      <div className='mb-6'>
        <Label htmlFor={`${fieldId}-range`} className='flex mb-2'>
          Date Type
        </Label>

        <ToggleSwitch
          title='Cache response'
          className='w-[160px]'
          checked={isRange}
          id={`${fieldId}-range`}
          onOff={"Range,Single"}
          onCheckedChange={handleOnUpdate("isRange")}
        />
      </div>

      <div className='mb-6'>
        <Label htmlFor={`${fieldId}-defaultValue`} className='flex mb-2'>
          Default Value
        </Label>

        <Field
          id={`${fieldId}-defaultValue`}
          fieldId={fieldId}
          value={defaultValue}
          onUpdate={handleOnUpdate("defaultValue")}
        />
      </div>

      <div className='mb-6'>
        <Label htmlFor={`${fieldId}-number-of-months`} className='flex mb-2'>
          Number of Months
        </Label>

        <Input
          id={`${fieldId}-number-of-months`}
          type='number'
          value={numberOfMonths}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleOnUpdate("numberOfMonths")(e.target.value)
          }
          min='1'
          disabled={!isRange}
        />
      </div>

      <div className='mb-6'>
        <Label htmlFor='defaultValue' className='flex mb-2'>
          Format Date (in CMS only)
        </Label>
      </div>

      <div className='mb-6'>
        <Label>Exclude Dates</Label>
        <Calendar
          mode='multiple'
          selected={excludeDates.map((d) => new Date(d))}
          onSelect={handleOnUpdate("excludeDates")}
          initialFocus
        />
      </div>

      <div className='mb-6'>
        <Label htmlFor={`${fieldId}-showTime`} className='flex mb-2'>
          Show Time
        </Label>

        <ToggleSwitch
          title='Cache response'
          className='w-[160px]'
          checked={showTime}
          id={`${fieldId}-showTime`}
          onOff={"Yes,No"}
          onCheckedChange={handleOnUpdate("showTime")}
        />
      </div>
    </>
  )
}

export const ParagraphField = {
  fieldConfig,
  Field,
  FieldOptions,
  FieldValidation,
  validationValidator,
}

export default ParagraphField
