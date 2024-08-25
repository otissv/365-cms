import { faker } from "@faker-js/faker"
import {
  fakeDocumentData,
  type CmsCollectionDocumentData,
} from "../../__helpers___/data.helpers"

export const getDocumentsActionData: CmsCollectionDocumentData[] =
  faker.helpers.multiple(fakeDocumentData as any, {
    count: 12,
  })

export const onUpdateDataActionData: CmsCollectionDocumentData[] =
  faker.helpers.multiple(fakeDocumentData as any, {
    count: 4,
  })

export const onDeleteRowActionData: CmsCollectionDocumentData[] =
  faker.helpers.multiple(fakeDocumentData as any, {
    count: 2,
  })
