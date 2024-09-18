import cmsCollectionDocumentsDao from "../../../src/dao/documents.dao"
import {
  DOCUMENTS_SCHEMA_DAO_GET,
  DOCUMENTS_SCHEMA_DAO_INSERT,
  DOCUMENTS_SCHEMA_DAO_REMOVE,
  DOCUMENTS_SCHEMA_DAO_UPDATE,
  docCollection1Dao,
  // cleanUpCmsDocumentsDao,
  setUpCmsDocumentsDao,
} from "./helpers.documents.dao"

jest.mock("server-only", () => undefined)

beforeAll(async () => {
  await setUpCmsDocumentsDao()
})

afterAll(async () => {
  // await cleanUpCmsDocumentsDao()
})

describe("CMS Documents DAO", () => {
  test("cmsCollectionDocumentsDao throws error id no schema", async () => {
    try {
      // @ts-expect-error - testing no schema
      const r = await cmsCollectionDocumentsDao()
    } catch (error) {
      expect(error).toEqual(
        new Error("Must provide a schema for cmsCollectionDocumentsDao")
      )
    }
  })

  test("Get documents with defaults", async () => {
    const { data, error, totalPages } = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_GET
    ).get({
      collectionName: "collection_1",
    })

    expect(data.length).toBe(1)

    const { data: documents, ...collection } = data[0]

    expect(collection).toEqual(docCollection1Dao)

    expect(documents.length).toBe(10)
    expect(documents[0].id).toBe(1)
    expect(documents[0].title).toBe("title_0")
    expect(documents[0].content).toBe("content_0")

    expect(error).toBe("")
    expect(totalPages).toBe(2)
  })

  test("Get with search params", async () => {
    const limit = 2

    const { data, error, totalPages } = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_GET
    ).get({
      page: 2,
      limit,
      collectionName: "collection_1",
    })

    const { data: documents, ...collection } = data[0]

    expect(documents.length).toBe(limit)
    expect(documents[0].title).toBe("title_2")
    expect(documents[0].content).toBe("content_2")
    expect(documents[1].title).toBe("title_3")
    expect(documents[1].content).toBe("content_3")
    expect(collection).toEqual(docCollection1Dao)

    expect(totalPages).toBe(6)
    expect(error).toBe("")
  })

  test("Get with search params orderBy id", async () => {
    const limit = 2

    const { data, error, totalPages } = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_GET
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
    expect(collection).toEqual(docCollection1Dao)

    expect(totalPages).toBe(6)
    expect(error).toBe("")
  })

  test("Get with search params orderBy data field", async () => {
    const limit = 2

    const { data, error, totalPages } = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_GET
    ).get({
      page: 2,
      limit,
      orderBy: ["title", "desc", "last"],
      collectionName: "collection_1",
    })

    const { data: documents, ...collection } = data[0]

    expect(documents.length).toBe(limit)
    expect(documents[0].title).toBe("title_3")
    expect(documents[0].content).toBe("content_3")
    expect(documents[1].title).toBe("title_2")
    expect(documents[1].content).toBe("content_2")
    expect(collection).toEqual(docCollection1Dao)

    expect(totalPages).toBe(6)
    expect(error).toBe("")
  })

  test("Get returns empty array if no collectionName", async () => {
    const { data, error } = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_GET
      // @ts-expect-error - testing without props
    ).get()

    expect(data.length).toBe(0)
    expect(data).toEqual([])
    expect(error).toBe("")
  })

  test("Get returns empty array if no collectionName found", async () => {
    const { data, error } = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_GET
    ).get({
      collectionName: "collection",
    })

    expect(data.length).toBe(0)
    expect(data).toEqual([])
    expect(error).toBe("")
  })

  test("Remove collection with defaults", async () => {
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_REMOVE
    ).remove({
      where: ["cms_documents.id", "=", 1],
    })
    expect(result).toEqual({ data: [{ id: 1 }], error: "" })
  })

  test("Remove collection with returning", async () => {
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_REMOVE
    ).remove({
      where: ["cms_documents.id", "=", 2],
      returning: ["collectionId", "data"],
    })

    expect(result).toEqual({
      data: [
        {
          collectionId: 1,
          data: {
            title: "title_1",
            content: "content_1",
          },
        },
      ],
      error: "",
    })
  })

  test("Remove multiple collections", async () => {
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_REMOVE
    ).remove({
      where: [["cms_documents.id", "=", 3], "OR", ["cms_documents.id", "=", 4]],
    })

    expect(result).toEqual({
      data: [{ id: 3 }, { id: 4 }],
      error: "",
    })
  })

  test("Remove non-existent record from collection", async () => {
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_REMOVE
    ).remove({
      where: ["cms_documents.id", "=", 99],
      returning: ["collectionId", "data"],
    })

    expect(result).toEqual({ data: [], error: "" })
  })

  test("Remove document returns error if no where prop", async () => {
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_REMOVE
    ).remove(
      // @ts-ignore - testing missing where prop
      {}
    )

    expect(result).toEqual({
      data: [],
      error:
        "cmsCollectionDocumentsDao.remove collection requires a 'where' tuple prop",
    })
  })

  test("Insert document", async () => {
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_INSERT
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
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_INSERT
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
      returning: ["collectionId", "data"],
    })

    expect(result).toEqual({
      data: [{ collectionId: 1, data: { title: "hello" } }],
      error: "",
    })
  })

  test("Insert document returns error if no data prop", async () => {
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_INSERT
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
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_INSERT
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
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_INSERT
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
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_UPDATE
    ).update({
      data: {
        title: "hello",
      },
      userId: 1,
      where: ["cms_documents.id", "=", 1],
    })

    expect(result).toEqual({ data: [{ id: 1 }], error: "" })
  })

  test("Update with retuning", async () => {
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_UPDATE
    ).update({
      data: {
        content: "hello",
      },
      userId: 1,
      where: ["cms_documents.id", "=", 2],
      returning: ["data"],
    })

    expect(result).toEqual({
      data: [{ data: { content: "hello", title: "title_1" } }],
      error: "",
    })
  })

  test("Update returns error if no data prop", async () => {
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_UPDATE
    ).update(
      // @ts-ignore testing no data prop
      {
        userId: 1,
        where: ["cms_documents.id", "=", 1],
      }
    )

    expect(result).toEqual({
      data: [],
      error:
        "cmsCollectionDocumentsDao.update collection requires a 'data' object prop",
    })
  })

  test("Update returns error if no 'where' prop", async () => {
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_UPDATE
    ).update(
      // @ts-ignore testing no where prop
      {
        data: { title: "heading" },
        userId: 1,
      }
    )

    expect(result).toEqual({
      data: [],
      error:
        "cmsCollectionDocumentsDao.update collection requires a 'where' tuple prop",
    })
  })

  test("Update returns error if no 'userId' prop", async () => {
    const result = await cmsCollectionDocumentsDao(
      DOCUMENTS_SCHEMA_DAO_UPDATE
      // @ts-ignore testing no userId prop
    ).update({
      data: { title: "heading" },
      where: ["cms_documents.id", "=", 1],
    })

    expect(result).toEqual({
      data: [],
      error: "cmsCollectionDocumentsDao.update collection requires a 'userId'",
    })
  })
})
