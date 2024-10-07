import { z } from "zod"
import {
  deleteColumnAction,
  insertColumnAction,
  sortColumnAction,
  updateColumnAction,
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
  test("deleteColumnAction returns error if no schema", async () => {
    const action = await deleteColumnAction(
      // @ts-expect-error - testing no schema
      {}
    )

    const result = await action({
      fieldId: "field_0",
    })

    expect(result).toEqual({
      data: [],
      error: "deleteColumnAction requires a 'schema' prop",
    })
  })

  test("deleteColumnAction returns error if no props", async () => {
    const action = await deleteColumnAction({
      schema: ON_DELETE_COLUMN_ACTION_DATA,
    })

    // @ts-expect-error - testing no schema
    const result = await action()

    expect(result).toEqual({
      data: [],
      error:
        "deleteColumnAction requires a 'props' argument with fieldId and documentId props",
    })
  })

  test("deleteColumnAction returns error if no fieldId", async () => {
    const action = await deleteColumnAction({
      schema: ON_DELETE_COLUMN_ACTION_DATA,
    })

    const result = await action(
      // @ts-expect-error - testing no schema
      {}
    )

    expect(result).toEqual({
      data: [],
      error:
        "deleteColumnAction requires a 'props' argument with fieldId and documentId props",
    })
  })

  test("deleteColumnAction deletes column", async () => {
    const action = deleteColumnAction({
      schema: ON_DELETE_COLUMN_ACTION_DATA,
    })

    const result = await action({
      fieldId: "field_0",
    })

    expect(result).toEqual({
      data: [{ id: 1, collectionId: 1 }],
      error: "",
    })
  })

  test("insertColumnAction returns error if no schema", async () => {
    const action = await insertColumnAction(
      // @ts-expect-error - testing no schema
      {
        userId: 1,
      }
    )

    const result = await action({
      columnName: "insertColumnAction",
      collectionId: 1,
      fieldId: "insertColumnAction",
      type: "text",
      columnOrder: [],
    })

    expect(result).toEqual({
      data: [],
      error: "insertColumnAction requires a 'schema' prop",
    })
  })

  test("insertColumnAction returns error if no userId", async () => {
    const action = await insertColumnAction(
      // @ts-expect-error - testing no userId
      {
        schema: ON_INSERT_COLUMN_ACTION_DATA,
      }
    )

    const result = await action({
      columnName: "insertColumnAction",
      collectionId: 1,
      fieldId: "insertColumnAction",
      type: "text",
      columnOrder: [],
    })

    expect(result).toEqual({
      data: [],
      error: "insertColumnAction requires a 'userId' prop",
    })
  })

  test("insertColumnAction returns error if no data", async () => {
    const action = await insertColumnAction({
      schema: ON_INSERT_COLUMN_ACTION_DATA,
      userId: 1,
    })

    // @ts-expect-error - testing no data
    const result = await action()

    expect(result).toEqual({
      data: [],
      error: "insertColumnAction requires a 'data' prop",
    })
  })

  test("insertColumnAction inserts column", async () => {
    const action = await insertColumnAction({
      schema: ON_INSERT_COLUMN_ACTION_DATA,
      userId: 1,
    })

    const { data, error } = await action({
      columnName: "insertColumnAction",
      collectionId: 1,
      fieldId: "insert",
      type: "text",
      columnOrder: [],
    })

    const expectedShape = z.array(
      z.object({
        id: z.number(),
        columnName: z.string(),
        collectionId: z.number(),
        fieldId: z.string(),
        type: z.string(),
        enableDelete: z.boolean(),
        enableSort: z.boolean(),
        enableHide: z.boolean(),
        enableFilter: z.boolean(),
        sortBy: z.string(),
        visibility: z.boolean(),
      })
    )

    console.log(data)

    expect(expectedShape.parse(data)).toEqual(data)
    expect(error).toEqual("")
  })

  test("sortColumnAction returns error if no schema", async () => {
    const action = await sortColumnAction(
      // @ts-expect-error - testing no userId
      {
        userId: 1,
      }
    )

    const result = await action({
      searchParams: {
        sortBy: "collection_1",
        direction: "asc",
        page: 1,
        limit: 10,
        layout: "grid",
        nulls: "last",
      },
      collectionId: 1,
      collectionName: "testing",
      id: 1,
    })

    expect(result).toEqual({
      data: {},
      error: "sortColumnAction requires a 'schema' prop",
      totalPages: 0,
    })
  })

  test("sortColumnAction returns error if no userId", async () => {
    const action = await sortColumnAction(
      // @ts-expect-error - testing no userId
      {
        schema: ON_SORT_COLUMN_ACTION_DATA,
      }
    )

    const result = await action({
      searchParams: {
        sortBy: "collection_1",
        direction: "asc",
        page: 1,
        limit: 10,
        layout: "grid",
        nulls: "last",
      },
      collectionId: 1,
      collectionName: "testing",
      id: 1,
    })

    expect(result).toEqual({
      data: {},
      error: "sortColumnAction requires a 'userId' prop",
      totalPages: 0,
    })
  })

  test("sortColumnAction returns error if no id", async () => {
    const action = await sortColumnAction({
      schema: ON_SORT_COLUMN_ACTION_DATA,
      userId: 1,
    })

    const result = await action(
      // @ts-expect-error - testing no collectionId
      {
        searchParams: {
          sortBy: "collection_1",
          direction: "asc",
          page: 1,
          limit: 10,
          layout: "grid",
          nulls: "last",
        },
        collectionId: 1,
      }
    )

    expect(result).toEqual({
      data: {},
      error: "sortColumnAction requires an 'id' prop",
      totalPages: 0,
    })
  })

  test("sortColumnAction returns error if no sortBy", async () => {
    const action = await sortColumnAction({
      schema: ON_SORT_COLUMN_ACTION_DATA,
      userId: 1,
    })

    const result = await action({
      id: 1,
      // @ts-expect-error - testing no collectionId
      searchParams: {
        direction: "asc",
        page: 1,
        limit: 10,
        layout: "grid",
        nulls: "last",
      },
    })

    expect(result).toEqual({
      data: {},
      error: "sortColumnAction requires an 'collectionId' prop",
      totalPages: 0,
    })
  })

  test("sortColumnAction returns error if no searchParams", async () => {
    const action = await sortColumnAction({
      schema: ON_SORT_COLUMN_ACTION_DATA,
      userId: 1,
    })

    const result = await action(
      // @ts-expect-error - testing no searchParams
      {
        id: 1,
        collectionId: 1,
        collectionName: "testing",
      }
    )

    expect(result).toEqual({
      data: {},
      error:
        "sortColumnAction requires searchParams with a direction and sortBy props",
      totalPages: 0,
    })
  })

  test("sortColumnAction returns error if no collectionName", async () => {
    const action = await sortColumnAction({
      schema: ON_SORT_COLUMN_ACTION_DATA,
      userId: 1,
    })

    const result = await action(
      // @ts-expect-error - testing no searchParams
      {
        id: 1,
        collectionId: 1,
        searchParams: {
          sortBy: "collection_1",
          direction: "asc",
          page: 1,
          limit: 10,
          layout: "grid",
          nulls: "last",
        },
      }
    )

    expect(result).toEqual({
      data: {},
      error: "sortColumnAction requires a 'collectionName' prop",
      totalPages: 0,
    })
  })

  test("sortColumnAction updates sortBy", async () => {
    const action = await sortColumnAction({
      schema: ON_SORT_COLUMN_ACTION_DATA,
      userId: 1,
    })

    const result = await action({
      id: 1,
      collectionId: 1,
      collectionName: "testing",
      searchParams: {
        sortBy: "collection_1",
        direction: "desc",
        page: 1,
        limit: 10,
        layout: "grid",
        nulls: "last",
      },
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

  test("updateColumnAction returns error if no schema", async () => {
    const action = await updateColumnAction(
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
      error: "updateColumnAction requires a 'schema' prop",
    })
  })

  test("updateColumnAction returns error if no userId", async () => {
    const action = await updateColumnAction(
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
      error: "updateColumnAction requires a 'userId' prop",
    })
  })

  test("updateColumnAction returns error if no props", async () => {
    const action = await updateColumnAction({
      schema: ON_UPDATE_COLUMN_ACTION_DATA,
      userId: 1,
    })

    // @ts-expect-error - testing no props
    const result = await action()

    expect(result).toEqual({
      data: [],
      error: "updateColumnAction requires a 'props' prop",
    })
  })

  test("updateColumnAction updates column", async () => {
    const action = await updateColumnAction({
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
