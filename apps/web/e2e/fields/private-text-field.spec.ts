import { expect, type Page, test } from "@playwright/test"

import { addColumn, fillTextField, saveColumn } from "../helpers.e2e"

async function addPrivateTextColumn({
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
    columnType: "Private Text",
    fieldId: "text",
  })
}

test("Add column - PrivateText field", async ({ page }) => {
  const collectionName = "PrivateTextField"
  const columnName = "PrivateText Column"

  await addPrivateTextColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  const element = page.locator('input[type="password"]')
  const content = "this has text"
  await fillTextField({ element, content })

  await page.waitForTimeout(1000)

  expect(await element.inputValue()).toBe(content)
})

test("Add column - PrivateText disallow validation", async ({ page }) => {
  const collectionName = "PrivateTextFieldDisallow"
  const columnName = "PrivateText Column"
  const invalid = `/`

  await addPrivateTextColumn({
    page,
    collectionName,
    columnName,
  })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Disallow characters").click()
  await page.getByLabel("Disallow characters").fill(invalid)
  await saveColumn({ page, columnName })

  await page.locator('input[type="text"]').fill("slug")
  await page.locator('input[type="text"]').press("Enter")
  await page.waitForTimeout(1000)

  const element = page.locator('input[type="password"]')
  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  // invalid
  await fillTextField({
    element,
    content: `this is invalid ${invalid}`,
  })
  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // valid
  await fillTextField({
    element,
    content: "This works",
  })

  await page.waitForTimeout(1000)

  expect(await element.inputValue()).toBe("This works")
})

test("Add column - PrivateText required validation", async ({ page }) => {
  const collectionName = "PrivateTextFieldRequired"
  const columnName = "PrivateText Column"

  await addPrivateTextColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Make this a require field?").click()
  await saveColumn({ page, columnName })

  await page.locator('input[type="text"]').fill("slug")
  await page.locator('input[type="text"]').press("Enter")
  await page.waitForTimeout(1000)

  const element = page.locator('input[type="password"]')

  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  // invalid
  await fillTextField({
    element,
    content: "",
  })

  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // valid
  await fillTextField({
    element,
    content: "This works",
  })

  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()

  expect(await element.inputValue()).toBe("This works")
})

test("Add column - PrivateText min length validation", async ({ page }) => {
  const collectionName = "PrivateTextFieldMinLength"
  const columnName = "PrivateText Column"

  await addPrivateTextColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Min Length").fill("3")
  await saveColumn({ page, columnName })

  await page.locator('input[type="text"]').fill("slug")
  await page.locator('input[type="text"]').press("Enter")
  await page.waitForTimeout(1000)

  const element = page.locator('input[type="password"]')
  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  // invalid
  await fillTextField({
    element,
    content: "hi",
  })

  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // valid
  await fillTextField({
    element,
    content: "This works",
  })

  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()

  expect(await element.inputValue()).toBe("This works")
})

test("Add column - PrivateText max length validation", async ({ page }) => {
  const collectionName = "PrivateTextFieldMaxLength"
  const columnName = "PrivateText Column"

  await addPrivateTextColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Max Length").fill("5")
  await saveColumn({ page, columnName })

  await page.locator('input[type="text"]').fill("slug")
  await page.locator('input[type="text"]').press("Enter")
  await page.waitForTimeout(1000)

  const element = page.locator('input[type="password"]')
  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  // invalid
  await fillTextField({
    element,
    content: "Too long",
  })

  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // valid
  await fillTextField({
    element,
    content: "works",
  })

  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()

  expect(await element.inputValue()).toBe("works")
})

test("Add column - PrivateText field options", async ({ page }) => {
  const collectionName = "PrivateTextFieldOptions"
  const columnName = "PrivateText Column"
  const defaultValue = "default text"

  await addPrivateTextColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Options" }).click()
  await page.getByLabel("Default Value").click()
  await page.getByLabel("Default Value").fill(defaultValue)
  await saveColumn({ page, columnName })

  expect(
    await page
      .getByRole("cell", { name: defaultValue })
      .getByRole("textbox")
      .inputValue()
  ).toBe(defaultValue)
})

test.skip("Add column - PrivateText field help text", async ({ page }) => {})

test("Delete PrivateText field", async ({ page }) => {
  const collectionName = "PrivateTextFieldDelete"
  const columnName = "PrivateText Column"

  await addPrivateTextColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  await page
    .getByRole("cell", { name: columnName })
    .getByRole("button")
    .nth(1)
    .click()
  await page.getByRole("button", { name: "Delete" }).click()
  await page.getByRole("button", { name: "Delete" }).click()
})
