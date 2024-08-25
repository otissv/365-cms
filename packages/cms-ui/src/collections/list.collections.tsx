"use client"

import type * as React from "react"

import { cn } from "@repo/ui/cn"
import { Input } from "@repo/ui/input"
import { Pagination } from "@repo/ui/page/pagination"
import { notify } from "@repo/ui/sonner"
import { type ArrayStoreState, useArrayStore } from "@repo/ui/useCreateStore"

import type {
  CmsCollection,
  CollectionState,
  CollectionsReturnType,
  ToggleLayoutTypes,
} from "@repo/cms/types.cms"

import {
  CollectionCard,
  CollectionCardRenameFormProvider,
} from "./card.collection"
import {
  NewCollectionDialog,
  NewCollectionDialogProvider,
} from "./new-collection.collections"
import {
  CollectionProvider,
  type CollectionProviderProps,
} from "./provider.collections"
import { CmsToolbar } from "../ui/cms-button"
import { ToggleLayout } from "../ui/toggle-layout"

export interface CollectionsListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  cmsPath?: string
  page: number
  limit: number
  layout: ToggleLayoutTypes
  totalPages: number
  data: CmsCollection[] | []
  toast?: typeof notify
  onRenameCollection: CollectionProviderProps["onRename"]
  onDeleteCollection: CollectionProviderProps["onDelete"]
  onNewCollection: CollectionProviderProps["onNew"]
}

export function CollectionsList({
  cmsPath,
  layout,
  data,
  totalPages,
  page,
  limit,
  className,
  toast = notify,
  onRenameCollection,
  onDeleteCollection,
  onNewCollection,
}: CollectionsListProps): React.JSX.Element {
  const isGridLayout: boolean = layout === "grid"

  const rootPath = cmsPath ? `${cmsPath}/` : ""

  const state: ArrayStoreState<CollectionState> =
    useArrayStore<CollectionState>(data as any, "id")

  const handleOnDelete: (
    id: any
  ) => Promise<CollectionsReturnType | undefined> = async (id) => {
    const response = await onDeleteCollection(id)

    if (response?.error) {
      toast("Collection was not deleted. Try again.", { type: "error" })
      return
    }

    state.delete(id)

    return response
  }

  return (
    <CollectionProvider
      onRename={onRenameCollection}
      onDelete={handleOnDelete}
      onNew={onNewCollection}
      cmsPath={rootPath}
      {...state}
    >
      <div className={cn("space-y-4 w-full", className)}>
        <CmsToolbar>
          <NewCollectionDialogProvider>
            <NewCollectionDialog />
          </NewCollectionDialogProvider>
          <ToggleLayout
            layout={layout}
            size='sm'
            searchParams={{
              layout,
              page,
              limit,
            }}
            path={`${rootPath}/collections`}
          />
          sort Az, Za, Date, owner,
          <Input
            placeholder='Search...'
            // value={}
            onChange={(_event: any) => {}}
            className='w-full min-w-60 max-w-md'
          />
        </CmsToolbar>

        <div
          className={cn(
            "transition-all",
            isGridLayout
              ? "grid gap-4 md:grid-cols-2 lg:flex lg:flex-wrap "
              : "grid gap-3"
          )}
        >
          {state.values().map(
            ({
              id,
              name,
              type,

              // TODO: fix
              // documentCount,
            }) => {
              return (
                <CollectionCardRenameFormProvider key={id} name={name}>
                  <CollectionCard
                    name={name}
                    id={id}
                    isGridLayout={isGridLayout}
                    type={type}
                    documentCount={0}
                  />
                </CollectionCardRenameFormProvider>
              )
            }
          )}
        </div>

        {totalPages > 10 ? (
          <Pagination totalPages={totalPages} limit={limit} page={page} />
        ) : null}
      </div>
    </CollectionProvider>
  )
}
