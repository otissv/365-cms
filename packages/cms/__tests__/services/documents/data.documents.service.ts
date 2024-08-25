import { faker } from "@faker-js/faker"
import {
  fakeDocumentData,
  type CmsCollectionDocumentData,
} from "../../__helpers___/data.helpers"

export const documentsServiceGet: CmsCollectionDocumentData[] =
  faker.helpers.multiple(fakeDocumentData as any, {
    count: 12,
  })

export const documentsServiceRemoveData: CmsCollectionDocumentData[] =
  faker.helpers.multiple(fakeDocumentData as any, {
    count: 3,
  })

export const documentsServiceUpdateData: CmsCollectionDocumentData[] =
  faker.helpers.multiple(fakeDocumentData as any, {
    count: 2,
  })
