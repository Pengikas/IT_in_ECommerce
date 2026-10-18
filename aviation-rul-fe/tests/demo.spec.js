import { test, expect } from "@playwright/test";
async function login(page, role = "buyer") {
  await page.goto("/login");
  await page.getByLabel("Workspace role").selectOption(role);
  await page.locator("input[name=password]").fill("demo-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(new RegExp("/" + role + "/dashboard$"));
}
test("checkout validates, persists the order and supports supplier fulfilment", async ({
  page,
}) => {
  await page.goto("/products/prod-101");
  await page
    .getByRole("button", { name: "Add to cart", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Close cart" }).click();
  await page.reload();
  await login(page);
  await page.goto("/buyer/cart");
  await expect(
    page.getByText("CFM56-7B High-Pressure Turbine Blade Set", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Proceed to checkout" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByLabel("Business / tax ID")).toBeVisible();
  await page.getByLabel("Business / tax ID").fill("DEMO-TAX");
  await page
    .getByLabel("Shipping address")
    .fill("3200 Airport Road, Salt Lake City");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByText("Express air freight", { exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Place demo order" }).click();
  await expect(
    page.getByText("Order placed successfully.", { exact: false }),
  ).toBeVisible();
  const id = await page.locator("h1").textContent();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: id, exact: true }),
  ).toBeVisible();
  await page.goto("/buyer/cart");
  await expect(
    page.getByText("Your cart is empty.", { exact: false }),
  ).toBeVisible();
  await login(page, "supplier");
  await page.goto("/supplier/orders");
  await page
    .getByRole("row")
    .filter({ hasText: id })
    .getByRole("button", { name: "Mark Confirmed" })
    .click();
  await expect(
    page
      .getByRole("row")
      .filter({ hasText: id })
      .getByText("Confirmed", { exact: true }),
  ).toBeVisible();
  await login(page);
  await page.goto("/buyer/orders/" + id);
  await expect(
    page
      .getByText("Placed ", { exact: false })
      .filter({ hasText: "Confirmed" }),
  ).toBeVisible();
});
test("RUL validates CSV shape and leads to compatible component comparisons", async ({
  page,
}) => {
  await login(page);
  await page.goto("/buyer/rul-analysis?engine=ENG-037");
  await page.getByLabel("Upload sensor CSV").setInputFiles({
    name: "short.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("cycle,sensor\n1,2"),
  });
  await page.getByRole("button", { name: "Run demo prediction" }).click();
  await expect(
    page.getByText("Provide a header and at least 30 data rows."),
  ).toBeVisible();
  await page.getByLabel("Upload sensor CSV").setInputFiles({
    name: "sample.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(
      "cycle,sensor\n" +
        Array.from({ length: 30 }, (_, i) => `${i},0.2`).join("\n"),
    ),
  });
  await page.getByRole("button", { name: "Run demo prediction" }).click();
  await expect(
    page.getByRole("heading", { name: "Prioritize replacement planning" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View compatible options" }).click();
  await expect(
    page.getByRole("heading", { name: "Compare your options" }),
  ).toBeVisible();
});
test("search, filtering and wishlist persist across reload", async ({
  page,
}) => {
  await login(page);
  await page.goto("/marketplace?q=does-not-exist");
  await expect(
    page.getByRole("heading", { name: "No matching components" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator("article")).toHaveCount(6);
  await page
    .getByRole("button", { name: /Add to wishlist:/ })
    .first()
    .click();
  await page.goto("/buyer/wishlist");
  await expect(page.locator("article")).toHaveCount(1);
  await page.reload();
  await expect(page.locator("article")).toHaveCount(1);
});
test("supplier listing creation, editing and stock updates persist", async ({
  page,
}) => {
  await login(page, "supplier");
  await page.goto("/supplier/products/new");
  await page
    .getByLabel("Product name", { exact: true })
    .fill("QA Aviation Component");
  await page.getByLabel("Part number / SKU").fill("QA-001");
  await page.getByLabel("Compatible engines").fill("CFM56-7B");
  await page.getByLabel("Unit price (USD)").fill("1499.50");
  await page.getByLabel("Available stock").fill("7");
  await page.getByLabel("Listing status").selectOption("Active");
  await page
    .getByRole("button", { name: "Create product", exact: true })
    .click();
  await expect(
    page.getByText("QA Aviation Component", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("row")
    .filter({ hasText: "QA Aviation Component" })
    .getByRole("link", { name: "Edit listing" })
    .click();
  await expect(page.getByLabel("Product name", { exact: true })).toHaveValue(
    "QA Aviation Component",
  );
  await page.getByLabel("Unit price (USD)").fill("1599.50");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.goto("/supplier/inventory");
  await page.getByLabel("Stock for QA Aviation Component").fill("3");
  await page
    .getByRole("row")
    .filter({ hasText: "QA Aviation Component" })
    .getByRole("button", { name: "Update stock" })
    .click();
  await page.reload();
  await expect(page.getByLabel("Stock for QA Aviation Component")).toHaveValue(
    "3",
  );
});
test("admin verification and moderation update the catalog; role guard prevents buyer access", async ({
  page,
}) => {
  await login(page, "admin");
  await page.goto("/admin/suppliers");
  await page.getByRole("button", { name: "Approve supplier" }).click();
  await expect(
    page.getByRole("button", { name: "Approve supplier" }),
  ).toHaveCount(0);
  await page.goto("/admin/products");
  await page.getByRole("button", { name: "Hide listing" }).click();
  await page.goto("/marketplace");
  await expect(page.locator("article")).toHaveCount(5);
  await page.goto("/buyer/dashboard");
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
});
const paths = {
  buyer: [
    "dashboard",
    "engines",
    "engines/ENG-037",
    "rul-analysis",
    "recommendations",
    "cart",
    "checkout",
    "orders",
    "orders/ORD-1004",
    "wishlist",
    "notifications",
    "company-profile",
    "settings",
  ],
  supplier: [
    "dashboard",
    "products",
    "products/new",
    "inventory",
    "orders",
    "reviews",
    "analytics",
    "store-profile",
    "settings",
  ],
  admin: [
    "dashboard",
    "users",
    "companies",
    "suppliers",
    "products",
    "categories",
    "orders",
    "reports",
    "rul-status",
    "settings",
  ],
};
for (const role of Object.keys(paths))
  test(`${role} routes fit 390, 768 and 1440 px and support mobile navigation`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await login(page, role);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 950 });
      for (const path of [
        ...paths[role].map((p) => "/" + role + "/" + p),
        "/marketplace",
        "/products/prod-101",
      ]) {
        await page.goto(path);
        await expect(page.locator("h1").first()).toBeVisible();
        const size = await page.evaluate(() => [
          innerWidth,
          document.documentElement.scrollWidth,
        ]);
        expect(size[1], `${path} at ${width}px`).toBeLessThanOrEqual(
          size[0] + 1,
        );
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/" + role + "/dashboard");
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page
        .getByRole("button", { name: "Close navigation", exact: true })
        .last(),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    expect(errors).toEqual([]);
  });
test("missing products, engines and orders show recovery links", async ({
  page,
}) => {
  await login(page);
  for (const [url, title] of [
    ["/products/missing", "Product not found"],
    ["/buyer/engines/missing", "Engine not found"],
    ["/buyer/orders/missing", "Order not found"],
  ]) {
    await page.goto(url);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
});
