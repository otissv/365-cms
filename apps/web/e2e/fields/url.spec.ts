import { expect, type Page, test } from "@playwright/test"

import { addColumn, fillTextField, saveColumn } from "../helpers.e2e"

async function addURLColumn({
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
    columnType: "URL",
    fieldId: "email",
  })
}

test("Add column - URL field", async ({ page }) => {
  const collectionName = "URLField"
  const columnName = "URL Column"

  await addURLColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  const element = page.getByRole("textbox").nth(1)
  const content = "http://example.com"
  await fillTextField({ element, content })

  await page.waitForTimeout(1000)

  expect(await element.inputValue()).toBe(content)
})

test("Add column - URL is not valid email", async ({ page }) => {
  const collectionName = "URLFieldInvalid"
  const columnName = "URL Column"

  await addURLColumn({ page, collectionName, columnName })
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
    content: "notUrl@example.com",
  })

  await tooltipButton.waitFor()
  expect(await tooltipButton).toBeTruthy()

  // valid
  await fillTextField({
    element,
    content: "http://example.com",
  })

  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()

  // expect(await element.inputValue()).toBe("example.com")
})

test("Add column - URL required validation", async ({ page }) => {
  const collectionName = "URLFieldRequired"
  const columnName = "URL Column"

  await addURLColumn({ page, collectionName, columnName })
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
    content: "http://example.com",
  })

  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()

  expect(await element.inputValue()).toBe("http://example.com")
})

test("Add column - URL disallow validation", async ({ page }) => {
  const collectionName = "URLFieldDisallow"
  const columnName = "URL Column"
  const invalid = `_`

  await addURLColumn({
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
    content: "http://example.com",
  })

  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()

  expect(await element.inputValue()).toBe("http://example.com")
})

test("Add column - URL blacklist validation", async ({ page }) => {
  const collectionName = "URLFieldBlacklist"
  const columnName = "URL Column"
  const blacklist = `blacklist.com`

  await addURLColumn({
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
    content: "http://example.com",
  })

  await page.waitForTimeout(1000)

  expect(await tooltipButton.isHidden()).toBeTruthy()

  expect(await element.inputValue()).toBe("http://example.com")
})

test("Add column - URL field options", async ({ page }) => {
  const collectionName = "URLFieldOptions"
  const columnName = "URL Column"
  const defaultValue = "example.com"

  await addURLColumn({ page, collectionName, columnName })
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

test.skip("Add column - URL field help text", async ({ page }) => {})

test("Delete URL field", async ({ page }) => {
  const collectionName = "URLFieldDelete"
  const columnName = "URL Column"

  await addURLColumn({ page, collectionName, columnName })
  await saveColumn({ page, columnName })

  await page
    .getByRole("cell", { name: columnName })
    .getByRole("button")
    .nth(1)
    .click()
  await page.getByRole("button", { name: "Delete" }).click()
  await page.getByRole("button", { name: "Delete" }).click()
})
