const request = require("supertest");
const app = require("../server");
const db = require("../db");

let token;
let storeId;
let productId;
let saleId;

beforeAll(async () => {
  await db.promise().query("DELETE FROM users WHERE username = 'testuser_sales'");
  await request(app).post("/api/auth/register").send({ username: "testuser_sales", password: "test123", role: "admin" });
  const res = await request(app).post("/api/auth/login").send({ username: "testuser_sales", password: "test123" });
  token = res.body.token;

  // Create store
  const storeRes = await request(app)
    .post("/api/stores")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Sales Store", location: "Location A" });
  storeId = storeRes.body.storeId;

  // Create product
  const productRes = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Sales Product", sku: "SKU123", description: "Test", price: 50 });
  productId = productRes.body.productId;

  // Add inventory for product
  await request(app)
    .post("/api/inventory")
    .set("Authorization", `Bearer ${token}`)
    .send({ store_id: storeId, product_id: productId, quantity: 20, min_stock_level: 5 });
});

describe("SALES ROUTES", () => {
  test("Create a sale", async () => {
    const res = await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${token}`)
      .send({ store_id: storeId, product_id: productId, quantity: 2 });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/Sale recorded successfully/i);
    saleId = res.body.saleId;
  });

  test("Fail to create sale with invalid data", async () => {
    const res = await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${token}`)
      .send({ store_id: "abc", product_id: "def", quantity: -1 });

    expect(res.statusCode).toBe(400);
  });

  test("Get all sales", async () => {
    const res = await request(app).get("/api/sales").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Get sales by store ID", async () => {
    const res = await request(app).get(`/api/sales/store/${storeId}`).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Get sales by invalid store ID", async () => {
    const res = await request(app).get("/api/sales/store/abc").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });

  test("Delete a sale", async () => {
    const res = await request(app).delete(`/api/sales/${saleId}`).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Sale deleted successfully");
  });

  test("Delete a sale that does not exist", async () => {
    const res = await request(app).delete("/api/sales/999999").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  test("Delete sale with invalid ID", async () => {
    const res = await request(app).delete("/api/sales/abc").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });
});

afterAll(() => {
  db.end();
});
