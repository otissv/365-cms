import { z } from "zod"
import {
  onDeleteColumnAction,
  onInsertColumnAction,
  onSortColumnAction,
  onUpdateColumnAction,
} from "../../../src/actions/column.actions"

import {
  // cleanUpCmsColumnAction,
  setUpCmsColumnAction,
  ON_DELETE_COLUMN_ACTION_DATA,
  ON_INSERT_COLUMN_ACTION_DATA,
  ON_SORT_COLUMN_ACTION_DATA,
  ON_UPDATE_COLUMN_ACTION_DATA,
  columnUpdate,
  // ON_UPDATE_COLUMN_ACTION_DATA,
} from "./helpers.column.actions"

jest.mock("server-only", () => undefined)

beforeAll(async () => {
  await setUpCmsColumnAction()
})

afterAll(async () => {
  // await cleanUpCmsColumnAction()
})

describe("CMS Column Actions", () => {
  test("onDeleteColumnAction returns error if no schema", async () => {
    const action = await onDeleteColumnAction(
      // @ts-expect-error - testing no schema
      {}
    )

    const result = await action({
      fieldId: "field_0",
      documentId: 1,
    })

    expect(result).toEqual({
      data: [],
      error: "onDeleteColumnAction requires a 'schema' prop",
    })
  })

  test("onDeleteColumnAction returns error if no props", async () => {
    const action = await onDeleteColumnAction({
      schema: ON_DELETE_COLUMN_ACTION_DATA,
    })

    // @ts-expect-error - testing no schema
    const result = await action()

    expect(result).toEqual({
      data: [],
      error:
        "onDeleteColumnAction requires a 'props' argument with fieldId and documentId props",
    })
  })

  test("onDeleteColumnAction returns error if no fieldId", async () => {
    const action = await onDeleteColumnAction({
      schema: ON_DELETE_COLUMN_ACTION_DATA,
    })

    const result = await action(
      // @ts-expect-error - testing no schema
      {
        documentId: 1,
      }
    )

    expect(result).toEqual({
      data: [],
      error:
        "onDeleteColumnAction requires a 'props' argument with fieldId and documentId props",
    })
  })

  test("onDeleteColumnAction returns error if no documentId", async () => {
    const action = await onDeleteColumnAction({
      schema: ON_DELETE_COLUMN_ACTION_DATA,
    })

    const result = await action(
      // @ts-expect-error - testing no schema
      {
        fieldId: "field_0",
      }
    )

    expect(result).toEqual({
      data: [],
      error:
        "onDeleteColumnAction requires a 'props' argument with fieldId and documentId props",
    })
  })

  test("onDeleteColumnAction deletes column", async () => {
    const action = onDeleteColumnAction({
      schema: ON_DELETE_COLUMN_ACTION_DATA,
    })

    const result = await action({
      fieldId: "field_0",
      documentId: 1,
    })

    expect(result).toEqual({
      data: [{ id: 1, collectionId: 1 }],
      error: "",
    })
  })

  test("onInsertColumnAction returns error if no schema", async () => {
    const action = await onInsertColumnAction(
      // @ts-expect-error - testing no schema
      {
        userId: 1,
      }
    )

    const result = await action({
      columnName: "onInsertColumnAction",
      collectionId: 1,
      fieldId: "onInsertColumnAction",
      type: "text",
      columnOrder: [],
    })

    expect(result).toEqual({
      data: [],
      error: "onInsertColumnAction requires a 'schema' prop",
    })
  })

  test("onInsertColumnAction returns error if no userId", async () => {
    const action = await onInsertColumnAction(
      // @ts-expect-error - testing no userId
      {
        schema: ON_INSERT_COLUMN_ACTION_DATA,
      }
    )

    const result = await action({
      columnName: "onInsertColumnAction",
      collectionId: 1,
      fieldId: "onInsertColumnAction",
      type: "text",
      columnOrder: [],
    })

    expect(result).toEqual({
      data: [],
      error: "onInsertColumnAction requires a 'userId' prop",
    })
  })

  test("onInsertColumnAction returns error if no data", async () => {
    const action = await onInsertColumnAction({
      schema: ON_INSERT_COLUMN_ACTION_DATA,
      userId: 1,
    })

    // @ts-expect-error - testing no data
    const result = await action()

    expect(result).toEqual({
      data: [],
      error: "onInsertColumnAction requires a 'data' prop",
    })
  })

  test("onInsertColumnAction inserts column", async () => {
    const action = await onInsertColumnAction({
      schema: ON_INSERT_COLUMN_ACTION_DATA,
      userId: 1,
    })

    const { data, error } = await action({
      columnName: "onInsertColumnAction",
      collectionId: 1,
      fieldId: "insert",
      type: "text",
      columnOrder: [],
    })

    const expectedShape = z.array(
      z.object({
        id: z.number(),
        fieldId: z.string(),
        collectionId: z.number(),
        createdAt: z.date(),
        createdBy: z.number(),
        updatedAt: z.date(),
        updatedBy: z.number(),
      })
    )

    expect(expectedShape.parse(data)).toEqual(data)
    expect(error).toEqual("")
  })

  test("onSortColumnAction returns error if no schema", async () => {
    const action = await onSortColumnAction(
      // @ts-expect-error - testing no userId
      {
        collectionName: "collection_1",
        userId: 1,
      }
    )

    const result = await action({
      sortBy: "desc",
      collectionId: 1,
      id: 1,
    })

    expect(result).toEqual({
      data: [],
      error: "onSortColumnAction requires a 'schema' prop",
    })
  })

  test("onSortColumnAction returns error if no collectionName", async () => {
    const action = await onSortColumnAction(
      // @ts-expect-error - testing no userId
      {
        schema: ON_SORT_COLUMN_ACTION_DATA,
        userId: 1,
      }
    )

    const result = await action({
      sortBy: "desc",
      collectionId: 1,
      id: 1,
    })

    expect(result).toEqual({
      data: [],
      error: "onSortColumnAction requires a 'collectionName' prop",
    })
  })

  test("onSortColumnAction returns error if no userId", async () => {
    const action = await onSortColumnAction(
      // @ts-expect-error - testing no userId
      {
        schema: ON_SORT_COLUMN_ACTION_DATA,
        collectionName: "collection_1",
      }
    )

    const result = await action({
      sortBy: "desc",
      collectionId: 1,
      id: 1,
    })

    expect(result).toEqual({
      data: [],
      error: "onSortColumnAction requires a 'userId' prop",
    })
  })

  test("onSortColumnAction returns error if no id", async () => {
    const action = await onSortColumnAction({
      schema: ON_SORT_COLUMN_ACTION_DATA,
      collectionName: "collection_1",
      userId: 1,
    })

    const result = await action(
      // @ts-expect-error - testing no collectionId
      {
        sortBy: "desc",
        collectionId: 1,
      }
    )

    expect(result).toEqual({
      data: [],
      error: "onSortColumnAction requires an 'id' prop",
    })
  })

  test("onSortColumnAction returns error if no collectionId", async () => {
    const action = await onSortColumnAction({
      schema: ON_SORT_COLUMN_ACTION_DATA,
      collectionName: "collection_1",
      userId: 1,
    })

    const result = await action(
      // @ts-expect-error - testing no collectionId
      {
        id: 1,
        sortBy: "desc",
      }
    )

    expect(result).toEqual({
      data: [],
      error: "onSortColumnAction requires an 'collectionId' prop",
    })
  })

  test("onSortColumnAction returns error if no sortBy", async () => {
    const action = await onSortColumnAction({
      schema: ON_SORT_COLUMN_ACTION_DATA,
      collectionName: "collection_1",
      userId: 1,
    })

    const result = await action(
      // @ts-expect-error - testing no sortBy
      {
        id: 1,
        collectionId: 1,
      }
    )

    expect(result).toEqual({
      data: [],
      error: "onSortColumnAction requires an 'sortBy' prop",
    })
  })

  test("onSortColumnAction updates sortBy", async () => {
    const action = await onSortColumnAction({
      schema: ON_SORT_COLUMN_ACTION_DATA,
      collectionName: "collection_1",
      userId: 1,
    })

    const result = await action({
      id: 1,
      collectionId: 1,
      sortBy: "desc",
    })

    expect(result).toEqual({
      data: {
        collectionId: 1,
        collectionName: "collection_1",
        columnOrder: ["col1", "col2"],
        type: "multiple",
        roles: ["ADMIN"],
        columns: [
          {
            id: 1,
            columnName: "col_0",
            fieldId: "field_0",
            type: "text",
            fieldOptions: {
              defaultValue: 0,
            },
            validation: {
              required: true,
            },
            help: "Help text",
            enableDelete: false,
            enableSort: false,
            enableHide: false,
            enableFilter: false,
            sortBy: "desc",
            visibility: true,
            index: {
              nulls: "last",
              direction: "asc",
            },
          },
        ],
        data: [],
      },
      totalPages: 0,
      error: "",
    })
  })

  test("onUpdateColumnAction returns error if no schema", async () => {
    const action = await onUpdateColumnAction(
      // @ts-expect-error - testing no schema
      {
        userId: 1,
      }
    )

    const result = await action({
      id: 1,
      collectionId: 1,
      data: columnUpdate,
    })

    expect(result).toEqual({
      data: [],
      error: "onUpdateColumnAction requires a 'schema' prop",
    })
  })

  test("onUpdateColumnAction returns error if no userId", async () => {
    const action = await onUpdateColumnAction(
      // @ts-expect-error - testing no userId
      {
        schema: ON_UPDATE_COLUMN_ACTION_DATA,
      }
    )

    const result = await action({
      id: 1,
      collectionId: 1,
      data: columnUpdate,
    })

    expect(result).toEqual({
      data: [],
      error: "onUpdateColumnAction requires a 'userId' prop",
    })
  })

  test("onUpdateColumnAction returns error if no props", async () => {
    const action = await onUpdateColumnAction({
      schema: ON_UPDATE_COLUMN_ACTION_DATA,
      userId: 1,
    })

    // @ts-expect-error - testing no props
    const result = await action()

    expect(result).toEqual({
      data: [],
      error: "onUpdateColumnAction requires a 'props' prop",
    })
  })

  test("onUpdateColumnAction updates column", async () => {
    const action = await onUpdateColumnAction({
      schema: ON_UPDATE_COLUMN_ACTION_DATA,
      userId: 1,
    })

    const result = await action({
      id: 1,
      collectionId: 1,
      data: columnUpdate,
    })

    expect(result).toEqual({
      data: [{ id: 1 }],
      error: "",
    })
  })
})
