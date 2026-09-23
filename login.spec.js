const { test, expect } = require("@playwright/test");
const { LoginPage } = require("./Login");

// Positive test case for login functionality

test("login works with valid credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");

  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});

// Negative test case for login functionality

test("error message shown for invalid login", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("wrong_user", "wrong_password");

  const errorMessage = loginPage.getErrorLocator();

  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText(
    /Epic sadface: Username and password do not match any user in this service/,
  );
});

// Data-driven login tests for multiple users

const users = [
  { username: "standard_user", password: "secret_sauce", valid: true },
  { username: "locked_out_user", password: "secret_sauce", valid: false },
  { username: "random_user", password: "secret_sauce", valid: false },
  { username: "problem_user", password: "secret_sauce", valid: true },
  {
    username: "performance_glitch_user",
    password: "secret_sauce",
    valid: true,
  },
  { username: "error_user", password: "secret_sauce", valid: true },
  { username: "visual_user", password: "secret_sauce", valid: true },
];

for (const user of users) {
  test(`login test for ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(user.username, user.password);

    if (user.valid) {
      // performance_glitch_user has a built-in ~5s delay after login,
      // so give this assertion more headroom than the default timeout.
      await expect(page).toHaveURL(/inventory/, { timeout: 10000 });
    } else {
      await expect(loginPage.getErrorLocator()).toBeVisible();
    }
  });
}

// Correct username, wrong password

test("error for correct username and wrong password", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("standard_user", "wrong_password");

  const errorMessage = loginPage.getErrorLocator();

  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(
    "Username and password do not match",
  );
});

// Correct username, empty password

test("error when password is empty", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("standard_user", "");

  const errorMessage = loginPage.getErrorLocator();

  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText("Password is required");
});

// Correct password, empty username

test("error when username is empty", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("", "secret_sauce");

  const errorMessage = loginPage.getErrorLocator();

  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText("Username is required");
});

// Incorrect username, correct password

test("error for incorrect username and correct password", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("incorrect_username", "secret_sauce");

  const errorMessage = loginPage.getErrorLocator();

  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(
    "Username and password do not match any user in this service",
  );
});

// Locked out user

test("error for locked out user", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("locked_out_user", "secret_sauce");

  const errorMessage = loginPage.getErrorLocator();

  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(
    "Sorry, this user has been locked out.",
  );
});

// Inventory page UI elements

test("inventory page UI elements are visible", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");

  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await expect(page.locator(loginPage.pageTitle)).toHaveText("Products");
  await expect(page.locator(loginPage.appLogo)).toBeVisible();
  await expect(page.locator(loginPage.cartIcon)).toBeVisible();
  await expect(page.locator(loginPage.menuButton)).toBeVisible();
});