import { type Page, expect, test } from "@playwright/test"

const collectionName = "Collection"

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/collections")

  await page.getByRole("button", { name: "New Collection" }).click()

  await page.getByRole("textbox").fill(`${collectionName}`)
  await page.getByLabel("Type").click()
  await expect(page.getByLabel("Type")).toBeChecked()

  await page.getByRole("button", { name: "Add Collection" }).click()
  await page.locator("html").click()

  await page.goto(`http://localhost:3000/collections/${collectionName}`)
})

test.afterEach(async ({ page }) => {
  await page.goto("http://localhost:3000/collections")

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
})

test("Collection page has heading", async ({ page }) => {
  expect(page.locator("h1")).toContainText(collectionName)
})
