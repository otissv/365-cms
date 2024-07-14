"use client"

import * as React from "react"

import { CustomError } from "@repo/lib/customError"

export type FormField = {
  id: string
  value: any
  error: string
  validate: (
    data: string,
    state: Map<string, FormField>
  ) => Promise<Record<string, any> | CustomError>
}

export type FormState = {
  data: () => Map<any, FormField>
  clear: () => void
  delete: (id: string) => void
  get: (id: string) => FormField & {
    updateError: (error: string) => void
    updateValue: (value: any) => void
  }
  reset: () => void
  set: (id: string, value: FormField) => void
  values: () => Record<string, any>[]
  update: (id: string, props: Partial<FormField>) => void

  validate: () => Promise<boolean>
}

export const formInitialState: FormState = {
  data: () => new Map(),
  clear: () => undefined,
  delete: (_id) => undefined,
  get: () => ({
    id: "",
    value: "",
    error: "",
    validate: async () => ({}),
    updateError: () => undefined,
    updateValue: () => undefined,
  }),
  reset: () => undefined,
  set: (_id, _data) => undefined,
  values: () => [],
  update: (_id, _data) => undefined,
  validate: () => Promise.resolve(true),
}

export const FormContext = React.createContext<FormState>(formInitialState)

export function useFormContext(): FormState {
  return React.useContext(FormContext)
}

export function useFrom(data: FormField[]): FormState {
  const [state, setState] = React.useState(
    new Map(data.map((item) => [item.id, item]))
  )

  return {
    data: () => state,

    clear: (): void => {
      setState(new Map())
    },

    delete: (id): void => {
      setState((prevMap) => {
        const newMap = new Map(prevMap)
        newMap.delete(id)
        return newMap
      })
    },

    get: (
      id
    ): FormField & {
      updateError: (error: string) => void
      updateValue: (value: any) => void
    } => {
      const item = state.get(id) || formInitialState.get("")

      return {
        ...item,
        updateError: (error: string): void => {
          setState((prevMap) => {
            const item = prevMap.get(id)

            const newItem = {
              ...item,
              error,
            } as FormField

            return new Map(prevMap.set(id, newItem))
          })
        },
        updateValue: (value: string): void => {
          setState((prevMap) => {
            const item = prevMap.get(id)

            const newItem = {
              ...item,
              value,
              error: "",
            } as FormField

            return new Map(prevMap.set(id, newItem))
          })
        },
      }
    },

    reset: (): void => {
      setState(new Map(data.map((item) => [item.id, item])))
    },

    set: (id, data): void => {
      setState((prevMap) => new Map(prevMap.set(id, data)))
    },

    values: () => Array.from(state.values()),

    update: (id, data): void => {
      setState((prevMap) => {
        const item = prevMap.get(id)

        const newItem = {
          ...item,
          ...data,
        } as FormField

        return new Map(prevMap.set(id, newItem))
      })
    },
    validate: async (): Promise<boolean> => {
      try {
        for (const item of Array.from(state.values())) {
          if (item.validate) {
            const error = await item.validate({ [item.id]: item.value }, state)

            if (error instanceof CustomError) {
              for (const [id, value] of error.entries) {
                setState((prevMap) => {
                  const item = prevMap.get(id)

                  const newItem = {
                    ...item,
                    error: value,
                  } as FormField

                  return new Map(prevMap.set(id, newItem))
                })
                return false
              }
            }
          }
        }
      } catch (error) {
        return false
      }

      return true
    },
  }
}

export function FormProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: FormField[]
}): React.JSX.Element {
  const form = useFrom(value)

  return <FormContext.Provider value={form}>{children}</FormContext.Provider>
}
