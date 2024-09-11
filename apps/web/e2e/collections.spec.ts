import { type Page, expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/collections")
})

async function removeCollection(page: Page, collectionName: string) {
  await page.locator("html").click()

  await page
    .getByTestId(`card-collection-${collectionName}`)
    .getByRole("button", { name: "Actions" })
    .click()
  await page.getByRole("button", { name: "Delete" }).click()
  await page.getByRole("button", { name: `Delete ${collectionName}` }).click()
  await page.locator("html").click()

  page.getByTestId(`card-collection-${collectionName}`)

  await expect(
    page.getByTestId(`card-collection-${collectionName}`).isHidden()
  ).toBeTruthy()
}

test("Add & remove new collection with single item", async ({ page }) => {
  const collectionName = "Single"
  const testId = `card-collection-${collectionName}`

  await page.getByRole("button", { name: "New Collection" }).click()

  await page.getByRole("textbox").fill(`${collectionName}`)
  await page.getByLabel("Type").click()
  await expect(page.getByLabel("Type")).toBeChecked()

  await page.getByRole("button", { name: "Add Collection" }).click()
  await page.locator("html").click()

  await expect(
    page
      .getByTestId(testId)
      .getByTestId(`collection-card-title-${collectionName}`)
  ).toContainText(collectionName)

  await removeCollection(page, collectionName)
})

test("Add & remove new collection with multiple items", async ({ page }) => {
  const collectionName = "Multiple"
  const testId = `card-collection-${collectionName}`

  await page.getByRole("button", { name: "New Collection" }).click()

  await page.getByRole("textbox").fill(`${collectionName}`)
  await page.getByLabel("Type").click()
  await page.getByLabel("Type").click()
  await expect(page.getByLabel("Type")).not.toBeChecked()

  await page.getByRole("button", { name: "Add Collection" }).click()
  await page.locator("html").click()

  await expect(
    page
      .getByTestId(testId)
      .getByTestId(`collection-card-title-${collectionName}`)
  ).toContainText(collectionName)

  await removeCollection(page, collectionName)
})

test("Collection already exists", async ({ page }) => {
  const collectionName = "Exits"

  await page.getByRole("button", { name: "New Collection" }).click()

  await page.getByRole("textbox").fill(`${collectionName}`)
  await page.getByLabel("Type").click()
  await page.getByRole("button", { name: "Add Collection" }).click()
  await page.locator("html").click()

  await page.getByRole("button", { name: "New Collection" }).click()
  await page.getByRole("textbox").fill(`${collectionName}`)
  await page.getByRole("button", { name: "Add Collection" }).click()

  await expect(page.getByText("Duplicate, already exists")).toBeTruthy()

  // remove collection
  await removeCollection(page, collectionName)
})

test("Rename collection", async ({ page }) => {
  const collectionName = "Rename"
  const collectionNewName = "Rename2"
  const testId = `card-collection-${collectionName}`
  const testRenameId = `card-collection-${collectionNewName}`

  await page.getByRole("button", { name: "New Collection" }).click()

  await page.getByRole("textbox").fill(`${collectionName}`)
  await page.getByLabel("Type").click()
  await page.getByRole("button", { name: "Add Collection" }).click()
  await page.locator("html").click()

  await page
    .getByTestId(testId)
    .getByRole("button", { name: "Actions" })
    .click()
  await page.getByRole("button", { name: "Rename" }).click()
  await page.getByLabel("Collections new name").fill(`${collectionNewName}`)
  await page.getByRole("button", { name: "Save" }).click()
  await page.locator("html").click()

  await expect(
    page
      .getByTestId(testRenameId)
      .getByTestId(`collection-card-title-${collectionNewName}`)
  ).toBeTruthy()

  // remove collection
  await removeCollection(page, collectionNewName)
})
