import cmsDocumentsService from "../../../src/services/documents.service"
import {
  DOCUMENTS_SCHEMA_SERVICE_GET,
  DOCUMENTS_SCHEMA_SERVICE_INSERT,
  DOCUMENTS_SCHEMA_SERVICE_REMOVE,
  DOCUMENTS_SCHEMA_SERVICE_UPDATE,
  cleanUpCmsDocumentsService,
  docCollection1Service,
  setUpCmsDocumentsService,
} from "./helpers.documents.service"

jest.mock("server-only", () => undefined)

beforeAll(async () => {
  await setUpCmsDocumentsService()
})

afterAll(async () => {
  await cleanUpCmsDocumentsService()
})

describe("CMS Documents Service", () => {
  test("cmsDocumentsService throws error id no schema", async () => {
    try {
      // @ts-expect-error - testing no schema
      const r = await cmsDocumentsService()
    } catch (error) {
      expect(error).toEqual(
        new Error("Must provide a schema for cmsDocumentsService")
      )
    }
  })

  test("Get collections default", async () => {
    const { data, error } = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_GET
    ).get({
      collectionName: "collection_1",
    })

    expect(data.length).toBe(1)

    const { data: documents, ...collection } = data[0]

    expect(collection).toEqual(docCollection1Service)

    expect(documents.length).toBe(10)
    expect(documents[0].id).toBe(1)
    expect(documents[0].title).toBe("title_0")
    expect(documents[0].content).toBe("content_0")

    expect(error).toBe("")
  })

  test("Get with search params", async () => {
    const limit = 2

    const { data, error, totalPages } = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_GET
    ).get({
      page: 2,
      limit,
      orderBy: ["id", "desc", "last"],
      collectionName: "collection_1",
    })

    const { data: documents, ...collection } = data[0]

    expect(documents.length).toBe(limit)
    expect(documents[0].title).toBe("title_9")
    expect(documents[0].content).toBe("content_9")
    expect(documents[1].title).toBe("title_8")
    expect(documents[1].content).toBe("content_8")
    expect(collection).toEqual(docCollection1Service)

    expect(totalPages).toBe(6)
    expect(error).toBe("")
  })

  test("Get returns empty array if no collectionName", async () => {
    const { data, error } = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_GET
      // @ts-expect-error - testing without props
    ).get()

    expect(data.length).toBe(0)
    expect(data).toEqual([])
    expect(error).toBe("")
  })

  test("Get returns empty array if no collectionName found", async () => {
    const { data, error } = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_GET
    ).get({
      collectionName: "collection",
    })

    expect(data.length).toBe(0)
    expect(data).toEqual([])
    expect(error).toBe("")
  })

  test("Remove collection with defaults", async () => {
    const result = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_REMOVE
    ).remove({
      ids: [1, 2],
    })

    expect(result).toEqual({ data: [{ id: 1 }, { id: 2 }], error: "" })
  })

  test("Remove collection with returning", async () => {
    const result = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_REMOVE
    ).remove({
      ids: [3],
      returning: ["collectionId", "data"],
    })

    expect(result).toEqual({
      data: [
        {
          collectionId: 1,
          data: {
            title: "title_2",
            content: "content_2",
          },
        },
      ],
      error: "",
    })
  })

  test("Remove non-existent record from collection", async () => {
    const result = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_REMOVE
    ).remove({
      ids: [999],
      returning: ["collectionId", "data"],
    })

    expect(result).toEqual({ data: [], error: "" })
  })

  test("Insert document", async () => {
    const result = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_INSERT
    ).insert({
      data: {
        collectionId: 1,
        data: [
          {
            title: "hello",
          },
        ],
      },
      userId: 1,
    })

    expect(result).toEqual({ data: [{ id: 1 }], error: "" })
  })

  test("Insert document with returning", async () => {
    const result = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_INSERT
    ).insert({
      data: {
        collectionId: 1,
        data: [
          {
            title: "hello",
          },
        ],
      },
      returning: ["collectionId", "data"],
      userId: 1,
    })

    expect(result).toEqual({
      data: [{ collectionId: 1, data: { title: "hello" } }],
      error: "",
    })
  })

  test("Insert document returns error if no data prop", async () => {
    const result = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_INSERT
    ).insert({
      // @ts-ignore no data prop
      data: {
        collectionId: 1,
      },
      userId: 1,
      returning: ["collectionId", "data"],
    })

    expect(result).toEqual({
      data: [],
      error:
        "cmsCollectionDocumentsDao.insert collection requires a 'data' object prop",
    })
  })
  test("Insert document returns error if no collectionId prop ", async () => {
    const result = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_INSERT
    ).insert({
      // @ts-ignore where no collectionId prop
      data: {
        data: [
          {
            title: "hello",
          },
        ],
      },
      userId: 1,
      returning: ["collectionId", "data"],
    })

    expect(result).toEqual({
      data: [],
      error:
        "cmsCollectionDocumentsDao.insert collection requires a collectionId prop",
    })
  })

  test("Insert document returns error if no userId prop ", async () => {
    const result = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_INSERT
    ).insert(
      // @ts-ignore where no user prop
      {
        data: {
          collectionId: 1,
          data: [
            {
              title: "hello",
            },
          ],
        },
        returning: ["collectionId", "data"],
      }
    )

    expect(result).toEqual({
      data: [],
      error: "cmsCollectionDocumentsDao.insert collection requires a 'userId'",
    })
  })

  test("Update document", async () => {
    const result = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_UPDATE
    ).update({
      id: 1,
      data: {
        title: "hello",
      },
      userId: 1,
    })

    expect(result).toEqual({ data: [{ id: 1 }], error: "" })
  })

  test("Update with retuning", async () => {
    const result = await cmsDocumentsService(
      DOCUMENTS_SCHEMA_SERVICE_UPDATE
    ).update({
      id: 2,
      data: {
        content: "hello",
      },

      returning: ["data"],
      userId: 1,
    })

    expect(result).toEqual({
      data: [{ data: { content: "hello", title: "title_1" } }],
      error: "",
    })
  })
})
