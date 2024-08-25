import { faker } from "@faker-js/faker"
import {
  fakeCollectionData,
  type CmsCollectionData,
} from "../../__helpers___/data.helpers"

export const collectionDaoGetData: CmsCollectionData[] = faker.helpers.multiple(
  fakeCollectionData as any,
  {
    count: 12,
  }
)

export const collectionDaoRemoveData: CmsCollectionData[] =
  faker.helpers.multiple(fakeCollectionData as any, {
    count: 2,
  })

export const collectionDaoUpdateData: CmsCollectionData[] =
  faker.helpers.multiple(fakeCollectionData as any, {
    count: 2,
  })
