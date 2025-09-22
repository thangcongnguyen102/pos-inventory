const request = require("supertest");
const app = require("../server");
const db = require("../db");

let token;
let inventoryId;
let productId = 27;
let storeId = 8;

beforeAll(async () => {
  // Login as admin to get token
  const res = await request(app).post("/api/auth/login").send({
    username: "admin",
    password: "password123",
  });
  token = res.body.token;
});

describe("🔎 INVENTORY ROUTES", () => {
  test("Add inventory (new record)", async () => {
    const res = await request(app)
      .post("/api/inventory")
      .set("Authorization", `Bearer ${token}`)
      .send({
        store_id: storeId,
        product_id: productId,
        quantity: 10,
        min_stock_level: 5,
      });

    expect([200, 201]).toContain(res.statusCode);
    inventoryId = res.body.inventoryId || 1;
  });

  test("Fail to add inventory with invalid quantity", async () => {
    const res = await request(app)
      .post("/api/inventory")
      .set("Authorization", `Bearer ${token}`)
      .send({
        store_id: storeId,
        product_id: productId,
        quantity: -5,
        min_stock_level: 2,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Quantity must be greater than 0/);
  });

  test("Update inventory", async () => {
    const res = await request(app)
      .put(`/api/inventory/${inventoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 20,
        min_stock_level: 5,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Inventory updated successfully");
  });

  test("Fail to update with invalid quantity", async () => {
    const res = await request(app)
      .put(`/api/inventory/${inventoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: "invalid",
        min_stock_level: 10,
      });

    expect(res.statusCode).toBe(400);
  });

  test("Get inventory by store", async () => {
    const res = await request(app)
      .get(`/api/inventory/store/${storeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Fail to get inventory by invalid store ID", async () => {
    const res = await request(app)
      .get("/api/inventory/store/abc")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  test("Get inventory for specific product in store", async () => {
    const res = await request(app)
      .get(`/api/inventory/store/${storeId}/product/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.statusCode);
  });

  test("Delete inventory", async () => {
    const res = await request(app)
      .delete(`/api/inventory/${inventoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Inventory deleted successfully");
  });
});

afterAll(() => {
  db.end();
});
