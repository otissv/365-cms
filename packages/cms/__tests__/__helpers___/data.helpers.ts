import type {
  CmsCollection,
  CmsCollectionColumn,
  CmsCollectionDocument,
} from "../../src/types.cms"

export type CmsCollectionData = Omit<CmsCollection, "id">
export type CmsCollectionColumnData = Omit<CmsCollectionColumn, "id">
export type CmsCollectionDocumentData = Omit<CmsCollectionDocument, "id">

const userId = 1
export function fakeCollectionData(_?: undefined, id = 1): CmsCollectionData {
  return {
    userId,
    name: `collection_${id}`,
    type: "multiple",
    roles: ["ADMIN"],
    columnOrder: ["col1", "col2"],
    isPublished: false,
    createdAt: new Date(),
    createdBy: userId,
    updatedAt: new Date(),
    updatedBy: userId,
  }
}

export function fakeColumnData(_?: undefined, id = 1): CmsCollectionColumnData {
  return {
    collectionId: 1,
    columnName: `col_${id}`,
    fieldId: `field_${id}`,
    type: "text",
    fieldOptions: { defaultValue: id },
    validation: { required: true },
    help: "Help text",
    enableDelete: false,
    enableSort: false,
    enableHide: false,
    enableFilter: false,
    sortBy: "asc" as any,
    visibility: true,
    index: {
      direction: "asc",
      nulls: "last",
    },
    createdAt: new Date(),
    createdBy: userId,
    updatedAt: new Date(),
    updatedBy: userId,
  } as any
}

export function fakeDocumentData(
  _?: undefined,
  id = 1
): CmsCollectionDocumentData {
  return {
    collectionId: 1,
    data: {
      title: `title_${id}`,
      content: `content_${id}`,
    },
    createdAt: new Date(),
    createdBy: userId,
    updatedAt: new Date(),
    updatedBy: userId,
  }
}
