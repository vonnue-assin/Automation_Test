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

test.describe("Inventory page — product navigation", () => {
  test("clicking a product name navigates to its details page", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.clickProductByName("Sauce Labs Backpack");

    await expect(page).toHaveURL(/inventory-item\.html\?id=\d+/);
  });

  test("product details page shows correct title, description, and price", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);

    // Capture the price shown on the inventory list before navigating,
    // so we can confirm it matches on the details page.
    const listedItem = page.locator(inventoryPage.inventoryItems, {
      hasText: "Sauce Labs Bike Light",
    });
    const listedPrice = await listedItem
      .locator(inventoryPage.inventoryItemPrices)
      .textContent();

    await inventoryPage.clickProductByName("Sauce Labs Bike Light");

    // Title
    await expect(page.locator(inventoryPage.detailsName)).toHaveText(
      "Sauce Labs Bike Light",
    );

    // Description — just confirm it's present and non-empty
    await expect(page.locator(inventoryPage.detailsDesc)).not.toBeEmpty();

    // Price — confirm it's shown and matches the listed price
    await expect(page.locator(inventoryPage.detailsPrice)).toHaveText(
      listedPrice,
    );
  });

  test("clicking 'Back to products' returns to the inventory page", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.clickProductByName("Sauce Labs Backpack");
    await expect(page).toHaveURL(/inventory-item\.html\?id=\d+/);

    await inventoryPage.clickBackToProducts();

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await expect(page.locator(inventoryPage.pageTitle)).toHaveText("Products");
  });

  test("add to cart button is visible and adds product from details page", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.clickProductByName("Sauce Labs Backpack");

    // Button should be visible before clicking
    await expect(inventoryPage.getDetailsAddToCartButton()).toBeVisible();

    await inventoryPage.addToCartFromDetails();

    // Cart badge should now show 1
    await expect(inventoryPage.getCartBadge()).toBeVisible();
    await expect(inventoryPage.getCartBadge()).toHaveText("1");

    // Button should switch to "Remove" after adding
    await expect(inventoryPage.getDetailsRemoveButton()).toBeVisible();

    // Confirm the product actually shows up in the cart
    await page.locator(inventoryPage.cartIcon).click();
    await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
    await expect(page.locator(".cart_item")).toContainText(
      "Sauce Labs Backpack",
    );
  });

  test("cart badge count increments correctly when adding from details page", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);

    // No badge should be visible before anything is added
    await expect(page.locator(inventoryPage.cartBadge)).not.toBeVisible();

    // Add first product from its details page
    await inventoryPage.clickProductByName("Sauce Labs Backpack");
    await inventoryPage.addToCartFromDetails();
    await expect(inventoryPage.getCartBadge()).toHaveText("1");

    // Go back and add a second product from its details page
    await inventoryPage.clickBackToProducts();
    await inventoryPage.clickProductByName("Sauce Labs Bike Light");
    await inventoryPage.addToCartFromDetails();
    await expect(inventoryPage.getCartBadge()).toHaveText("2");
  });
});

test.describe("Inventory page — sidebar navigation", () => {
  test("'All Items' link keeps user on the inventory page", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openMenu();
    await inventoryPage.clickAllItems();

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await expect(page.locator(inventoryPage.pageTitle)).toHaveText("Products");
  });

  test("'Logout' link navigates back to the login page", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openMenu();
    await inventoryPage.clickLogout();

    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await expect(page.locator("#login-button")).toBeVisible();
  });

  test("'Reset App State' clears the cart without navigating away", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);

    // Add an item first so there's something to reset
    await inventoryPage.addProductToCartByName("Sauce Labs Backpack");
    await expect(inventoryPage.getCartBadge()).toHaveText("1");

    await inventoryPage.openMenu();
    await inventoryPage.clickResetAppState();
    await inventoryPage.closeMenu();

    // Cart badge should be gone, and we should still be on the inventory page
    await expect(page.locator(inventoryPage.cartBadge)).not.toBeVisible();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  });

  test("'About' link navigates to the Sauce Labs site", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openMenu();
    await inventoryPage.clickAbout();

    // "About" navigates away to an external site (not SauceDemo itself)
    await expect(page).toHaveURL(/saucelabs\.com/);
  });
});