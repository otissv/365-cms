import { expect, type Page, test } from "@playwright/test"

import { addColumn, fillTextField, saveColumn } from "../helpers.e2e"

async function addTextColumn({
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
    columnType: "Text",
    fieldId: "text",
  })
}

test("Add column - Text field", async ({ page }) => {
  const collectionName = "TextField"
  const columnName = "Text Column"

  await addTextColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  const element = page.getByRole("textbox").nth(1)
  const content = "this has text"
  await fillTextField({ element, content })

  await page.waitForTimeout(1000)

  expect(await element.inputValue()).toBe(content)
})

test("Add column - Text disallow validation", async ({ page }) => {
  const collectionName = "TextFieldDisallow"
  const columnName = "Text Column"
  const invalid = `/`

  await addTextColumn({
    page,
    collectionName,
    columnName,
  })
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

  expect(await tooltipButton.isHidden()).toBeTruthy()

  expect(await element.inputValue()).toBe("This works")
})

test("Add column - Text required validation", async ({ page }) => {
  const collectionName = "TextFieldRequired"
  const columnName = "Text Column"

  await addTextColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Make this a require field?").click()
  await saveColumn({ page, columnName })

  const element = page.getByRole("textbox").nth(1)

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

test("Add column - Text min length validation", async ({ page }) => {
  const collectionName = "TextFieldMinLength"
  const columnName = "Text Column"

  await addTextColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Min Length").fill("3")
  await saveColumn({ page, columnName })

  const element = page.getByRole("textbox").nth(1)
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

test("Add column - Text max length validation", async ({ page }) => {
  const collectionName = "TextFieldMaxLength"
  const columnName = "Text Column"

  await addTextColumn({ page, collectionName, columnName })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByLabel("Max Length").fill("5")
  await saveColumn({ page, columnName })

  const element = page.getByRole("textbox").nth(1)
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

test("Add column - Text field options", async ({ page }) => {
  const collectionName = "TextFieldOptions"
  const columnName = "Text Column"
  const defaultValue = "default text"

  await addTextColumn({ page, collectionName, columnName })
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

test.skip("Add column - Text field help text", async ({ page }) => {
  const collectionName = "TextFieldWithHelp"
  const columnName = "Text Column"
  const helpText = "This is help text"

  await addTextColumn({ page, collectionName, columnName })
  await page.getByLabel("Help text(optional)").click()
  await page.getByLabel("Help text(optional)").fill(helpText)
  await saveColumn({ page, columnName })

  await page
    .getByRole("cell", { name: "Text with help Column" })
    .getByRole("button")
    .first()
    .dispatchEvent("mouseover")

  await page
    .getByRole("cell", { name: "Text with help Column" })
    .getByRole("button")
    .first()
    .waitFor()
  await page.getByText("This is help text").first().click()
})

test("Delete Text field", async ({ page }) => {
  const collectionName = "TextFieldDelete"
  const columnName = "Text Column"

  await addTextColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  await page
    .getByRole("cell", { name: columnName })
    .getByRole("button")
    .nth(1)
    .click()
  await page.getByRole("button", { name: "Delete" }).click()
  await page.getByRole("button", { name: "Delete" }).click()
})
