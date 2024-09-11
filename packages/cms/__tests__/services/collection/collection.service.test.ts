import cmsCollectionServices from "../../../src/services/collection.service"
import type {
  CmsCollectionInsert,
  CmsCollectionUpdate,
} from "../../../src/types.cms"

import {
  COLLECTION_SCHEMA_SERVICE_GET,
  COLLECTION_SCHEMA_SERVICE_INSERT,
  COLLECTION_SCHEMA_SERVICE_REMOVE,
  COLLECTION_SCHEMA_SERVICE_UPDATE,
  COLLECTION_SERVICES_DATA_DEFAULTS,
  COLLECTION_SERVICE_COLUMNS,
  cleanUpCmsCollectionsService,
  setUpCmsCollectionsService,
} from "./helpers.collection.services"

jest.mock("server-only", () => undefined)

beforeAll(async () => {
  await setUpCmsCollectionsService()
})

afterAll(async () => {
  await cleanUpCmsCollectionsService()
})

describe("CMS Documents Service", () => {
  test("cmsCollectionServices throws error id no schema", async () => {
    try {
      // @ts-expect-error - testing no schema
      const r = await cmsCollectionServices()
    } catch (error) {
      expect(error).toEqual(
        new Error("Must provide a schema for cmsCollectionService")
      )
    }
  })

  test("Get collections with default", async () => {
    const { data, error } = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_GET
    ).get()

    expect(data.length).toBe(10)
    expect(data[0].id).toBe(1)
    expect(data[9].id).toBe(10)
    expect(error).toBe("")
  })

  test("Gets collections with limit", async () => {
    const { data, error } = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_GET
    ).get({
      limit: 12,
    })
    expect(data.length).toBe(12)
    expect(error).toBe("")
  })

  test("Gets collections with select", async () => {
    const { data, error } = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_GET
    ).get({
      select: {
        collection: "cms_collections.name",
      },
      limit: 1,
    })
    expect(data).toEqual([
      { collection: "collection_0", collectionId: null, id: 1 },
    ])
    expect(error).toBe("")
  })

  test("Gets collections first page", async () => {
    const { data, error } = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_GET
    ).get({
      page: 1,
    })
    expect(data.length).toBe(10)
    expect(error).toBe("")
  })

  test("Gets collections with pagination", async () => {
    const { data, error } = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_GET
    ).get({
      page: 2,
      limit: 10,
    })
    expect(data.length).toBe(2)
    expect(error).toBe("")
  })

  test("Gets collections with descending id", async () => {
    const { data, error } = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_GET
    ).get({
      orderBy: ["id", "desc", "last"],
    })
    expect(data[0].id).toBe(12)
    expect(data[9].id).toBe(3)
    expect(error).toBe("")
  })

  test("Remove collection with defaults", async () => {
    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_REMOVE
    ).remove({
      where: ["cms_collections.id", "=", 1],
    })

    expect(result).toEqual({ data: [{ id: 1 }], error: "" })
  })

  test("Remove collection with returning", async () => {
    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_REMOVE
    ).remove({
      where: ["cms_collections.id", "=", 2],
      returning: ["name"],
    })

    expect(result).toEqual({ data: [{ name: "collection_1" }], error: "" })
  })

  test("Remove non-existent record from collection", async () => {
    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_REMOVE
    ).remove({
      where: ["cms_collections.id", "=", 99],
      returning: ["id"],
    })

    expect(result).toEqual({ data: [], error: "" })
  })

  test("Remove returns error if no where prop", async () => {
    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_REMOVE
    ).remove(
      // @ts-ignore - testing no where prop
      {}
    )

    expect(result).toEqual({
      data: [],
      error: "cmsCollectionsDao.remove requires a 'where' tuple argument",
    })
  })

  test("Insert default collection", async () => {
    const data = {
      ...COLLECTION_SERVICES_DATA_DEFAULTS,
      name: "Insert_default_collection",
    }

    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_INSERT
    ).insert({
      data,
      userId: COLLECTION_SERVICES_DATA_DEFAULTS.userId,
      returning: COLLECTION_SERVICE_COLUMNS,
    })

    expect(result).toEqual({
      data: [
        {
          ...data,

          roles: null,
          isPublished: false,
          columnOrder: null,
        },
      ],
      error: "",
    })
  })

  test("Insert collection with all fields", async () => {
    const data = {
      ...COLLECTION_SERVICES_DATA_DEFAULTS,
      name: "Insert_collection_with_all_fields",
      roles: ["ADMIN"],
      isPublished: true,
      columnOrder: ["col1", "col2"],
    }

    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_INSERT
    ).insert({
      data,
      userId: COLLECTION_SERVICES_DATA_DEFAULTS.userId,
      returning: COLLECTION_SERVICE_COLUMNS,
    })

    expect(result).toEqual({
      data: [data],
      error: "",
    })
  })

  test("Can not insert duplicate collection name", async () => {
    const data: CmsCollectionInsert = {
      name: "Can_not_insert_duplicate_collection_name",
      userId: 1,
      type: "multiple",
    }

    await cmsCollectionServices(COLLECTION_SCHEMA_SERVICE_INSERT).insert({
      data,
      userId: data.userId,
      returning: ["name", "userId", "type"],
    })

    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_INSERT
    ).insert({
      data,
      userId: data.userId,
      returning: ["name", "userId", "type"],
    })

    expect(result).toEqual({
      data: [],
      error: "Duplicate, already exists",
    })
  })

  test("Insert returns error if no data prop", async () => {
    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_INSERT
    ).insert(
      //@ts-ignore  - testing no data prop
      {
        userId: COLLECTION_SERVICES_DATA_DEFAULTS.userId,
        returning: COLLECTION_SERVICE_COLUMNS,
      }
    )

    expect(result).toEqual({
      data: [],
      error: "cmsCollectionService.insert has invalid 'data' object prop",
    })
  })

  test("Insert returns error if no userId prop", async () => {
    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_INSERT
    ).insert(
      //@ts-ignore  - testing no userId prop
      {
        data: {
          name: "Can_not_insert_duplicate_collection_name",
          userId: 1,
          type: "multiple",
        },
        returning: COLLECTION_SERVICE_COLUMNS,
      }
    )

    expect(result).toEqual({
      data: [],
      error: "cmsCollectionService.insert requires a 'userId' prop",
    })
  })

  test("Update with defaults", async () => {
    const userId = 1
    const data: CmsCollectionUpdate = {
      userId,
      name: "update_1",
      type: "single",
      roles: ["GUEST"],
      columnOrder: ["col", "col2", "col_3"],
      isPublished: true,
    }

    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_UPDATE
    ).update({
      data,
      userId,
      where: ["cms_collections.id", "=", 1],
    })

    expect(result).toEqual({
      data: [{ id: 1 }],
      error: "",
    })
  })

  test("Update with retuning", async () => {
    const userId = 1
    const data: CmsCollectionUpdate = {
      userId,
      name: "update_2",
      type: "single",
      roles: ["GUEST"],
      columnOrder: ["col", "col2", "col_3"],
      isPublished: true,
    }

    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_UPDATE
    ).update({
      data,
      userId,
      where: ["cms_collections.id", "=", 2],
      returning: [
        "name",
        "userId",
        "type",
        "roles",
        "columnOrder",
        "isPublished",
      ],
    })

    expect(result).toEqual({
      data: [data],
      error: "",
    })
  })

  test("Update returns error if no data prop", async () => {
    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_UPDATE
    ).update(
      // @ts-ignore - testing no data prop
      {
        userId: 1,
        where: ["cms_collections.id", "=", 1],
      }
    )

    expect(result).toEqual({
      data: [],
      error: "cmsCollectionService.update has invalid 'data' object prop",
    })
  })

  test("Update returns error if no where prop", async () => {
    const userId = 1
    const data: CmsCollectionUpdate = {
      userId: 1,
      name: "update_1",
      type: "single",
      roles: ["GUEST"],
      columnOrder: ["col", "col2", "col_3"],
      isPublished: true,
    }

    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_UPDATE
    ).update(
      // @ts-ignore - testing no where prop
      {
        data,
        userId,
      }
    )

    expect(result).toEqual({
      data: [],
      error:
        "cmsCollectionsDao.update collection requires a 'where' tuple argument",
    })
  })

  test("Update returns error if no userId prop", async () => {
    const data: CmsCollectionUpdate = {
      userId: 1,
      name: "update_1",
      type: "single",
      roles: ["GUEST"],
      columnOrder: ["col", "col2", "col_3"],
      isPublished: true,
    }

    const result = await cmsCollectionServices(
      COLLECTION_SCHEMA_SERVICE_UPDATE
    ).update(
      // @ts-ignore - testing no userId prop
      {
        data,
        where: ["cms_collections.id", "=", 1],
      }
    )

    expect(result).toEqual({
      data: [],
      error: "cmsCollectionService.update requires a 'userId' prop",
    })
  })
})
