class InventoryPage {
  constructor(page) {
    this.page = page;

    // Header
    this.appLogo = ".app_logo";
    this.cartIcon = ".shopping_cart_link";
    this.cartBadge = ".shopping_cart_badge";
    this.menuButton = "#react-burger-menu-btn";
    this.menuCloseButton = "#react-burger-cross-btn";

    // Sidebar navigation links
    this.allItemsLink = "#inventory_sidebar_link";
    this.aboutLink = "#about_sidebar_link";
    this.logoutLink = "#logout_sidebar_link";
    this.resetAppStateLink = "#reset_sidebar_link";
    this.pageTitle = ".title";

    // Sorting
    this.sortDropdown = ".product_sort_container";
    this.inventoryItemNames = ".inventory_item_name";
    this.inventoryItemPrices = ".inventory_item_price";

    // Products / cart
    this.inventoryItems = ".inventory_item";
    this.addToCartButtons = 'button[id^="add-to-cart-"]';
    this.removeButtons = 'button[id^="remove-"]';

    // Product details page
    this.detailsName = ".inventory_details_name";
    this.detailsDesc = ".inventory_details_desc";
    this.detailsPrice = ".inventory_details_price";
    this.detailsImg = ".inventory_details_img";
    this.backToProductsButton = 'button:has-text("Back to products")';
    this.detailsAddToCartButton = 'button:has-text("Add to cart")';
    this.detailsRemoveButton = 'button:has-text("Remove")';

    // Footer
    this.footer = ".footer";
    this.footerCopy = ".footer_copy";
    this.twitterLink = ".social_x a";
    this.facebookLink = ".social_facebook a";
    this.linkedinLink = ".social_linkedin a";
  }

  async goto() {
    await this.page.goto("https://www.saucedemo.com/inventory.html");
  }

  async openMenu() {
    await this.page.click(this.menuButton);
  }

  async closeMenu() {
    await this.page.click(this.menuCloseButton);
  }

  async clickAllItems() {
    await this.page.click(this.allItemsLink);
  }

  async clickAbout() {
    await this.page.click(this.aboutLink);
  }

  async clickLogout() {
    await this.page.click(this.logoutLink);
  }

  async clickResetAppState() {
    await this.page.click(this.resetAppStateLink);
  }

  async sortBy(optionValue) {
    // Valid values on SauceDemo: "az", "za", "lohi", "hilo"
    await this.page.selectOption(this.sortDropdown, optionValue);
  }

  async getProductNames() {
    return this.page.locator(this.inventoryItemNames).allTextContents();
  }

  async getProductPrices() {
    const priceTexts = await this.page
      .locator(this.inventoryItemPrices)
      .allTextContents();
    return priceTexts.map((price) => parseFloat(price.replace("$", "")));
  }

  async clickProductByName(productName) {
    const item = this.page.locator(this.inventoryItems, {
      hasText: productName,
    });
    await item.locator(this.inventoryItemNames).click();
  }

  async clickBackToProducts() {
    await this.page.click(this.backToProductsButton);
  }

  getDetailsAddToCartButton() {
    return this.page.locator(this.detailsAddToCartButton);
  }

  async addToCartFromDetails() {
    await this.page.click(this.detailsAddToCartButton);
  }

  getDetailsRemoveButton() {
    return this.page.locator(this.detailsRemoveButton);
  }

  async addProductToCartByName(productName) {
    const item = this.page.locator(this.inventoryItems, {
      hasText: productName,
    });
    await item.locator('button:has-text("Add to cart")').click();
  }

  async removeProductFromCartByName(productName) {
    const item = this.page.locator(this.inventoryItems, {
      hasText: productName,
    });
    await item.locator('button:has-text("Remove")').click();
  }

  getCartBadge() {
    return this.page.locator(this.cartBadge);
  }
}

module.exports = { InventoryPage };
