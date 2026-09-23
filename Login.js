class LoginPage {
  constructor(page) {
    this.page = page;

    this.usernameInput = "#user-name";
    this.passwordInput = "#password";
    this.loginButton = "#login-button";
    this.pageTitle = ".title";
    this.appLogo = ".app_logo";
    this.cartIcon = ".shopping_cart_link";
    this.menuButton = ".bm-burger-button";
    this.errorMessage = '[data-test="error"]';
  }

  async goto() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async login(username, password) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  getErrorLocator() {
    return this.page.locator(this.errorMessage);
  }
}

module.exports = { LoginPage };