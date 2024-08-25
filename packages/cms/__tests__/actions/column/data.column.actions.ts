import { faker } from "@faker-js/faker"
import {
  fakeColumnData,
  type CmsCollectionColumnData,
} from "../../__helpers___/data.helpers"

export const onDeleteColumnActionData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 1,
  })

export const onInsertColumnActionData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 1,
  })

export const onSortColumnActionData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 1,
  })

export const onUpdateColumnActionData: CmsCollectionColumnData[] =
  faker.helpers.multiple(fakeColumnData as any, {
    count: 1,
  })
