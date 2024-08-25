import { faker } from "@faker-js/faker"
import {
  fakeCollectionData,
  type CmsCollectionData,
} from "../../__helpers___/data.helpers"

export const collectionServiceGetData: CmsCollectionData[] =
  faker.helpers.multiple(fakeCollectionData as any, {
    count: 12,
  })

export const collectionServiceRemoveData: CmsCollectionData[] =
  faker.helpers.multiple(fakeCollectionData as any, {
    count: 2,
  })

export const collectionServiceUpdateData: CmsCollectionData[] =
  faker.helpers.multiple(fakeCollectionData as any, {
    count: 2,
  })
