"use client"

import React from "react"
import type { CmsCollection, SearchParams } from "@repo/cms/types.cms"
import { toast } from "sonner"
import { Download } from "lucide-react"

import { cn } from "@repo/ui/cn"
import { Pagination } from "@repo/ui/page/pagination"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@repo/ui/dropdown-menu"
import {
  exportToCsv,
  exportToExcel,
  exportToJson,
} from "@repo/ui/download-file"
import { Button } from "@repo/ui/button"

import {
  AddNewCollectionDialog,
  AddNewCollectionDialogProvider,
} from "./new-collection.collections"
import { ToggleLayout } from "../ui/toggle-layout"
import { CmsButton, CmsToolbar } from "../ui/cms-button"
import { searchParamsWithDefaults } from "../searchParamsWithDefaults.cms"
import { useCmsStore } from "../store.cms"
import {
  CollectionCardRenameFormProvider,
  CollectionCard,
} from "./card.collection"

export interface CollectionsProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  searchParams: SearchParams
  route: string
  totalPages?: number
  collections: CmsCollection[]
}

export default function Collections({
  className,
  searchParams,
  route,
  collections,
  totalPages = 0,
}: CollectionsProps) {
  const search = searchParamsWithDefaults(searchParams)
  const [isLoaded, setIsLoaded] = React.useState(false)

  const isGridLayout = search.layout === "grid"

  const { state } = useCmsStore()

  // biome-ignore lint/correctness/useExhaustiveDependencies: Adding getCollections function to dependencies creates infinite render loop
  React.useEffect(() => {
    state.collections.replace(collections)
    setIsLoaded(true)
  }, [search.page, search.limit, JSON.stringify(collections)])

  const handleOnExport =
    (type: "csv" | "excel" | "json") =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      const arg = {
        fileName: "collections",
        data: state.collections
          .values()
          .map(
            ({
              id,
              name,
              type,
              createdBy,
              createdAt,
              updatedBy,
              updatedAt,
            }) => ({
              id,
              collection: name,
              type,
              createdBy,
              createdAt,
              updatedBy,
              updatedAt,
            })
          ),
      }

      switch (type) {
        case "csv":
          exportToCsv(arg)
          break
        case "excel":
          exportToExcel(arg)
          break
        case "json":
          exportToJson(arg)
          break
      }
    }

  return isLoaded ? (
    <div className={cn("space-y-4 w-full", className)}>
      <CmsToolbar>
        <AddNewCollectionDialogProvider>
          <AddNewCollectionDialog />
        </AddNewCollectionDialogProvider>
        <ToggleLayout size='sm' searchParams={search} path={route} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CmsButton title='Download file'>
              <Download />
            </CmsButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Button size='sm' onClick={handleOnExport("csv")}>
                CSV
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button size='sm' onClick={handleOnExport("json")}>
                JSON
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button size='sm' onClick={handleOnExport("excel")}>
                Excel
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        sort by Az, Za, Date, owner,
        {/* <Input
          placeholder='Search...'
          // value={}
          onChange={(_event: any) => {}}
          className='w-full min-w-60 max-w-md'
        /> */}
      </CmsToolbar>

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
          <Pagination
            totalPages={totalPages}
            limit={search.limit}
            page={search.page}
          />
        ) : null}
      </div>
    </div>
  ) : null
}
