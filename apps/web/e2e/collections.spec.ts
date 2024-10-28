import { expect, test } from "@playwright/test"

import { createCollection } from "./helpers.e2e"

test("Add single document collection", async ({ page }) => {
  const collectionName = "Single"
  const testId = `card-collection-${collectionName}`
  await createCollection(page, collectionName, "single")

  expect(
    page
      .getByTestId(testId)
      .getByTestId(`collection-card-title-${collectionName}`)
  ).toContainText(collectionName)
})

test("Add multiple documents collection", async ({ page }) => {
  const collectionName = "Multiple"
  const testId = `card-collection-${collectionName}`
  await createCollection(page, collectionName)

  expect(
    page
      .getByTestId(testId)
      .getByTestId(`collection-card-title-${collectionName}`)
  ).toContainText(collectionName)
})

test("Collection already exists", async ({ page }) => {
  const collectionName = "Exits"
  await createCollection(page, collectionName)

  await page.getByRole("button", { name: "New Collection" }).click()
  await page.getByRole("textbox").fill(collectionName)

  expect(page.getByText("Duplicate, already exists")).toBeTruthy()
})

test("Rename collection", async ({ page }) => {
  const collectionName = "Rename"
  const collectionNewName = "Rename2"
  const testId = `card-collection-${collectionName}`
  const testRenameId = `card-collection-${collectionNewName}`
  await createCollection(page, collectionName)

  await page.goto("http://localhost:3000/collections")

  await page.locator("html").click()

  await page
    .getByTestId(`card-collection-${collectionName}`)
    .getByRole("button", { name: "Actions" })
    .click()
  await page.getByRole("button", { name: "Rename" }).click()
  await page.getByLabel("Collections new name").fill(`${collectionNewName}`)
  await page.getByRole("button", { name: "Save" }).click()
  await page.locator("html").click()

  expect(
    page
      .getByTestId(testRenameId)
      .getByTestId(`collection-card-title-${collectionNewName}`)
  ).toBeTruthy()
})
