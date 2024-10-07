"use client"

import {
  CollectionCard,
  CollectionCardRenameFormProvider,
} from "./card.collection"
import { Pagination } from "@repo/ui/page/pagination"
import type { SearchParams } from "@repo/cms/types.cms"
import { cn } from "@repo/ui/cn"

import { useCmsStore } from "../store.cms"
import React from "react"
import { toast } from "sonner"

export interface CollectionListProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  isGridLayout: boolean
  page: SearchParams["page"]
  limit: SearchParams["limit"]
}
export function CollectionList({
  isGridLayout,
  page = 1,
  limit = 10,
}: CollectionListProps) {
  const { state, getCollections } = useCmsStore()

  const totalPages = 0

  // biome-ignore lint/correctness/useExhaustiveDependencies: Adding getCollections function to dependencies creates infinite render loop
  React.useEffect(() => {
    ;(async () => {
      const { data, error } = await getCollections({
        page,
        limit,
      })

      if (error) {
        toast(error)
      }

      state.collections.replace(data)
    })()
  }, [page, limit])

  return (
    <div
      className={cn(
        "transition-all",
        isGridLayout
          ? "grid gap-4 md:grid-cols-2 lg:flex lg:flex-wrap "
          : "grid gap-3"
      )}
    >
      {state.collections.values().map(
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

      {totalPages > 10 ? (
        <Pagination totalPages={totalPages} limit={limit} page={page} />
      ) : null}
    </div>
  )
}
