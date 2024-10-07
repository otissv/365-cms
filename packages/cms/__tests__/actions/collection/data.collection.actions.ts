import { faker } from "@faker-js/faker"
import {
  fakeCollectionData,
  type CmsCollectionData,
} from "../../__helpers___/data.helpers"

export const renameCollectionActionData: CmsCollectionData[] =
  faker.helpers.multiple(fakeCollectionData as any, {
    count: 2,
  })

export const deleteCollectionActionData: CmsCollectionData[] =
  faker.helpers.multiple(fakeCollectionData as any, {
    count: 1,
  })

export const addNewCollectionActionData: CmsCollectionData[] =
  faker.helpers.multiple(fakeCollectionData as any, {
    count: 1,
  })

export const updateColumnOrderActionData: CmsCollectionData[] =
  faker.helpers.multiple(fakeCollectionData as any, {
    count: 1,
  })
