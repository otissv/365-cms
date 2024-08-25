import { z } from "zod"
import {
  onDeleteCollectionAction,
  onNewCollectionAction,
  onRenameCollectionAction,
  onUpdateColumnOrderAction,
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
  test("onRenameCollectionAction updates collection name", async () => {
    const action = await onRenameCollectionAction({
      schema: ON_RENAME_COLLECTION_ACTION,
      userId: 1,
    })

    const result = await action({ id: 1, name: "renamed" })

    expect(result).toEqual({ data: [{ id: 1 }], error: "" })
  })

  test("onRenameCollectionAction throws error without schema", async () => {
    const action = await onRenameCollectionAction(
      // @ts-expect-error - testing no schema
      {
        userId: 1,
      }
    )

    const result = await action({ id: 1, name: "rename" })

    expect(result).toEqual({
      data: [],
      error: "onRenameCollectionAction requires an 'schema' prop",
    })
  })

  test("onRenameCollectionAction returns error if no userId", async () => {
    const action = await onRenameCollectionAction(
      // @ts-expect-error - testing no userId
      {
        schema: ON_RENAME_COLLECTION_ACTION,
      }
    )

    const result = await action({ id: 1, name: "rename" })

    expect(result).toEqual({
      data: [],
      error: "onRenameCollectionAction requires an 'userId' prop",
    })
  })

  test("onRenameCollectionAction returns error if no id", async () => {
    const action = await onRenameCollectionAction({
      schema: ON_RENAME_COLLECTION_ACTION,
      userId: 1,
    })

    // @ts-expect-error - testing no id
    const result = await action({ name: "rename" })

    expect(result).toEqual({
      data: [],
      error: "onRenameCollectionAction requires an 'id' prop",
    })
  })

  test("onRenameCollectionAction returns error if no name", async () => {
    const action = await onRenameCollectionAction({
      schema: ON_RENAME_COLLECTION_ACTION,
      userId: 1,
    })

    // @ts-expect-error - testing no name
    const result = await action({ id: 1 })

    expect(result).toEqual({
      data: [],
      error: "onRenameCollectionAction requires an 'name' prop",
    })
  })

  test("onDeleteCollectionAction returns error if no schema", async () => {
    const action = await onDeleteCollectionAction(
      // @ts-expect-error - testing no schema
      {}
    )

    const result = await action({ id: 1 })

    expect(result).toEqual({
      data: [],
      error: "onDeleteCollectionAction requires an 'schema' prop",
    })
  })

  test("onDeleteCollectionAction returns error if no id", async () => {
    const action = await onDeleteCollectionAction({
      schema: ON_DELETE_COLLECTION_ACTION,
    })

    // @ts-expect-error - testing no id
    const result = await action({})
    expect(result).toEqual({
      data: [],
      error: "onDeleteCollectionAction requires an 'id' prop",
    })
  })

  test("onDeleteCollectionAction deletes collection", async () => {
    const action = await onDeleteCollectionAction({
      schema: ON_DELETE_COLLECTION_ACTION,
    })

    const result = await action({ id: 1 })

    expect(result).toEqual({ data: [{ id: 1 }], error: "" })
  })

  test("onNewCollectionAction returns error if no schema", async () => {
    const action = await onNewCollectionAction(
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
      error: "onNewCollectionAction requires an 'schema' prop",
    })
  })

  test("onNewCollectionAction returns error if no userId", async () => {
    const action = await onNewCollectionAction(
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
      error: "onNewCollectionAction requires an 'userId' prop",
    })
  })

  test("onNewCollectionAction returns error if no data", async () => {
    const action = await onNewCollectionAction({
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
        "onNewCollectionAction requires an 'data' argument with a 'name' and a 'type'",
    })
  })

  test("onNewCollectionAction inserts collection", async () => {
    const action = await onNewCollectionAction({
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

  test("onUpdateColumnOrderAction returns error if no schema", async () => {
    const action = await onUpdateColumnOrderAction(
      // @ts-expect-error  - testing no schema
      {
        userId: 1,
      }
    )

    const result = await action({ id: 1, columnOrder: ["col_2", "col_3"] })

    expect(result).toEqual({
      data: [],
      error: "onUpdateColumnOrderAction requires an 'schema' prop",
    })
  })

  test("onUpdateColumnOrderAction returns error if no userId", async () => {
    const action = await onUpdateColumnOrderAction(
      // @ts-expect-error  - testing no schema
      {
        schema: ON_UPDATE_COLUMN_ORDER_ACTION,
      }
    )

    const result = await action({ id: 1, columnOrder: ["col_2", "col_3"] })

    expect(result).toEqual({
      data: [],
      error: "onUpdateColumnOrderAction requires an 'userId' prop",
    })
  })

  test("onUpdateColumnOrderAction returns error if no id", async () => {
    const action = await onUpdateColumnOrderAction({
      schema: ON_UPDATE_COLUMN_ORDER_ACTION,
      userId: 1,
    })

    // @ts-expect-error  - testing no schema
    const result = await action({ columnOrder: ["col_2", "col_3"] })

    expect(result).toEqual({
      data: [],
      error: "onUpdateColumnOrderAction requires an 'id' prop",
    })
  })

  test("onUpdateColumnOrderAction returns error if no columnOrder", async () => {
    const action = await onUpdateColumnOrderAction({
      schema: ON_UPDATE_COLUMN_ORDER_ACTION,
      userId: 1,
    })

    // @ts-expect-error  - testing no schema
    const result = await action({ id: 1 })

    expect(result).toEqual({
      data: [],
      error: "onUpdateColumnOrderAction requires an 'columnOrder' prop",
    })
  })

  test("onUpdateColumnOrderAction updates columnOrder", async () => {
    const action = await onUpdateColumnOrderAction({
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
