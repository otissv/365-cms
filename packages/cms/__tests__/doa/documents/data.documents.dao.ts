import { faker } from "@faker-js/faker"
import {
  fakeDocumentData,
  type CmsCollectionDocumentData,
} from "../../__helpers___/data.helpers"

export const documentsDaoGet: CmsCollectionDocumentData[] =
  faker.helpers.multiple(fakeDocumentData as any, {
    count: 12,
  })

export const documentsDaoRemoveData: CmsCollectionDocumentData[] =
  faker.helpers.multiple(fakeDocumentData as any, {
    count: 4,
  })

export const documentsDaoUpdateData: CmsCollectionDocumentData[] =
  faker.helpers.multiple(fakeDocumentData as any, {
    count: 2,
  })
