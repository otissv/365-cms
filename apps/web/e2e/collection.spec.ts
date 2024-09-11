import { expect, test } from "@playwright/test"

const collectionName = "testing"

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/collections/testing")
})

test("Collection page has heading", async ({ page }) => {
  expect(page.locator("h1")).toContainText(collectionName)

  const breadcrumbs = await page.getByLabel("Breadcrumb")

  expect(await breadcrumbs.innerText()).toContain("testing collection")
})
