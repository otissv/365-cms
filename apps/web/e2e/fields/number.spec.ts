import { expect, type Page, test } from "@playwright/test"

import { addColumn, saveColumn } from "../helpers.e2e"

async function addNumberColumn({
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
    columnType: "Number",
    fieldId: "num",
  })
}

test("Add column - Number default", async ({ page }) => {
  const collectionName = "NumberField"
  const columnName = "Number Column"

  await addNumberColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  const numberInput = page.getByRole("spinbutton")

  await numberInput.click()
  await numberInput.fill("99")
  await numberInput.press("Enter")

  await page.waitForTimeout(1000)

  expect(await numberInput.inputValue()).toBe("99")
})

test("Add column - Number required", async ({ page }) => {
  const collectionName = "NumberRequired"
  const columnName = "Number Column"

  await addNumberColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Make this a require field?").click()
  await saveColumn({ page, columnName })

  const numberInput = page.getByRole("spinbutton")

  // Invalid
  await numberInput.click()
  await numberInput.fill("")
  await numberInput.press("Enter")

  await page.waitForTimeout(1000)

  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // Valid
  await numberInput.click()
  await numberInput.fill("99")
  await numberInput.press("Enter")

  await page.waitForTimeout(1000)

  expect(await page.getByRole("spinbutton").inputValue()).toBe("99")
})

test("Add column - Number min value", async ({ page }) => {
  const collectionName = "NumberMinValue"
  const columnName = "Number Column"

  await addNumberColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Min Number").click()
  await page.getByLabel("Min Number").fill("10")
  await saveColumn({ page, columnName })

  const numberInput = page.getByRole("spinbutton")

  // Invalid
  await numberInput.click()
  await numberInput.fill("1")
  await numberInput.press("Enter")

  await page.waitForTimeout(1000)

  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // Valid
  await numberInput.click()
  await numberInput.fill("99")
  await numberInput.press("Enter")

  await page.waitForTimeout(1000)

  expect(await page.getByRole("spinbutton").inputValue()).toBe("99")
})

test("Add column - Number max value", async ({ page }) => {
  const collectionName = "NumberMaxValue"
  const columnName = "Number Column"

  await addNumberColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Max Number").click()
  await page.getByLabel("Max Number").fill("10")
  await saveColumn({ page, columnName })

  const numberInput = page.getByRole("spinbutton")

  // Invalid
  await numberInput.click()
  await numberInput.fill("11")
  await numberInput.press("Enter")

  await page.waitForTimeout(1000)

  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // Valid
  await numberInput.click()
  await numberInput.fill("99")
  await numberInput.press("Enter")

  await page.waitForTimeout(1000)

  expect(await page.getByRole("spinbutton").inputValue()).toBe("99")
})

test("Add column - Number options", async ({ page }) => {
  const collectionName = "NumberOptions"
  const columnName = "Number Column"

  await addNumberColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Options" }).click()
  await page.getByLabel("Default Value").click()
  await page.getByLabel("Default Value").fill("99")

  await saveColumn({ page, columnName })

  expect(await page.getByRole("spinbutton").inputValue()).toBe("99")
})

test.skip("Add column - Number field help text", async ({ page }) => {})

test("Delete Number field", async ({ page }) => {
  const collectionName = "NumberFieldDelete"
  const columnName = "Number Column"

  await addNumberColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  await page
    .getByRole("cell", { name: columnName })
    .getByRole("button")
    .nth(1)
    .click()
  await page.getByRole("button", { name: "Delete" }).click()
  await page.getByRole("button", { name: "Delete" }).click()
})
