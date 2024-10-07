import { z } from "zod"
import {
  deleteCollectionAction,
  addNewCollectionAction,
  renameCollectionAction,
  updateColumnOrderAction,
} from "../../../src/actions/collection.actions"
import {
  ON_RENAME_COLLECTION_ACTION,
  ON_DELETE_COLLECTION_ACTION,
  ON_NEW_COLLECTION_ACTION,
  ON_UPDATE_COLUMN_ORDER_ACTION,
  cleanUpCmsCollectionsAction,
  setUpCmsCollectionsAction,
} from "./helpers.collection.actions"

jest.mock("server-only", () => undefined)

beforeAll(async () => {
  await setUpCmsCollectionsAction()
})

afterAll(async () => {
  await cleanUpCmsCollectionsAction()
})

describe("CMS Collections Actions", () => {
  test("renameCollectionAction updates collection name", async () => {
    const action = await renameCollectionAction({
      schema: ON_RENAME_COLLECTION_ACTION,
      userId: 1,
    })

    const result = await action({ id: 1, name: "renamed" })

    expect(result).toEqual({ data: [{ id: 1 }], error: "" })
  })

  test("renameCollectionAction throws error without schema", async () => {
    const action = await renameCollectionAction(
      // @ts-expect-error - testing no schema
      {
        userId: 1,
      }
    )

    const result = await action({ id: 1, name: "rename" })

    expect(result).toEqual({
      data: [],
      error: "renameCollectionAction requires an 'schema' prop",
    })
  })

  test("renameCollectionAction returns error if no userId", async () => {
    const action = await renameCollectionAction(
      // @ts-expect-error - testing no userId
      {
        schema: ON_RENAME_COLLECTION_ACTION,
      }
    )

    const result = await action({ id: 1, name: "rename" })

    expect(result).toEqual({
      data: [],
      error: "renameCollectionAction requires an 'userId' prop",
    })
  })

  test("renameCollectionAction returns error if no id", async () => {
    const action = await renameCollectionAction({
      schema: ON_RENAME_COLLECTION_ACTION,
      userId: 1,
    })

    // @ts-expect-error - testing no id
    const result = await action({ name: "rename" })

    expect(result).toEqual({
      data: [],
      error: "renameCollectionAction requires an 'id' prop",
    })
  })

  test("renameCollectionAction returns error if no name", async () => {
    const action = await renameCollectionAction({
      schema: ON_RENAME_COLLECTION_ACTION,
      userId: 1,
    })

    // @ts-expect-error - testing no name
    const result = await action({ id: 1 })

    expect(result).toEqual({
      data: [],
      error: "renameCollectionAction requires an 'name' prop",
    })
  })

  test("deleteCollectionAction returns error if no schema", async () => {
    const action = await deleteCollectionAction(
      // @ts-expect-error - testing no schema
      {}
    )

    const result = await action({ id: 1 })

    expect(result).toEqual({
      data: [],
      error: "deleteCollectionAction requires an 'schema' prop",
    })
  })

  test("deleteCollectionAction returns error if no id", async () => {
    const action = await deleteCollectionAction({
      schema: ON_DELETE_COLLECTION_ACTION,
    })

    // @ts-expect-error - testing no id
    const result = await action({})
    expect(result).toEqual({
      data: [],
      error: "deleteCollectionAction requires an 'id' prop",
    })
  })

  test("deleteCollectionAction deletes collection", async () => {
    const action = await deleteCollectionAction({
      schema: ON_DELETE_COLLECTION_ACTION,
    })

    const result = await action({ id: 1 })

    expect(result).toEqual({ data: [{ id: 1 }], error: "" })
  })

  test("addNewCollectionAction returns error if no schema", async () => {
    const action = await addNewCollectionAction(
      // @ts-expect-error - testing no schema
      {
        userId: 1,
      }
    )

    const result = await action({
      name: "colName",
      type: "single",
    })

    expect(result).toEqual({
      data: [],
      error: "addNewCollectionAction requires an 'schema' prop",
    })
  })

  test("addNewCollectionAction returns error if no userId", async () => {
    const action = await addNewCollectionAction(
      // @ts-expect-error - testing no userId
      {
        schema: ON_NEW_COLLECTION_ACTION,
      }
    )

    const result = await action({
      name: "colName",
      type: "single",
    })

    expect(result).toEqual({
      data: [],
      error: "addNewCollectionAction requires an 'userId' prop",
    })
  })

  test("addNewCollectionAction returns error if no data", async () => {
    const action = await addNewCollectionAction({
      schema: ON_NEW_COLLECTION_ACTION,
      userId: 1,
    })

    const result = await action(
      // @ts-expect-error - testing no data
      {}
    )

    expect(result).toEqual({
      data: [],
      error:
        "addNewCollectionAction requires an 'data' argument with a 'name' and a 'type'",
    })
  })

  test("addNewCollectionAction inserts collection", async () => {
    const action = await addNewCollectionAction({
      schema: ON_NEW_COLLECTION_ACTION,
      userId: 1,
    })

    const { data, error } = await action({
      name: "colName",
      type: "single",
    })

    const dataShape = z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        type: z.string(),
        createdAt: z.date(),
        createdBy: z.number(),
        updatedAt: z.date(),
        updatedBy: z.number(),
      })
    )

    expect(dataShape.parse(data)).toEqual(data)
    expect(data.length).toBe(1)
    expect(error).toBe("")
  })

  test("updateColumnOrderAction returns error if no schema", async () => {
    const action = await updateColumnOrderAction(
      // @ts-expect-error  - testing no schema
      {
        userId: 1,
      }
    )

    const result = await action({ id: 1, columnOrder: ["col_2", "col_3"] })

    expect(result).toEqual({
      data: [],
      error: "updateColumnOrderAction requires an 'schema' prop",
    })
  })

  test("updateColumnOrderAction returns error if no userId", async () => {
    const action = await updateColumnOrderAction(
      // @ts-expect-error  - testing no schema
      {
        schema: ON_UPDATE_COLUMN_ORDER_ACTION,
      }
    )

    const result = await action({ id: 1, columnOrder: ["col_2", "col_3"] })

    expect(result).toEqual({
      data: [],
      error: "updateColumnOrderAction requires an 'userId' prop",
    })
  })

  test("updateColumnOrderAction returns error if no id", async () => {
    const action = await updateColumnOrderAction({
      schema: ON_UPDATE_COLUMN_ORDER_ACTION,
      userId: 1,
    })

    // @ts-expect-error  - testing no schema
    const result = await action({ columnOrder: ["col_2", "col_3"] })

    expect(result).toEqual({
      data: [],
      error: "updateColumnOrderAction requires an 'id' prop",
    })
  })

  test("updateColumnOrderAction returns error if no columnOrder", async () => {
    const action = await updateColumnOrderAction({
      schema: ON_UPDATE_COLUMN_ORDER_ACTION,
      userId: 1,
    })

    // @ts-expect-error  - testing no schema
    const result = await action({ id: 1 })

    expect(result).toEqual({
      data: [],
      error: "updateColumnOrderAction requires an 'columnOrder' prop",
    })
  })

  test("updateColumnOrderAction updates columnOrder", async () => {
    const action = await updateColumnOrderAction({
      schema: ON_UPDATE_COLUMN_ORDER_ACTION,
      userId: 1,
    })

    const result = await action({ id: 1, columnOrder: ["col_2", "col_3"] })

    expect(result).toEqual({
      data: [{ id: 1 }],
      error: "",
    })
  })
})
