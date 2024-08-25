import {
  onDeleteCollectionAction,
  onNewCollectionAction,
  onRenameCollectionAction,
} from "@repo/cms/actions/collection.actions"
import type { CmsCollection, ToggleLayoutTypes } from "@repo/cms/types.cms"
import { PageHeader } from "@repo/ui/page/page-header"
import { Toaster } from "@repo/ui/sonner"
import Collections from "@repo/cms-ui/collections/collections"

export default function CollectionsPage({
  searchParams,
}: {
  searchParams: { page?: number; limit?: number; layout: ToggleLayoutTypes }
}) {
  const schema = "t_1"

  const userId = 1

  const handleOnRenameCollection = async (props: {
    id: number
    name: string
  }) => {
    "use server"

    return onRenameCollectionAction({ schema, userId })(props)
  }
  const handleOnDeleteCollection = async (props: { id: number }) => {
    "use server"
    return onDeleteCollectionAction({ schema })(props)
  }
  const handleOnNewCollection = async (data: {
    name: string
    type: CmsCollection["type"]
  }) => {
    "use server"
    return onNewCollectionAction({
      schema,
      userId,
    })(data)
  }

  return (
    <>
      <PageHeader heading='Collections' breadcrumbs={[{ label: "CMS" }]} />

      <Toaster />

      <Collections
        searchParams={searchParams}
        onRenameCollection={handleOnRenameCollection}
        onDeleteCollection={handleOnDeleteCollection}
        onNewCollection={handleOnNewCollection}
      />
    </>
  )
}
