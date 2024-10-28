import { expect, type Page, test } from "@playwright/test"

import { addColumn, saveColumn } from "../helpers.e2e"

async function addPrivateNumberColumn({
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
    columnType: "Private Number",
    fieldId: "num",
  })
}

test("Add column - PrivateNumber required", async ({ page }) => {
  const collectionName = "PrivateNumberRequired"
  const columnName = "PrivateNumber Column"

  await addPrivateNumberColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Make this a require field?").click()
  await saveColumn({ page, columnName })

  const privateNumberInput = page.locator('input[type="password"]')

  // Invalid
  await privateNumberInput.click()
  await privateNumberInput.fill("")
  await privateNumberInput.press("Enter")

  await page.waitForTimeout(1000)

  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // Valid
  await privateNumberInput.click()
  await privateNumberInput.fill("99")
  await privateNumberInput.press("Enter")

  await page.waitForTimeout(1000)

  expect(await privateNumberInput.inputValue()).toBe("99")
})

test("Add column - PrivateNumber min value", async ({ page }) => {
  const collectionName = "PrivateNumberMinValue"
  const columnName = "PrivateNumber Column"

  await addPrivateNumberColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Min Number").click()
  await page.getByLabel("Min Number").fill("10")
  await saveColumn({ page, columnName })

  const privateNumberInput = page.locator('input[type="password"]')

  // Invalid
  await privateNumberInput.click()
  await privateNumberInput.fill("1")
  await privateNumberInput.press("Enter")

  await page.waitForTimeout(1000)

  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // Valid
  await privateNumberInput.click()
  await privateNumberInput.fill("99")
  await privateNumberInput.press("Enter")

  await page.waitForTimeout(1000)

  expect(await privateNumberInput.inputValue()).toBe("99")
})

test("Add column - PrivateNumber max value", async ({ page }) => {
  const collectionName = "PrivateNumberMaxValue"
  const columnName = "PrivateNumber Column"

  await addPrivateNumberColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Max Number").click()
  await page.getByLabel("Max Number").fill("10")
  await saveColumn({ page, columnName })

  const privateNumberInput = page.locator('input[type="password"]')

  // Invalid
  await privateNumberInput.click()
  await privateNumberInput.fill("11")
  await privateNumberInput.press("Enter")

  await page.waitForTimeout(1000)

  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // Valid
  await privateNumberInput.click()
  await privateNumberInput.fill("99")
  await privateNumberInput.press("Enter")

  await page.waitForTimeout(1000)

  expect(await privateNumberInput.inputValue()).toBe("99")
})

test("Add column - PrivateNumber options", async ({ page }) => {
  const collectionName = "PrivateNumberOptions"
  const columnName = "PrivateNumber Column"

  await addPrivateNumberColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Options" }).click()
  await page.getByLabel("Default Value").click()
  await page.getByLabel("Default Value").fill("99")

  await saveColumn({ page, columnName })

  expect(await page.locator('input[type="password"]').inputValue()).toBe("99")
})

test.skip("Add column - PrivateNumber field help text", async ({ page }) => {})

test("Delete PrivateNumber field", async ({ page }) => {
  const collectionName = "PrivateNumberFieldDelete"
  const columnName = "PrivateNumber Column"

  await addPrivateNumberColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  await page
    .getByRole("cell", { name: columnName })
    .getByRole("button")
    .nth(1)
    .click()
  await page.getByRole("button", { name: "Delete" }).click()
  await page.getByRole("button", { name: "Delete" }).click()
})
