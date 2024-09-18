import "server-only"

import cmsDocumentsServices from "../services/documents.service"

import type {
  CmsCollectionDocument,
  DocumentInsert,
  DocumentUpdate,
  SearchParams,
} from "../types.cms"
import { isEmpty } from "@repo/lib/isEmpty"

export function getDocumentsAction({
  schema,
}: {
  schema: string
  revalidatePath?: string
}) {
  return async ({
    searchParams,
    collectionName,
  }: {
    collectionName: string
    searchParams?: SearchParams
  }) => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: {},
        error: "getDocumentsAction requires a 'schema' argument",
        totalPages: 0,
      }
    }

    if (isEmpty(collectionName)) {
      return {
        data: {},
        error: "getDocumentsAction requires a 'collectionName' argument",
        totalPages: 0,
      }
    }

    const response = await cmsDocumentsServices(schema).get({
      page: searchParams?.page,
      limit: searchParams?.limit,
      collectionName,
      orderBy: [
        searchParams?.orderBy || "id",
        searchParams?.direction || "asc",
        searchParams?.nulls || "last",
      ],
    })

    return {
      ...response,
      data: response.data[0] || {},
    }
  }
}

export function onDeleteRowAction({ schema }: { schema: string }) {
  return async ({ ids }: { ids: number[] }) => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: [],
        error: "onDeleteRowAction requires a 'schema' prop",
      }
    }

    if (isEmpty(ids)) {
      return {
        data: [],
        error: "onDeleteRowAction requires a 'ids' prop",
      }
    }

    return cmsDocumentsServices(schema).remove({ ids: ids })
  }
}

export function onUpdateDataAction({
  schema,
  userId,
}: { schema: string; userId: number }) {
  return async (
    props: DocumentInsert | DocumentUpdate,

    returning: (keyof CmsCollectionDocument)[] = ["id"]
  ) => {
    "use server"

    if (isEmpty(schema)) {
      return {
        data: [],
        error: "onUpdateDataAction requires an 'schema' prop",
      }
    }

    if (isEmpty(userId)) {
      return {
        data: [],
        error: "onUpdateDataAction requires an 'userId' prop",
      }
    }

    if (isEmpty(props)) {
      return {
        data: [],
        error:
          "onUpdateDataAction requires a props object argument with 'id' and 'data'",
      }
    }

    const { id, ...rest } = props as DocumentUpdate

    if (id) {
      return cmsDocumentsServices(schema).update({
        ...(props as DocumentUpdate),
        returning,
        userId,
      })
    }

    return cmsDocumentsServices(schema).insert({
      data: rest as DocumentInsert,
      returning,
      userId,
    })
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
