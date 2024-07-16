import type { CmsCollection } from "@repo/cms/cms.types"
import type { ToggleLayoutTypes } from "@repo/cms/components/toggle-layout"
import Collections, {
  onDeleteCollectionAction,
  onNewCollectionAction,
  onRenameCollectionAction,
} from "@repo/cms/ui/collections"
import { PageHeader } from "@repo/ui/page/page-header"
import { Toaster } from "@repo/ui/sonner"

export default function CollectionsPage({
  searchParams,
}: {
  searchParams: { page?: number; limit?: number; layout: ToggleLayoutTypes }
}) {
  const schema = "t_1"

  const userId = 1

  const handleOnRenameCollection = async (
    ...props: [id: number, name: string]
  ) => {
    "use server"

    return onRenameCollectionAction({ schema, userId })(...props)
  }
  const handleOnDeleteCollection = async (id: number) => {
    "use server"
    return onDeleteCollectionAction({ schema })(id)
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
