"use client"

import * as React from "react"

import { errorResponse } from "@repo/lib/customError"
import { isEmpty } from "@repo/lib/isEmpty"
import {
  type ArrayStoreState,
  initialArrayStoreState,
} from "@repo/ui/useCreateStore"

import type { CollectionState, CollectionsReturnType } from "../cms.types"

export type CollectionProviderValue = {
  onRename(id: number, name: string): Promise<CollectionsReturnType>
  onDelete: (id: number) => Promise<CollectionsReturnType | undefined>
  onNew: (data: {
    name: string
    type: CollectionState["type"]
  }) => Promise<CollectionsReturnType>
} & ArrayStoreState<CollectionState>

const CollectionContext = React.createContext<CollectionProviderValue>({
  onRename: async () => ({
    data: [],
    error: "",
  }),
  onDelete: async () => ({
    data: [],
    error: "",
  }),
  onNew: async () => ({
    data: [],
    error: "",
  }),
  ...initialArrayStoreState,
})

export function useCollectionContext(): CollectionProviderValue {
  return React.useContext(CollectionContext)
}

export type CollectionProviderProps = {
  children: React.ReactNode
  onRename: (id: number, name: string) => Promise<CollectionsReturnType>
  onDelete: (id: number) => Promise<CollectionsReturnType | undefined>
  onNew: (data: {
    name: string
    type: CollectionState["type"]
  }) => Promise<CollectionsReturnType>
} & ArrayStoreState<CollectionState>

export function CollectionProvider({
  children,
  onRename,
  onDelete,
  onNew,
  ...state
}: CollectionProviderProps): React.JSX.Element {
  const value = {
    ...state,
    async onRename(id: number, name: string): Promise<CollectionsReturnType> {
      try {
        state.update(id, { name })
        const res = await onRename(id, name)
        if (!isEmpty(res.data)) {
          state.update(id, { name })
        }

        return res
      } catch (error) {
        return errorResponse(error)
      }
    },

    onDelete: async (
      id: number
    ): Promise<CollectionsReturnType | undefined> => {
      try {
        return onDelete(id)
      } catch (error) {
        return errorResponse(error)
      }
    },
    onNew: async (data: {
      name: string
      type: CollectionState["type"]
    }): Promise<CollectionsReturnType> => {
      try {
        return onNew(data)
      } catch (error) {
        return errorResponse(error)
      }
    },
  }
  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  )
}
