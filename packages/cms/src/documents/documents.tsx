import { maybeNumber } from "@repo/lib/maybeNumber"
import { decodeSearchParams } from "@repo/lib/querystring"
import type { ToggleLayoutTypes } from "@repo/cms/ui/toggle-layout"

import type {
  AppResponse,
  CmsCollection,
  CmsCollectionColumn,
  CmsCollectionColumnInsert,
  CmsCollectionColumnUpdate,
  CmsCollectionDocument,
  CmsCollectionDocumentInsert,
  CmsCollectionDocumentUpdate,
  CmsDocumentsView,
  SearchParams,
} from "../types.cms"
import cmsCollectionServices from "../services/collection.service"
import cmsCollectionColumnServices from "../services/column.service"
import cmsDocumentsServices from "../services/documents.service"
import { DocumentList } from "./list.documents"
import { DocumentProvider, type FieldConfig } from "./provider.documents"

export async function getDocuments({
  searchParams,
  schema,
  collectionName,
}: {
  collectionName: string
  schema: string
  searchParams: SearchParams
}) {
  "use server"

  const { page, limit, orderBy } = searchParams

  const response = await cmsDocumentsServices(schema).get({
    page,
    limit,
    where: ["cms_collections.name", "=", collectionName],
    orderBy: orderBy,
  })

  return {
    ...response,
    data: response.data[0],
  }
}

export function onDeleteColumnAction({ schema }: { schema: string }) {
  return async (props: {
    fieldId: string
    documentId: number
  }) => {
    "use server"
    return cmsCollectionColumnServices(schema).remove(props)
  }
}

export function onDeleteRowAction({ schema }: { schema: string }) {
  return async (ids: number[]) => {
    "use server"
    return cmsDocumentsServices(schema).remove({ id: ids })
  }
}

export function onInsertColumnAction({ schema }: { schema: string }) {
  return async (
    data: Omit<
      CmsCollectionColumnInsert,
      "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
    >
  ) => {
    "use server"

    return cmsCollectionColumnServices(schema).insert({
      data,
      columns: [
        "id",
        "fieldId",
        "collectionId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
      ],
    })
  }
}

export function onSortColumnAction({
  schema,
  collectionName,
  searchParams,
}: {
  schema: string

  collectionName: string
  searchParams: SearchParams
}) {
  return async (
    id: number,
    data: { sortBy: CmsCollectionColumn["sortBy"] }
  ) => {
    "use server"

    const { error } = await cmsCollectionColumnServices(schema).update({
      id,
      data,
    })

    if (error)
      return {
        data: [],
        error,
        totalPages: 0 as number,
      }

    return getDocuments({ searchParams, schema, collectionName })
  }
}

export function onUpdateColumnAction({ schema }: { schema: string }) {
  return async (id: number, data: CmsCollectionColumnUpdate) => {
    "use server"

    return cmsCollectionColumnServices(schema).update({ id, data })
  }
}

export function onUpdateColumnOrderAction({
  schema,
  userId,
}: { schema: string; userId: number }) {
  return async (
    id: number,
    data: { columnOrder: CmsCollection["columnOrder"] }
  ) => {
    "use server"

    return cmsCollectionServices(schema).update({ id, data, userId })
  }
}

export function onUpdateDataAction({ schema }: { schema: string }) {
  return async (
    props: {
      id?: number
      data: CmsCollectionDocumentUpdate | CmsCollectionDocumentInsert
    },
    columns: string[] = ["id"]
  ) => {
    "use server"

    const { id, ...rest } = props

    if (id) {
      const data = rest as CmsCollectionDocumentUpdate
      return cmsDocumentsServices(schema).update({ id, data, columns })
    }
    const data = rest as CmsCollectionDocumentInsert

    return cmsDocumentsServices(schema).insert({ data, columns })
  }
}

// export function updateFileDataAction({ schema }: { schema: string }) {
//   return async (
//     {
//       id,
//       meta: { fieldId, type, collectionId },
//       ...data
//     }: Record<string, unknown> & {
//       id?: number
//       meta: {
//         collectionId: number
//         fieldId: string
//         type: string
//       }
//     },
//     columns = ["id"]
//   ): Promise<AppResponse<Partial<CmsCollectionDocument>>> => {
//     "use server"

//     if (type === "upload") {
//       if (!collectionId) {
//         return {
//           data: [],
//           error: "Bad Request",
//         }
//       }
//       const columnResult = await cmsColumnServices(
//         schema
//       ).getByCollectionIdAndFieldId({
//         collectionId,
//         fieldId,
//         columns: ["fieldOptions", "validation"],
//       })

//       if (columnResult.error || isEmpty(columnResult.data)) {
//         return {
//           data: [],
//           error: "Bad Request",
//         }
//       }

//       const formData =
//         ((data.data as any)[fieldId as any] as [string, Blob | string][]) || []

//       const acceptedFiles = new Map()
//       let error = ""

//       let fileCount = 1

//       for (const item of formData) {
//         const name = item[0] as string

//         if (!name.startsWith("file:")) continue
//         const nameSplit = name.split(":")

//         // Meta data
//         if (nameSplit[1] === "meta") {
//           let file: Record<string, any>
//           const filename = nameSplit[2]?.replace(" ", "_")

