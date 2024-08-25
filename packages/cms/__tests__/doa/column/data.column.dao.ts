import { faker } from "@faker-js/faker"
import {
  fakeColumnData,
  type CmsCollectionColumnData,
} from "../../__helpers___/data.helpers"

export const columnDaoGetByFieldIdData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 2,
  })

export const columnDaoRemoveData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 2,
  })

export const columnDaoUpdateData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 2,
  })
