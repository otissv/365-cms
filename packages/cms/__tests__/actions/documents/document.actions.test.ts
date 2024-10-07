import {
  getDocumentsAction,
  deleteRowAction,
  updateDataAction,
} from "../../../src/actions/document.actions"
import type {
  CmsCollectionDocumentUpdate,
  CmsDocumentsView,
} from "../../../src/types.cms"
import {
  GET_DOCUMENTS_ACTION,
  ON_DELETE_ROW_ACTION_DATA,
  ON_UPDATE_DATA_ACTION,
  ON_UPDATE_INSERT_DATA_ACTION,
  cleanUpCmsDocumentsActions,
  setUpCmsDocumentsActions,
} from "./helpers.documents.action"

jest.mock("server-only", () => undefined)

beforeAll(async () => {
  await setUpCmsDocumentsActions()
})

afterAll(async () => {
  await cleanUpCmsDocumentsActions()
})

describe("CMS Document Actions", () => {
  test("getDocumentsAction throws error if no schema", async () => {
    const action = await getDocumentsAction(
      // @ts-expect-error - testing no collectionName
      {}
    )

    const result = await action({
      collectionName: "collection_1",
    })

    expect(result).toEqual({
      data: {},
      error: "getDocumentsAction requires a 'schema' argument",
      totalPages: 0,
    })
  })

  test("getDocumentsAction with defaults", async () => {
    const action = await getDocumentsAction({
      schema: GET_DOCUMENTS_ACTION,
    })

    const { data, error, totalPages } = await action({
      collectionName: "collection_1",
    })

    const { data: documents, ...collection } = data as CmsDocumentsView

    expect(collection).toEqual({
      collectionId: 1,
      collectionName: "collection_1",
      columnOrder: ["col1", "col2"],
      type: "multiple",
      roles: ["ADMIN"],
      columns: [
        {
          id: 1,
          columnName: "col_1",
          fieldId: "field_1",
          type: "text",
          fieldOptions: {
            defaultValue: 1,
          },
          validation: {
            required: true,
          },
          help: "Help text",
          enableDelete: false,
          enableSort: false,
          enableHide: false,
          enableFilter: false,
          sortBy: "asc",
          visibility: true,
          index: {
            nulls: "last",
            direction: "asc",
          },
        },
      ],
    })

    expect(documents.length).toBe(10)
    expect(documents[0].id).toBe(1)
    expect(documents[0].title).toBe("title_0")
    expect(documents[0].content).toBe("content_0")

    expect(totalPages).toBe(2)
    expect(error).toBe("")
  })

  test("getDocumentsAction with searchParams", async () => {
    const limit = 2
    const action = await getDocumentsAction({
      schema: GET_DOCUMENTS_ACTION,
    })

    const { data, error, totalPages } = await action({
      collectionName: "collection_1",
      searchParams: {
        page: 1,
        limit,
        sortBy: "id",
        direction: "desc",
        nulls: "last",
      },
    })

    const { data: documents, ...collection } = data as CmsDocumentsView

    expect(documents.length).toBe(limit)
    expect(documents[0].title).toBe("title_11")
    expect(documents[0].content).toBe("content_11")
    expect(documents[1].title).toBe("title_10")
    expect(documents[1].content).toBe("content_10")

    expect(totalPages).toBe(6)
    expect(error).toBe("")

    expect(collection).toEqual({
      collectionId: 1,
      collectionName: "collection_1",
      columnOrder: ["col1", "col2"],
      type: "multiple",
      roles: ["ADMIN"],
      columns: [
        {
          id: 1,
          columnName: "col_1",
          fieldId: "field_1",
          type: "text",
          fieldOptions: {
            defaultValue: 1,
          },
          validation: {
            required: true,
          },
          help: "Help text",
          enableDelete: false,
          enableSort: false,
          enableHide: false,
          enableFilter: false,
          sortBy: "asc",
          visibility: true,
          index: {
            nulls: "last",
            direction: "asc",
          },
        },
      ],
    })
  })

  test("getDocumentsAction returns empty object is no collectionName", async () => {
    const action = await getDocumentsAction({
      schema: GET_DOCUMENTS_ACTION,
    })

    const result = await action(
      // @ts-expect-error - testing no collectionName
      {}
    )

    expect(result).toEqual({
      data: {},
      error: "getDocumentsAction requires a 'collectionName' argument",
      totalPages: 0,
    })
  })

  test("deleteRowAction returns error if no schema", async () => {
    const action = deleteRowAction(
      // @ts-expect-error - testing no schema
      {}
    )

    const result = await action({ ids: [1, 2] })

    expect(result).toEqual({
      data: [],
      error: "deleteRowAction requires a 'schema' prop",
    })
  })

  test("deleteRowAction returns error if no ids", async () => {
    const action = deleteRowAction({
      schema: ON_DELETE_ROW_ACTION_DATA,
    })

    const result = await action(
      // @ts-expect-error - testing no schema
      {}
    )

    expect(result).toEqual({
      data: [],
      error: "deleteRowAction requires a 'ids' prop",
    })
  })

  test("deleteRowAction deletes rows", async () => {
    const action = deleteRowAction({
      schema: ON_DELETE_ROW_ACTION_DATA,
    })

    const result = await action({ ids: [1, 2] })

    expect(result).toEqual({ data: [{ id: 1 }, { id: 2 }], error: "" })
  })

  test("updateDataAction throws error if no schema", async () => {
    try {
      await updateDataAction(
        // @ts-expect-error - testing no collectionName
        {}
      )
    } catch (error) {
      expect(error).toEqual(
        new Error("Must provide a schema cmsDocumentsService")
      )
    }
  })

  test("updateDataAction throws error if userId schema", async () => {
    try {
      await updateDataAction(
        // @ts-expect-error - testing no collectionName
        {
          schema: ON_UPDATE_INSERT_DATA_ACTION,
        }
      )
    } catch (error) {
      expect(error).toEqual(
        new Error("Must provide a schema cmsDocumentsService")
      )
    }
  })

  test("updateDataAction throws error if userId schema", async () => {
    try {
      const action = await updateDataAction({
        schema: ON_UPDATE_INSERT_DATA_ACTION,
        userId: 1,
      })

      // @ts-expect-error - testing no props argument
      await action()
    } catch (error) {
      expect(error).toEqual(
        new Error(
          "updateDataAction requires a props object argument with 'id' and 'data'"
        )
      )
    }
  })

  test("updateDataAction insert with defaults", async () => {
    const action = await updateDataAction({
      schema: ON_UPDATE_INSERT_DATA_ACTION,
      userId: 1,
    })

    const result = await action({
      collectionId: 1,
      data: [{ title: "with defaults" }],
    })

    expect(result).toEqual({ data: [{ id: 5 }], error: "" })
  })

  test("updateDataAction insert with defaults returning all fields", async () => {
    const action = await updateDataAction({
      schema: ON_UPDATE_INSERT_DATA_ACTION,
      userId: 1,
    })

    const result = await action(
      {
        collectionId: 1,
        data: [{ title: "with defaults returning" }],
      },
      ["collectionId", "data"]
    )

    expect(result).toEqual({
      data: [
        {
          collectionId: 1,
          data: {
            title: "with defaults returning",
          },
        },
      ],
      error: "",
    })
  })

  test("updateDataAction update with id", async () => {
    const action = await updateDataAction({
      schema: ON_UPDATE_DATA_ACTION,
      userId: 1,
    })

    const result = await action({
      id: 1,
      data: { title: "with id" } as CmsCollectionDocumentUpdate,
    })

    expect(result).toEqual({ data: [{ id: 1 }], error: "" })
  })

  test("updateDataAction update with id returning all fields", async () => {
    const action = await updateDataAction({
      schema: ON_UPDATE_DATA_ACTION,
      userId: 1,
    })

    const result = await action(
      {
        id: 2,
        data: { title: "with id returning" } as CmsCollectionDocumentUpdate,
      },
      ["id", "collectionId", "data"]
    )

    expect(result).toEqual({
      data: [
        {
          id: 2,
          collectionId: 1,
          data: {
            title: "with id returning",
            content: "content_1",
          },
        },
      ],
      error: "",
    })
  })
})
