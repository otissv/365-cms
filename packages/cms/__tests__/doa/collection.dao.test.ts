import cmsCollectionsDao from "../../src/dao/collection.dao"
import {
  COLLECTION_DATA_DEFAULTS,
  COLLECTION_COLUMNS,
  COLLECTION_SCHEMA,
} from "./collection.dao.helpers"

jest.mock("server-only", () => undefined)

async function removeCollection(name: string) {
  const result = await cmsCollectionsDao(COLLECTION_SCHEMA).remove({
    columns: ["name"],
    where: ["cms_collections.name", "=", name],
  })

  expect(result).toEqual({
    data: [{ name }],
    error: "",
  })
}

test("Insert default collection", async () => {
  const result = await cmsCollectionsDao(COLLECTION_SCHEMA).insert({
    data: COLLECTION_DATA_DEFAULTS,
    userId: COLLECTION_DATA_DEFAULTS.userId,
    columns: COLLECTION_COLUMNS,
  })

  expect(result).toEqual({
    data: [
      {
        ...COLLECTION_DATA_DEFAULTS,
        roles: null,
        isPublished: false,
      },
    ],
    error: "",
  })

  await removeCollection(COLLECTION_DATA_DEFAULTS.name)
})

test("Insert collection with all fields", async () => {
  const data = {
    ...COLLECTION_DATA_DEFAULTS,
    roles: ["ADMIN"],
    isPublished: true,
  }

  const result = await cmsCollectionsDao(COLLECTION_SCHEMA).insert({
    data,
    userId: COLLECTION_DATA_DEFAULTS.userId,
    columns: COLLECTION_COLUMNS,
  })

  expect(result).toEqual({
    data: [data],
    error: "",
  })

  await removeCollection(COLLECTION_DATA_DEFAULTS.name)
})

test("Can not insert duplicate collection name", async () => {
  const data = {
    name: "testInsert",
    userId: 1,
    type: "multiple" as "single" | "multiple",
  }

  await cmsCollectionsDao(COLLECTION_SCHEMA).insert({
    data,
    userId: data.userId,
    columns: ["name", "userId", "type"],
  })

  const result = await cmsCollectionsDao(COLLECTION_SCHEMA).insert({
    data,
    userId: data.userId,
    columns: ["name", "userId", "type"],
  })

  expect(result).toEqual({
    data: [],
    error: "Duplicate, already exists",
  })

  await removeCollection(data.name)
})
