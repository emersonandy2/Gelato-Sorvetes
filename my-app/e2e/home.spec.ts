import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Gelato/);
  });

  test("displays hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Os Melhores")).toBeVisible();
  });

  test("navigates to catalog", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Cardápio");
    await expect(page).toHaveURL(/\/catalog/);
  });

  test("toggles dark mode", async ({ page }) => {
    await page.goto("/");
    const themeButton = page.getByLabel(/Alternar tema|Mudar para/);
    await themeButton.click();
    // Check that the theme attribute changed
    await expect(page.locator("html")).toHaveAttribute("class", /dark/);
  });
});

test.describe("Catalog Page", () => {
  test("loads catalog page", async ({ page }) => {
    await page.goto("/catalog");
    await expect(page.locator("h1")).toContainText("Cardápio");
  });

  test("displays search input", async ({ page }) => {
    await page.goto("/catalog");
    await expect(page.getByPlaceholder("Buscar produtos...")).toBeVisible();
  });
});

test.describe("Login Page", () => {
  test("loads login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=Entrar")).toBeVisible();
  });

  test("displays email input", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel("Email")).toBeVisible();
  });
});

test.describe("Admin Login", () => {
  test("loads admin login page", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("text=Admin Login")).toBeVisible();
  });
});
