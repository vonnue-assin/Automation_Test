const { test, expect } = require("@playwright/test");
const { LoginPage } = require("./Login");
const { InventoryPage } = require("./Inventory");

// Shared login step — inventory page requires an authenticated session
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});

test.describe("Inventory page — header and footer UI", () => {
  test("header elements are visible", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await expect(page.locator(inventoryPage.appLogo)).toBeVisible();
    await expect(page.locator(inventoryPage.pageTitle)).toHaveText("Products");
    await expect(page.locator(inventoryPage.cartIcon)).toBeVisible();
    await expect(page.locator(inventoryPage.menuButton)).toBeVisible();
  });

  test("hamburger menu opens and closes", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await page.locator(inventoryPage.menuButton).click();
    await expect(page.locator("#logout_sidebar_link")).toBeVisible();

    await page.locator(inventoryPage.menuCloseButton).click();
    await expect(page.locator("#logout_sidebar_link")).not.toBeVisible();
  });

  test("footer is visible with expected content", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await expect(page.locator(inventoryPage.footer)).toBeVisible();
    await expect(page.locator(inventoryPage.footerCopy)).toContainText(
      "Sauce Labs",
    );

    await expect(page.locator(inventoryPage.twitterLink)).toBeVisible();
    await expect(page.locator(inventoryPage.facebookLink)).toBeVisible();
    await expect(page.locator(inventoryPage.linkedinLink)).toBeVisible();
  });
});

test.describe("Inventory page — sorting", () => {
  test("sort products name A to Z", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy("az");
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));

    expect(names).toEqual(sorted);
  });

  test("sort products name Z to A", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy("za");
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));

    expect(names).toEqual(sorted);
  });

  test("sort products price low to high", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy("lohi");
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sorted);
  });

  test("sort products price high to low", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy("hilo");
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);

    expect(prices).toEqual(sorted);
  });
});

test.describe("Inventory page — add/remove from cart", () => {
  test("add a single product to cart updates badge", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCartByName("Sauce Labs Backpack");

    await expect(inventoryPage.getCartBadge()).toBeVisible();
    await expect(inventoryPage.getCartBadge()).toHaveText("1");
  });

  test("remove a product from cart updates badge", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCartByName("Sauce Labs Backpack");
    await expect(inventoryPage.getCartBadge()).toHaveText("1");

    await inventoryPage.removeProductFromCartByName("Sauce Labs Backpack");
    await expect(page.locator(inventoryPage.cartBadge)).not.toBeVisible();
  });

  test("add multiple products increments badge correctly", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCartByName("Sauce Labs Backpack");
    await inventoryPage.addProductToCartByName("Sauce Labs Bike Light");
    await inventoryPage.addProductToCartByName("Sauce Labs Bolt T-Shirt");

    await expect(inventoryPage.getCartBadge()).toHaveText("3");
  });

  test("removing one of multiple products decrements badge", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCartByName("Sauce Labs Backpack");
    await inventoryPage.addProductToCartByName("Sauce Labs Bike Light");
    await expect(inventoryPage.getCartBadge()).toHaveText("2");

    await inventoryPage.removeProductFromCartByName("Sauce Labs Backpack");
    await expect(inventoryPage.getCartBadge()).toHaveText("1");
  });

  test("added product persists in cart page", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCartByName("Sauce Labs Backpack");
    await page.locator(inventoryPage.cartIcon).click();

    await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
    await expect(page.locator(".cart_item")).toContainText(
      "Sauce Labs Backpack",
    );
  });
});
