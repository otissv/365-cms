import cmsColumnsService from "../../../src/services/column.service"
import type {
  CmsCollectionColumnInsert,
  CmsCollectionColumnUpdate,
} from "../../../src/types.cms"
import {
  setUpCmsColumnsService,
  cleanUpCmsColumnsService,
  COLUMN_SCHEMA_SERVICE_GET_BY_FIELD_ID,
  COLUMN_SCHEMA_SERVICE_INSERT,
  COLUMN_SCHEMA_SERVICE_REMOVE,
  COLUMN_SERVICE_DATA_DEFAULTS,
  COLUMN_SCHEMA_SERVICE_UPDATE,
} from "./helpers.column.service"

jest.mock("server-only", () => undefined)

beforeAll(async () => {
  await setUpCmsColumnsService()
})

afterAll(async () => {
  await cleanUpCmsColumnsService()
})

describe("CMS Column Service", () => {
  test("cmsColumnsService throws error if no schema", async () => {
    try {
      // @ts-expect-error - testing no schema
      const r = await cmsColumnsService()
    } catch (error) {
      expect(error).toEqual(
        new Error("Must provide a schema for cmsColumnService")
      )
    }
  })

  test("Get by fieldId with defaults", async () => {
    const result = await cmsColumnsService(
      COLUMN_SCHEMA_SERVICE_GET_BY_FIELD_ID
    ).get({
      collectionId: 1,
      fieldId: "field_0",
    })

    expect(result.data.length).toBe(1)
    expect(result.error).toBe("")
  })

  test("Get by fieldId returns empty array if not exist", async () => {
    const result = await cmsColumnsService(
      COLUMN_SCHEMA_SERVICE_GET_BY_FIELD_ID
    ).get({
      collectionId: 1,
      fieldId: "noExist",
    })

    expect(result.data.length).toBe(0)
    expect(result.data).toEqual([])
    expect(result.error).toBe("")
  })

  test("Get by fieldId with select", async () => {
    const result = await cmsColumnsService(
      COLUMN_SCHEMA_SERVICE_GET_BY_FIELD_ID
    ).get({
      collectionId: 1,
      fieldId: "field_0",
      select: { field: "fieldId" },
    })

    expect(result).toEqual({
      data: [{ field: "field_0" }],
      totalPages: 1,
      error: "",
    })
  })

  test("Get by fieldId returns error with no collectionId", async () => {
    const result = await cmsColumnsService(
      COLUMN_SCHEMA_SERVICE_GET_BY_FIELD_ID
    ).get(
      // @ts-ignore - testing no collectionId prop
      {
        fieldId: "field_0",
        select: { field: "fieldId" },
      }
    )

    expect(result).toEqual({
      data: [],
      totalPages: 0,
      error: "cmsColumnsDao.getByFieldId requires 'collectionId' prop",
    })
  })

  test("Get by fieldId returns error with no fieldId", async () => {
    const result = await cmsColumnsService(
      COLUMN_SCHEMA_SERVICE_GET_BY_FIELD_ID
    ).get(
      // @ts-ignore - testing no fieldId prop
      {
        collectionId: 1,
        select: { field: "fieldId" },
      }
    )

    expect(result).toEqual({
      data: [],
      totalPages: 0,
      error: "cmsColumnsDao.getByFieldId requires 'fieldId' prop",
    })
  })

  test("Remove collection with defaults", async () => {
    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_REMOVE).remove(
      {
        fieldId: "field_0",
      }
    )

    expect(result).toEqual({ data: [{ id: 1, collectionId: 1 }], error: "" })
  })

  test("Remove collection with returning", async () => {
    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_REMOVE).remove(
      {
        fieldId: "field_1",
        returning: ["fieldId"],
      }
    )

    expect(result).toEqual({
      data: [{ fieldId: "field_1", collectionId: 1 }],
      error: "",
    })
  })

  test("Cannot remove non-existent record from collection", async () => {
    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_REMOVE).remove(
      {
        fieldId: "field_99",
        returning: ["id"],
      }
    )

    expect(result).toEqual({ data: [], error: "" })
  })

  test("Remove error if no fieldId prop", async () => {
    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_REMOVE).remove(
      // @ts-ignore - testing no fieldId prop
      {}
    )

    expect(result).toEqual({
      data: [],
      error: "cmsColumnsDao.remove requires a 'fieldId' prop",
    })
  })

  test("Remove error if no fieldId prop", async () => {
    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_REMOVE).remove(
      // @ts-ignore - testing no fieldId prop
      {}
    )

    expect(result).toEqual({
      data: [],
      error: "cmsColumnsDao.remove requires a 'fieldId' prop",
    })
  })

  test("Insert default collection", async () => {
    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_INSERT).insert(
      {
        data: COLUMN_SERVICE_DATA_DEFAULTS,
        userId: 1,
      }
    )

    expect(result).toEqual({
      data: [{ id: 1 }],
      error: "",
    })
  })

  test("Insert collection with all fields", async () => {
    const data = {
      ...(COLUMN_SERVICE_DATA_DEFAULTS as any),
      fieldId: "0001",
      fieldOptions: { defaultValue: "" },
      validation: { required: true },
      help: "help text",
      enableDelete: true,
      enableSort: true,
      enableHide: true,
      enableFilter: true,
      sortBy: "asc" as CmsCollectionColumnInsert["sortBy"],
      visibility: true,
      index: {
        direction: "asc",
        nulls: "last",
      } as CmsCollectionColumnInsert["index"],
    }

    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_INSERT).insert(
      {
        data,
        userId: 1,
        returning: [
          "columnName",
          "collectionId",
          "type",
          "fieldId",
          "fieldOptions",
          "validation",
          "help",
          "enableDelete",
          "enableSort",
          "enableHide",
          "enableFilter",
          "sortBy",
          "visibility",
          "index",
        ],
      }
    )

    // biome-ignore lint/performance/noDelete: <explanation>
    delete data.columnOrder

    expect(result).toEqual({
      data: [data],
      error: "",
    })
  })

  test("Insert returns error with no userId prop", async () => {
    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_INSERT).insert(
      // @ts-ignore - testing no userId prop
      {
        data: COLUMN_SERVICE_DATA_DEFAULTS,
      }
    )

    expect(result).toEqual({
      data: [],
      error: "cmsColumnsService.insert requires a 'userId' prop",
    })
  })

  test("Can not insert duplicate column name", async () => {
    await cmsColumnsService(COLUMN_SCHEMA_SERVICE_INSERT).insert({
      data: COLUMN_SERVICE_DATA_DEFAULTS,
      userId: 1,
    })

    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_INSERT).insert(
      {
        data: COLUMN_SERVICE_DATA_DEFAULTS,
        userId: 1,
      }
    )

    expect(result).toEqual({
      data: [],
      error: "Duplicate, already exists",
    })
  })

  test("Update with defaults", async () => {
    const data: CmsCollectionColumnUpdate = {
      columnName: "update_2",
      type: "text",
    }

    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_UPDATE).update(
      {
        id: 1,
        collectionId: 1,
        data,
        userId: 1,
      }
    )

    expect(result).toEqual({ data: [{ id: 1 }], error: "" })
  })

  test("Update with all fields", async () => {
    const data: CmsCollectionColumnUpdate = {
      columnName: "update_2",
      type: "text",
      fieldOptions: { defaultValue: "" },
      validation: { required: true },
      help: "help text",
      enableDelete: true,
      enableSort: true,
      enableHide: true,
      enableFilter: true,
      sortBy: "asc" as CmsCollectionColumnInsert["sortBy"],
      visibility: true,
      index: {
        direction: "asc",
        nulls: "last",
      } as CmsCollectionColumnInsert["index"],
    }

    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_UPDATE).update(
      {
        collectionId: 1,
        id: 1,
        data,
        userId: 1,
        returning: [
          "id",
          "collectionId",
          "fieldId",
          "columnName",
          "type",
          "fieldOptions",
          "validation",
          "help",
          "enableDelete",
          "enableSort",
          "enableHide",
          "enableFilter",
          "sortBy",
          "visibility",
          "index",
        ],
      }
    )

    expect(result).toEqual({
      data: [{ ...data, collectionId: 1, fieldId: "field_0", id: 1 }],
      error: "",
    })
  })

  test("Update returns error if no collectionId", async () => {
    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_UPDATE).update(
      // @ts-expect-error - testing no collectionId prop
      {
        id: 1,
        data: {
          columnName: "update_2",
          type: "text",
        },
        userId: 1,
      }
    )

    expect(result).toEqual({
      data: [],
      error: "cmsColumnsDao.update requires a 'collectionId' prop",
    })
  })

  test("Update returns error if no data", async () => {
    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_UPDATE).update(
      // @ts-expect-error - testing no data prop
      {
        id: 1,
        collectionId: 1,
        userId: 1,
      }
    )

    expect(result).toEqual({
      data: [],
      error: "cmsColumnService.update has invalid 'data' object prop",
    })
  })

  test("Update returns error if no id", async () => {
    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_UPDATE).update(
      // @ts-expect-error - testing no id prop
      {
        data: {
          columnName: "update_2",
          type: "text",
        },
        collectionId: 1,
        userId: 1,
      }
    )

    expect(result).toEqual({
      data: [],
      error: "cmsColumnsService.update 'id' must be a number",
    })
  })

  test("Update returns error if no userId", async () => {
    const result = await cmsColumnsService(COLUMN_SCHEMA_SERVICE_UPDATE).update(
      // @ts-expect-error - testing no userId prop
      {
        data: {
          columnName: "update_2",
          type: "text",
        },
        id: 1,
        collectionId: 1,
      }
    )

    expect(result).toEqual({
      data: [],
      error: "cmsColumnsService.update requires a 'userId' prop",
    })
  })
})
