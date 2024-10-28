import { expect, type Locator, type Page, test } from "@playwright/test"

import { addColumn, fillTextField, saveColumn } from "../helpers.e2e"

async function fillTextarea({
  content,
  page,
  element,
}: {
  page: Page
  content: string
  element: Locator
}) {
  await element.click()
  await page.waitForTimeout(1000)

  await page.locator("textarea").click()
  await page.locator("textarea").fill(content)
}

async function addParagraphColumn({
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
    columnType: "Paragraph",
    fieldId: "text",
  })
}

test("Add column - Paragraph field", async ({ page }) => {
  const collectionName = "ParagraphField"
  const columnName = "Paragraph Column"

  await addParagraphColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  const element = page.getByRole("textbox").nth(1)
  const content = "this is content"

  await fillTextarea({
    page,
    content,
    element,
  })
  await page.locator("html").click()
  await page.waitForTimeout(1000)

  element
})

test("Add column - Paragraph disallow validation", async ({ page }) => {
  const collectionName = "ParagraphFieldDisallow"
  const columnName = "Paragraph Column"
  const invalid = `/`

  await addParagraphColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Disallow characters").click()
  await page.getByLabel("Disallow characters").fill(invalid)
  await saveColumn({ page, columnName })

  const element = page.getByRole("textbox").nth(1)
  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  // invalid
  await fillTextarea({
    page,
    content: invalid,
    element,
  })
  await page.locator("html").click()
  await page.waitForTimeout(1000)

  expect(await tooltipButton).toBeTruthy()

  // valid
  await fillTextarea({
    page,
    content: "This works",
    element,
  })
  await page.locator("html").click()
  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()
  expect(await element.inputValue()).toBe("This works")
})

test("Add column - Paragraph required validation", async ({ page }) => {
  const collectionName = "ParagraphFieldRequired"
  const columnName = "Paragraph Column"

  await addParagraphColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Make this a require field?").click()
  await saveColumn({ page, columnName })

  const element = page.getByRole("textbox").nth(1)

  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  // invalid
  await fillTextarea({
    page,
    content: "",
    element,
  })
  await page.locator("html").click()
  await page.waitForTimeout(1000)

  expect(await tooltipButton).toBeTruthy()

  // valid
  await fillTextarea({
    page,
    content: "This works",
    element,
  })
  await page.locator("html").click()
  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()
  expect(await element.inputValue()).toBe("This works")
})

test("Add column - Paragraph min length validation", async ({ page }) => {
  const collectionName = "ParagraphFieldMinLength"
  const columnName = "Paragraph Column"

  await addParagraphColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Min Length").fill("3")
  await saveColumn({ page, columnName })

  const element = page.getByRole("textbox").nth(1)
  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  // invalid
  await fillTextarea({
    page,
    content: "hi",
    element,
  })
  await page.locator("html").click()
  await page.waitForTimeout(1000)

  expect(await tooltipButton).toBeTruthy()

  // valid
  await fillTextarea({
    page,
    content: "This works",
    element,
  })
  await page.locator("html").click()
  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()
  expect(await element.inputValue()).toBe("This works")
})

test("Add column - Paragraph max length validation", async ({ page }) => {
  const collectionName = "ParagraphFieldMaxLength"
  const columnName = "Paragraph Column"

  await addParagraphColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Max Length").fill("5")
  await saveColumn({ page, columnName })

  const element = page.getByRole("textbox").nth(1)
  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  // invalid
  await fillTextarea({
    page,
    content: "too long",
    element,
  })
  await page.locator("html").click()
  await page.waitForTimeout(1000)

  expect(await tooltipButton).toBeTruthy()

  // valid
  await fillTextarea({
    page,
    content: "works",
    element,
  })
  await page.locator("html").click()
  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()
  expect(await element.inputValue()).toBe("works")
})

test("Add column - Paragraph field options", async ({ page }) => {
  const collectionName = "ParagraphFieldOptions"
  const columnName = "Paragraph Column"
  const defaultValue = "default text"

  await addParagraphColumn({ page, collectionName, columnName })
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

test.skip("Add column - Paragraph field help text", async ({ page }) => {})

test("Delete Paragraph field", async ({ page }) => {
  const collectionName = "ParagraphFieldDelete"
  const columnName = "Paragraph Column"

  await addParagraphColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  await page
    .getByRole("cell", { name: columnName })
    .getByRole("button")
    .nth(1)
    .click()
  await page.getByRole("button", { name: "Delete" }).click()
  await page.getByRole("button", { name: "Delete" }).click()
})
