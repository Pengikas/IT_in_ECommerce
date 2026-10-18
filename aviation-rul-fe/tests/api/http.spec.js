import { test, expect } from "@playwright/test";
const buyer = {
  id: "server-buyer",
  name: "API Buyer",
  companyName: "Server Company",
  email: "buyer@example.test",
  role: "buyer",
};
const product = {
  productId: 81,
  productName: "Server Turbine Assembly",
  partNumber: "SERVER-81",
  compatibility: ["CFM56"],
  image: "engine",
};
const offer = {
  listingId: 501,
  productId: 81,
  price: 1000,
  stockQuantity: 7,
  condition: "New",
  deliveryDays: 5,
  status: "Active",
  supplierId: "supplier-1",
  supplier: { name: "Server Supplier", verified: true },
};
const engine = {
  engineId: "SERVER-ENG",
  engineModel: "CFM56",
  currentCycle: 100,
  latestRul: 42,
  urgency: "Monitor",
};
async function backend(page, custom = () => undefined) {
  await page.route("**/api/v1/**", async (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname.replace("/api/v1", "");
    const override = await custom(path, req);
    if (override !== undefined)
      return route.fulfill({
        status: override.status || 200,
        json: override.body ?? { success: true, data: override.data },
      });
    const defaults = {
      "/auth/me": buyer,
      "/products": { items: [product] },
      "/products/81": product,
      "/products/81/listings": { items: [offer] },
      "/categories": { items: [] },
      "/suppliers": { items: [] },
      "/aircraft": { items: [{ aircraftId: "AIR-1" }] },
      "/aircraft/AIR-1/engines": { items: [engine] },
      "/engines/SERVER-ENG": engine,
      "/engines/SERVER-ENG/rul-predictions/latest": { predictedRul: 42 },
      "/orders": { items: [] },
      "/cart": { items: [] },
      "/supplier/listings": { items: [] },
      "/supplier/orders": { items: [] },
    };
    return path in defaults
      ? route.fulfill({ json: { success: true, data: defaults[path] } })
      : route.fulfill({
          status: 404,
          json: {
            success: false,
            error: { message: "No test endpoint " + path },
          },
        });
  });
}
test("JWT auth uses the server role, survives reload and clears on 401", async ({
  page,
}) => {
  let signed = false,
    expire = false;
  const logins = [],
    headers = [];
  await backend(page, (path, req) => {
    if (path === "/auth/login") {
      logins.push(req.postDataJSON());
      signed = true;
      return {
        data: {
          user: { ...buyer, role: "supplier" },
          accessToken: "test-jwt-not-a-real-secret",
        },
      };
    }
    if (path === "/auth/me") {
      headers.push(req.headers().authorization);
      return !signed || expire
        ? {
            status: 401,
            body: { success: false, error: { message: "Expired" } },
          }
        : { data: { ...buyer, role: "supplier" } };
    }
  });
  await page.goto("/login");
  await expect(page.getByLabel("Workspace role")).toHaveCount(0);
  await page.getByLabel("Business email").fill("buyer@example.test");
  await page.locator("input[name=password]").fill("password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/supplier\/dashboard$/);
  expect(logins).toEqual([
    { email: "buyer@example.test", password: "password" },
  ]);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Supplier dashboard" }),
  ).toBeVisible();
  expect(headers).toContain("Bearer test-jwt-not-a-real-secret");
  expire = true;
  await page.reload();
  await expect(page).toHaveURL(/\/login$/);
  expect(
    await page.evaluate(() => sessionStorage.getItem("aerorul_access_token")),
  ).toBeNull();
});
test("documented product/listing fields render without fallback after server failure", async ({
  page,
}) => {
  let fail = false;
  await backend(page, (path) =>
    path === "/products" && fail
      ? {
          status: 503,
          body: {
            success: false,
            error: { message: "Catalog unavailable by test" },
          },
        }
      : undefined,
  );
  await page.goto("/marketplace");
  await expect(
    page.getByRole("heading", { name: "Server Turbine Assembly" }),
  ).toBeVisible();
  await expect(page.locator("article")).toHaveCount(1);
  await expect(page.locator("article")).toContainText("$1,000");
  fail = true;
  await page.reload();
  await expect(page.getByText("Catalog unavailable by test")).toBeVisible();
  await expect(
    page.getByText("CFM56-7B High-Pressure Turbine Blade Set", { exact: true }),
  ).toHaveCount(0);
});
test("server cart and checkout use listing IDs and server-calculated totals", async ({
  page,
}) => {
  let items = [],
    order,
    body;
  await backend(page, (path, req) => {
    if (path === "/cart") return { data: { items } };
    if (path === "/cart/items" && req.method() === "POST") {
      expect(req.postDataJSON()).toEqual({ listingId: 501, quantity: 1 });
      items = [{ cartItemId: "CART-1", quantity: 1, product, listing: offer }];
      return { data: items[0] };
    }
    if (path === "/orders" && req.method() === "POST") {
      body = req.postDataJSON();
      order = {
        id: "SERVER-ORDER",
        status: "Placed",
        placedAt: "2026-10-19",
        total: 1123,
        shipping: 123,
        items: [
          {
            productId: 81,
            product: {
              id: "81",
              name: product.productName,
              partNumber: product.partNumber,
            },
            quantity: 1,
            price: 1000,
          },
        ],
      };
      items = [];
      return { data: order };
    }
    if (path === "/orders/SERVER-ORDER") return { data: order };
  });
  await page.goto("/products/81");
  await expect(
    page.getByRole("button", { name: "Account menu" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Add to cart", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("link", { name: "Proceed to checkout" }).click();
  await page.getByLabel("Business / tax ID").fill("SERVER-TAX");
  await page.getByLabel("Shipping address").fill("123 Server Street");
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Submit order to server" }).click();
  await expect(
    page.getByRole("heading", { name: "SERVER-ORDER" }),
  ).toBeVisible();
  expect(body.items).toEqual([{ listingId: 501, quantity: 1 }]);
  expect(body).not.toHaveProperty("total");
  expect(body.items[0]).not.toHaveProperty("price");
  await expect(page.getByText("$1,123", { exact: true })).toBeVisible();
});
test("sensor CSV uploads as multipart before RUL prediction", async ({
  page,
}) => {
  let uploaded = false,
    predicted = false;
  await backend(page, (path, req) => {
    if (path === "/engines/SERVER-ENG/sensor-uploads") {
      expect(req.headers()["content-type"]).toContain(
        "multipart/form-data; boundary=",
      );
      expect(req.postData()).toContain("sensor.csv");
      uploaded = true;
      return { data: { sensorUploadId: 1024 } };
    }
    if (path === "/engines/SERVER-ENG/rul-predictions") {
      expect(req.postDataJSON()).toEqual({ sensorUploadId: 1024 });
      predicted = true;
      return {
        data: {
          engineId: "SERVER-ENG",
          predictedRul: 37.4,
          urgency: "HIGH",
          interpretation: "Backend inference result",
        },
      };
    }
  });
  await page.goto("/buyer/rul-analysis");
  await expect(page.getByLabel("Engine reference")).toHaveValue("SERVER-ENG");
  await page
    .getByLabel("Upload sensor CSV")
    .setInputFiles({
      name: "sensor.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("cycle,sensor\n1,0.2"),
    });
  await page
    .getByRole("button", { name: "Run prediction", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Backend inference result" }),
  ).toBeVisible();
  expect(uploaded && predicted).toBe(true);
});
test("API mode gates management views that lack remote contracts", async ({
  page,
}) => {
  await backend(page, (path) =>
    path === "/auth/me" ? { data: { ...buyer, role: "admin" } } : undefined,
  );
  await page.goto("/admin/users");
  await expect(
    page.getByRole("heading", { name: "API integration pending" }),
  ).toBeVisible();
  await expect(page.getByText("John Doe", { exact: true })).toHaveCount(0);
});
test("supplier inventory and fulfilment use authenticated server endpoints", async ({
  page,
}) => {
  let stock = 7,
    stage = "Placed";
  await backend(page, (path, req) => {
    if (path === "/auth/me") return { data: { ...buyer, role: "supplier" } };
    if (path === "/supplier/listings")
      return { data: { items: [{ ...offer, stockQuantity: stock, product }] } };
    if (path === "/supplier/orders")
      return {
        data: { items: [{ id: "SELLER-1", total: 1000, status: stage }] },
      };
    if (path === "/supplier/listings/501" && req.method() === "PATCH") {
      expect(req.postDataJSON()).toEqual({ stockQuantity: 3 });
      stock = 3;
      return { data: { ...offer, stockQuantity: stock } };
    }
    if (path === "/supplier/orders/SELLER-1" && req.method() === "PATCH") {
      expect(req.postDataJSON()).toEqual({ status: "Confirmed" });
      stage = "Confirmed";
      return { data: { id: "SELLER-1", status: stage } };
    }
  });
  await page.goto("/supplier/inventory");
  await page.getByLabel("Stock for Server Turbine Assembly").fill("3");
  await page.getByRole("button", { name: "Update stock" }).click();
  await page.reload();
  await expect(
    page.getByLabel("Stock for Server Turbine Assembly"),
  ).toHaveValue("3");
  await page.goto("/supplier/orders");
  await page.getByRole("button", { name: "Mark Confirmed" }).click();
  await expect(
    page
      .getByRole("row")
      .filter({ hasText: "SELLER-1" })
      .getByText("Confirmed", { exact: true }),
  ).toBeVisible();
});
test("supplier creates a seller offer for an existing catalog product", async ({
  page,
}) => {
  let created = false;
  await backend(page, (path, req) => {
    if (path === "/auth/me") return { data: { ...buyer, role: "supplier" } };
    if (path === "/supplier/listings" && req.method() === "POST") {
      expect(req.postDataJSON()).toEqual({
        productId: 81,
        price: 1500,
        stockQuantity: 4,
        condition: "New",
        deliveryDays: 5,
        status: "Active",
      });
      created = true;
      return { data: { ...offer, product } };
    }
    if (path === "/supplier/listings" && created)
      return { data: { items: [{ ...offer, product }] } };
  });
  await page.goto("/supplier/products/new");
  await page.getByLabel("Catalog product").selectOption("81");
  await page.getByLabel("Unit price (USD)").fill("1500");
  await page.getByLabel("Available stock").fill("4");
  await page.getByLabel("Listing status").selectOption("Active");
  await page.getByRole("button", { name: "Save listing to server" }).click();
  await expect(page).toHaveURL(/\/supplier\/products$/);
  await expect(
    page.getByText("Server Turbine Assembly", { exact: true }),
  ).toBeVisible();
  expect(created).toBe(true);
});
