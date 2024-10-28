import { notFound } from "next/navigation"

import type { CmsDocumentsView, SearchParams } from "@repo/cms/types.cms"

import { getDocumentsAction } from "@repo/cms/actions/document.actions"

import { isEmpty } from "@repo/lib/isEmpty"
import { PageHeader } from "@repo/ui/page/page-header"
import Documents from "@repo/cms-ui/documents/documents"
import type { FieldConfig } from "@repo/cms-ui/store.cms"

import { Collections } from "@/routes"

import TextField from "@repo/cms-ui/fields/text"
import BooleanField from "@repo/cms-ui/fields/boolean"
import NumberField from "@repo/cms-ui/fields/number"
import EmailField from "@repo/cms-ui/fields/email"
import ParagraphField from "@repo/cms-ui/fields/paragraph"
import PrivateNumberField from "@repo/cms-ui/fields/private-number"
import PrivateTextField from "@repo/cms-ui/fields/private-text"
import UrlField from "@repo/cms-ui/fields/url"
import DateTimeField from "@repo/cms-ui/fields/dateTime"

export default async function CollectionPage(
  props: {
    params: Promise<{ collectionName: string }>
    searchParams: Promise<SearchParams>
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const schema = "t_1"

  const { collectionName } = params

  if (isEmpty(collectionName)) {
    notFound()
  }

  const { data, totalPages } = await getDocumentsAction({ schema })({
    searchParams,
    collectionName,
  })

  if (isEmpty(data)) {
    notFound()
  }

  return (
    <>
      <PageHeader
        heading={`${collectionName}`}
        breadcrumbs={[
          { label: "Collections", crumb: `/${Collections.getPathname()}` },
          { label: `${collectionName} collection` },
        ]}
      />
      <Documents
        collection={data as CmsDocumentsView}
        collectionName={collectionName}
        searchParams={searchParams}
        totalPages={totalPages}
        fields={
          [
            DateTimeField,
            TextField,
            BooleanField,
            NumberField,
            EmailField,
            ParagraphField,
            PrivateNumberField,
            PrivateTextField,
            UrlField,
          ] as FieldConfig[]
        }
      />
    </>
  )
}
