import { expect, type Page, test } from "@playwright/test"

import { addColumn, saveColumn } from "../helpers.e2e"

async function addBooleanColumn({
  page,
  collectionName,
  columnName,
}: {
  page: Page
  collectionName: string
  columnName: string
}) {
  return addColumn({
    page,
    collectionName,
    columnName,
    columnType: "Boolean",
    fieldId: "bool",
  })
}

test("Add column - Boolean default", async ({ page }) => {
  const collectionName = "BooleanField"
  const columnName = "Boolean Column"

  await addBooleanColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  expect(
    await page.getByRole("switch", { name: "True False" }).isChecked()
  ).toBe(false)
})

test("Add column - Boolean true", async ({ page }) => {
  const collectionName = "BooleanField"
  const columnName = "Boolean Column"

  await addBooleanColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  await page.getByRole("switch", { name: "True False" }).click()

  await page.locator("html").click()
  await page.locator("html").click()

  expect(
    await page.getByRole("switch", { name: "True False" }).isChecked()
  ).toBe(true)
})

test("Add column - Boolean false", async ({ page }) => {
  const collectionName = "BooleanField"
  const columnName = "Boolean Column"

  await addBooleanColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  await page.getByRole("switch", { name: "True False" }).click()
  await page.getByRole("switch", { name: "True False" }).click()

  await page.locator("html").click()
  await page.locator("html").click()

  expect(
    await page.getByRole("switch", { name: "True False" }).isChecked()
  ).toBe(false)
})

test("Add column - Boolean required validation", async ({ page }) => {
  const collectionName = "BooleanFieldRequired"
  const columnName = "Boolean with validation"

  await addBooleanColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Make this a require field?").click()
  await saveColumn({ page, columnName })

  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  // invalid
  await page.getByRole("switch", { name: "True False" }).click()
  await page.getByRole("switch", { name: "True False" }).click()

  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // valid
  await page.getByRole("switch", { name: "True False" }).click()

  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()

  expect(
    await page.getByRole("switch", { name: "True False" }).isChecked()
  ).toBe(true)
})

test("Add column - Boolean options", async ({ page }) => {
  const collectionName = "BooleanFieldOptions"
  const columnName = "Boolean with options"

  await addBooleanColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Options" }).click()
  await page.getByLabel("Default Value").click()

  await saveColumn({ page, columnName })

  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  expect(await tooltipButton.isHidden()).toBeTruthy()

  expect(
    await page.getByRole("switch", { name: "True False" }).isChecked()
  ).toBe(true)
})

test.skip("Add column - Boolean field help text", async ({ page }) => {})

test("Delete Boolean field", async ({ page }) => {
  const collectionName = "BooleanFieldDelete"
  const columnName = "Boolean Column"

  await addBooleanColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  await page
    .getByRole("cell", { name: columnName })
    .getByRole("button")
    .nth(1)
    .click()
  await page.getByRole("button", { name: "Delete" }).click()
  await page.getByRole("button", { name: "Delete" }).click()
})

test.skip("Add column - Boolean field help text", async ({ page }) => {})
