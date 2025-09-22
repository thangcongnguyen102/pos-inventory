const request = require("supertest");
const app = require("../server");
const db = require("../db");

let token;
let fromStoreId = 1;
let toStoreId = 2;
let productId = 1;
let transferId;



beforeAll(async () => {
    await db.promise().query("DELETE FROM users WHERE username = 'teststock_transfer'");
    await request(app).post("/api/auth/register").send({ username: "teststock_transfer", password: "test123", role: "admin" });
    const res = await request(app).post("/api/auth/login").send({ username: "teststock_transfer", password: "test123" });
    token = res.body.token;

  // Ensure inventory has stock
  await db.promise().query(
    `INSERT INTO inventory (store_id, product_id, quantity, min_stock_level)
     VALUES (?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE quantity = 20`,
    [fromStoreId, productId, 20]
  );
});

describe("🔄 Stock Transfers", () => {
  test("Get inventory for product in store", async () => {
    const res = await request(app)
      .get(`/api/stock-transfers/store/${fromStoreId}/product/${productId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("quantity");
  });
  test("Missing storeId or productId", async () => {
    const res = await request(app)
      .get("/api/stock-transfers/store/0/product/0") 
      .set("Authorization", `Bearer ${token}`);
  
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Store ID and Product ID are required and must be positive numbers");
  });
  
  test("Transfer stock successfully", async () => {
    const res = await request(app)
      .post("/api/stock-transfers")
      .set("Authorization", `Bearer ${token}`)
      .send({
        from_store_id: fromStoreId,
        to_store_id: toStoreId,
        product_id: productId,
        quantity: 1,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/Stock transferred successfully/);
    transferId = res.body.transferId;
  });

  test("Fail to transfer within same store", async () => {
    const res = await request(app)
      .post("/api/stock-transfers")
      .set("Authorization", `Bearer ${token}`)
      .send({
        from_store_id: fromStoreId,
        to_store_id: fromStoreId,
        product_id: productId,
        quantity: 1,
      });
    expect(res.statusCode).toBe(400);
  });

  test("Get all stock transfers", async () => {
    const res = await request(app).get("/api/stock-transfers").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Delete stock transfer successfully", async () => {
    const res = await request(app)
      .delete(`/api/stock-transfers/${transferId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Stock transfer deleted successfully");
  });

  test("Delete non-existent transfer", async () => {
    const res = await request(app)
      .delete("/api/stock-transfers/999999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});

afterAll(() => {
  db.end();
});
