import { expect, test } from "@playwright/test"

import { createCollection, createDocuments } from "./helpers.e2e"

test("Documents page has heading", async ({ page }) => {
  const collectionName = "docHeading"
  await createDocuments(page, collectionName)

  expect(page.locator("h1")).toContainText(collectionName)

  const breadcrumbs = await page.getByLabel("Breadcrumb")

  expect(await breadcrumbs.innerText()).toContain(
    `${collectionName} collection`
  )
})

test("Manage column visibility", async ({ page }) => {
  const collectionName = "ManageColumnVisibility"
  await createCollection(page, collectionName, "single")

  await page.getByRole("textbox").first().fill("slug")
  await page.waitForTimeout(1000)

  const slug = page.getByRole("cell", { name: "slug" }).getByRole("textbox")

  await slug.click()

  await page.getByRole("button", { name: "Manage Collection" }).click()
  await page
    .locator("#manage-collection > div > div > div > .flex > button")
    .first()
    .click()
  await page
    .locator("div:nth-child(2) > div > div > .flex > button")
    .first()
    .click()
  await page
    .locator("div:nth-child(3) > div > div > .flex > button")
    .first()
    .click()
  await page
    .locator("div:nth-child(4) > div > div > .flex > button")
    .first()
    .click()
  await page
    .locator("div:nth-child(5) > div > div > .flex > button")
    .first()
    .click()
  await page.getByRole("button", { name: "Close" }).click()

  expect(await page.getByRole("textbox").nth(0).inputValue()).toBe("1")
  expect(await page.getByRole("textbox").nth(2).inputValue()).toBe("1")

  expect(slug.isHidden()).toBeTruthy()

  // expect(
  //   page
  //     .getByTestId(testId)
  //     .getByTestId(`collection-card-title-${collectionName}`)
  // ).toContainText(collectionName)
})