//           try {
//             file = JSON.parse(item[1] as string)

//             file.name = filename
//             const previous = acceptedFiles.get(filename) || {}

//             acceptedFiles.set(filename, Object.assign(previous, file))
//             continue
//           } catch (error) {
//             //TODO: handle error
//             if (isDev) console.error("JSON: ", error)
//             error += `${filename}`
//             continue
//           }
//         }

//         const minItems = columnResult.data[0]?.validation?.minItems || 1
//         const maxItems = columnResult.data[0]?.validation?.maxItems || 1

//         if (fileCount < minItems || fileCount > maxItems) {
//           console.error(fileCount, minItems, maxItems)
//           return {
//             data: [],
//             error: `There should be a minimum of ${minItems} and a maximum of ${maxItems}`,
//           }
//         }
//         fileCount += 1

//         // File data
//         const file = item[1] as Blob
//         const filename = nameSplit[1]?.replace(" ", "_")
//         const ext = file.type.split("/")[1]

//         const accept = columnResult.data[0]?.validation?.accept || []

//         const isValid = accept.includes(`.${ext}`)

//         if (!isValid) {
//           error += `${filename},`
//           continue
//         }

//         const buffer = Buffer.from(await file.arrayBuffer())

//         const filepath = `public/upload/${collectionId}/${filename}`

//         // await mkdir(`public/upload/${collectionId}`, {
//         //   recursive: true,
//         // }).catch((error) => isDev && console.error(error))

//         // await writeFile(path.join(process.cwd(), filepath), buffer)
//         //   .then((res) => {
//         //     const previous = acceptedFiles.get(filename) || {}
//         //     previous.url = filepath
//         //     acceptedFiles.set(filename, previous)
//         //   })
//         //   .catch((error) => {
//         //     if (isDev) console.error(error)
//         //     error += `,${filename},`
//         //   })
//       }

//       // return {
//       //   data: acceptedFiles.values(),
//       //   error,
//       // }
//       // } else {
//       //   if (id) {
//       //     return authorize(cmsDocumentsServices(tenantSchema).update)(
//       //       { id, data, columns },
//       //       revalidatePath
//       //     )
//       //   } else {
//       //     return authorize(cmsDocumentsServices(tenantSchema).insert)(
//       //       { data, columns },
//       //       revalidatePath
//       //     )
//       //   }
//     }
//   }
// }

export default function Documents({
  collection,
  fields,
  collectionName,
  totalPages,
  searchParams,
  onDeleteColumn,
  onDeleteRow,
  onInsertColumn,
  onSortColumn,
  onUpdateColumn,
  onUpdateColumnOrder,
  onUpdateData,
}: {
  collection: CmsDocumentsView
  collectionName: string
  fields: FieldConfig[]
  searchParams: SearchParams & {
    layout: ToggleLayoutTypes
  }
  totalPages: number
  onDeleteColumn: (props: {
    fieldId: string
    documentId: number
  }) => Promise<AppResponse<Partial<CmsCollectionColumn>>>
  onDeleteRow: (
    ids: number[]
  ) => Promise<
    AppResponse<
      Partial<CmsCollectionDocument> | Partial<CmsCollectionDocument>[]
    >
  >
  onInsertColumn: (
    data: Omit<
      CmsCollectionColumnInsert,
      "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
    >
  ) => Promise<AppResponse<Partial<CmsCollectionColumn>>>
  onSortColumn: (
    id: number,
    data: { sortBy: CmsCollectionColumn["sortBy"] }
  ) => Promise<{
    data: CmsDocumentsView
    error: string
    totalPages: number
  }>
  onUpdateColumn: (
    id: number,
    data: CmsCollectionColumnUpdate
  ) => Promise<AppResponse<Partial<CmsCollectionColumn>>>
  onUpdateColumnOrder: (
    id: number,
    data: { columnOrder: CmsCollection["columnOrder"] }
  ) => Promise<AppResponse<Partial<CmsCollection>>>

  onUpdateData: (
    props: {
      id?: number
      data: CmsCollectionDocumentUpdate | CmsCollectionDocumentInsert
    },
    columns?: string[]
  ) => Promise<AppResponse<Partial<CmsCollectionDocument>>>
}) {
  const page = maybeNumber(1)(searchParams.page)
  const limit = maybeNumber(10)(searchParams.limit)
  const layout = searchParams.layout || "grid"
  const orderBy = decodeSearchParams({
    orderBy: searchParams.orderBy || ["createdAt", "desc"],
  }).orderBy

  return (
    <DocumentProvider
      collection={collection}
      onDeleteColumn={onDeleteColumn}
      onDeleteRow={onDeleteRow}
      onInsertColumn={onInsertColumn}
      onSortColumn={onSortColumn}
      onUpdateColumn={onUpdateColumn}
      onUpdateColumnOrder={onUpdateColumnOrder}
      onUpdateData={onUpdateData}
      fields={fields}
    >
      <DocumentList
        collectionName={collectionName}
        layout={layout}
        limit={limit}
        page={page}
        totalPages={totalPages}
      />
    </DocumentProvider>
  )
}
