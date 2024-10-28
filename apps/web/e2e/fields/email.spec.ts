import { expect, type Page, test } from "@playwright/test"

import { addColumn, fillTextField, saveColumn } from "../helpers.e2e"

async function addEmailColumn({
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
    columnType: "Email",
    fieldId: "email",
  })
}

test("Add column - Email field", async ({ page }) => {
  const collectionName = "EmailField"
  const columnName = "Email Column"

  await addEmailColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  const element = page.getByRole("textbox").nth(1)
  const content = "test@example.com"
  await fillTextField({ element, content })

  await page.waitForTimeout(1000)

  expect(await element.inputValue()).toBe(content)
})

test("Add column - Email is not valid email", async ({ page }) => {
  const collectionName = "EmailFieldInvalid"
  const columnName = "Email Column"

  await addEmailColumn({ page, collectionName, columnName })
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
    content: "test@",
  })

  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // valid
  await fillTextField({
    element,
    content: "test@example.com",
  })

  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()

  expect(await element.inputValue()).toBe("test@example.com")
})

test("Add column - Email required validation", async ({ page }) => {
  const collectionName = "EmailFieldRequired"
  const columnName = "Email Column"

  await addEmailColumn({ page, collectionName, columnName })
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
    content: "test@example.com",
  })

  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()

  expect(await element.inputValue()).toBe("test@example.com")
})

test("Add column - Email disallow validation", async ({ page }) => {
  const collectionName = "EmailFieldDisallow"
  const columnName = "Email Column"
  const invalid = `_`

  await addEmailColumn({
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
    content: `te${invalid}st@example.com`,
  })
  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // valid
  await fillTextField({
    element,
    content: "test@example.com",
  })

  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()

  expect(await element.inputValue()).toBe("test@example.com")
})

test("Add column - Email blacklist validation", async ({ page }) => {
  const collectionName = "EmailFieldBlacklist"
  const columnName = "Email Column"
  const blacklist = `blacklist.com`

  await addEmailColumn({
    page,
    collectionName,
    columnName,
  })
  await page.getByRole("tab", { name: "Validation" }).click()
  await page.getByTestId("blacklist").getByLabel("").click()
  await page.getByTestId("blacklist").getByLabel("").fill(blacklist)
  await saveColumn({ page, columnName })

  const element = page.getByRole("textbox").nth(1)
  const tooltipButton = page
    .getByRole("row", { name: "Select row" })
    .getByRole("button")
    .nth(2)

  // invalid
  await fillTextField({
    element,
    content: blacklist,
  })
  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // valid
  await fillTextField({
    element,
    content: "test@example.com",
  })

  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()

  expect(await element.inputValue()).toBe("test@example.com")
})

test("Add column - Email field options", async ({ page }) => {
  const collectionName = "EmailFieldOptions"
  const columnName = "Email Column"
  const defaultValue = "test@example.com"

  await addEmailColumn({ page, collectionName, columnName })
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

test.skip("Add column - Email field help text", async ({ page }) => {})

test("Delete Email field", async ({ page }) => {
  const collectionName = "EmailFieldDelete"
  const columnName = "Email Column"

  await addEmailColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  await page
    .getByRole("cell", { name: columnName })
    .getByRole("button")
    .nth(1)
    .click()
  await page.getByRole("button", { name: "Delete" }).click()
  await page.getByRole("button", { name: "Delete" }).click()
})
