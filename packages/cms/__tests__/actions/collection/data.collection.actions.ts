import { faker } from "@faker-js/faker"
import {
  fakeCollectionData,
  type CmsCollectionData,
} from "../../__helpers___/data.helpers"

export const onRenameCollectionActionData: CmsCollectionData[] =
  faker.helpers.multiple(fakeCollectionData as any, {
    count: 2,
  })

export const onDeleteCollectionActionData: CmsCollectionData[] =
  faker.helpers.multiple(fakeCollectionData as any, {
    count: 1,
  })

export const onNewCollectionActionData: CmsCollectionData[] =
  faker.helpers.multiple(fakeCollectionData as any, {
    count: 1,
  })

export const onUpdateColumnOrderActionData: CmsCollectionData[] =
  faker.helpers.multiple(fakeCollectionData as any, {
    count: 1,
  })
