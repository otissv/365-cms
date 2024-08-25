import { faker } from "@faker-js/faker"
import {
  fakeColumnData,
  type CmsCollectionColumnData,
} from "../../__helpers___/data.helpers"

export const columnServiceGetByFieldIdData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 2,
  })

export const columnServiceRemoveData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 2,
  })

export const columnServiceUpdateData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 2,
  })
