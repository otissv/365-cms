import cmsCollectionsDao from "../../src/dao/collection.dao"

const SCHEMA = "test"

jest.mock("server-only", () => undefined)

test("adds 1 + 2 to equal 3", async () => {
  const result = await cmsCollectionsDao(SCHEMA).get()
  result

  expect(1).toEqual(1)
})
