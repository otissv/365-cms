import { faker } from "@faker-js/faker"
import {
  fakeDocumentData,
  type CmsCollectionDocumentData,
} from "../../__helpers___/data.helpers"

export const getDocumentsActionData: CmsCollectionDocumentData[] =
  faker.helpers.multiple(fakeDocumentData as any, {
    count: 12,
  })

export const updateDataActionData: CmsCollectionDocumentData[] =
  faker.helpers.multiple(fakeDocumentData as any, {
    count: 4,
  })

export const deleteRowActionData: CmsCollectionDocumentData[] =
  faker.helpers.multiple(fakeDocumentData as any, {
    count: 2,
  })
