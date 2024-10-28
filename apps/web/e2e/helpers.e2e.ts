import { expect } from "@playwright/test"
import type { Locator, Page } from "@playwright/test"

export async function createDocuments(page: Page, collectionName: string) {
  await createCollection(page, collectionName)
  await page.goto(`http://localhost:3000/collections/${collectionName}`)
}

export async function createCollection(
  page: Page,
  collectionName: string,
  type: "single" | "multiple" = "multiple"
) {
  await page.goto("http://localhost:3000/collections")
  await page.getByRole("button", { name: "New Collection" }).click()
  await page.getByRole("textbox").fill(collectionName)

  if (type === "single") {
    await page.getByLabel("Type").click()

    expect(page.getByLabel("Type")).toBeChecked()
  } else {
    expect(page.getByLabel("Type")).not.toBeChecked()
  }

  await page.getByRole("button", { name: "Add Collection" }).click()
  await page.getByTestId(`card-collection-${collectionName}`).click()

  await page.locator("html").click()
}

export async function removeCollection(page: Page, collectionName: string) {
  await page.goto("http://localhost:3000/collections")

  await page.locator("html").click()

  await page
    .getByTestId(`card-collection-${collectionName}`)
    .getByRole("button", { name: "Actions" })
    .click()

  const deleteButton = page.getByTestId(
    `collection-card-title-${collectionName}-delete`
  )

  await deleteButton.click()
  await page.getByRole("button", { name: `Delete ${collectionName}` }).click()
  await page.locator("html").click()
}

export async function addColumn({
  columnType,
  fieldId,
  page,
  collectionName,
  columnName,
}: {
  page: Page
  collectionName: string
  columnName: string
  columnType: string
  fieldId: string
}) {
  await createCollection(page, collectionName)

  await page.goto(`http://localhost:3000/collections/${collectionName}`)
  await page.getByRole("button", { name: "Add Column" }).click()
  await page.getByRole("heading", { name: columnType, exact: true }).click()

  // Settings tab
  await page.getByLabel("Column ID *").click()
  await page.getByLabel("Column ID *").fill(fieldId)
  await page.getByLabel("Column Name *").click()
  await page.getByLabel("Column Name *").fill(columnName)
}

export async function saveColumn({
  page,
  columnName,
}: { page: Page; columnName: string }) {
  await page.getByRole("button", { name: "Save" }).click()
  await page.locator("html").click()

  // Test column was created
  await expect(page.getByRole("cell", { name: columnName })).toContainText(
    columnName
  )
}

export async function fillTextField({
  element,
  content,
}: { content: string; element: Locator }) {
  await element.click()
  await element.fill(content)
  await element.press("Enter")
}
