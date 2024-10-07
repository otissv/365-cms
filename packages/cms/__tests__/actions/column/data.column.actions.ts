import { faker } from "@faker-js/faker"
import {
  fakeColumnData,
  type CmsCollectionColumnData,
} from "../../__helpers___/data.helpers"

export const deleteColumnActionData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 1,
  })

export const insertColumnActionData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 1,
  })

export const sortColumnActionData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 1,
  })

export const updateColumnActionData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 1,
  })
