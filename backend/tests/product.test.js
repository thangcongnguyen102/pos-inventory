const request = require("supertest");
const app = require("../server");
const db = require("../db");
const path = require("path");

let token;
let productId;

beforeAll(async () => {
  await db.promise().query("DELETE FROM users WHERE username = 'producttester'");

  await request(app).post("/api/auth/register").send({
    username: "producttester",
    password: "test123",
    role: "admin",
  });

  const res = await request(app).post("/api/auth/login").send({
    username: "producttester",
    password: "test123",
  });

  token = res.body.token;
});

describe("📦 Product API Integration Tests", () => {
  const productData = {
    name: "Test Product",
    sku: "TP001",
    description: "Test description",
    price: 19.99,
  };

  test("Add product with image", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", productData.name)
      .field("sku", productData.sku)
      .field("description", productData.description)
      .field("price", productData.price);


    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("productId");
    productId = res.body.productId;
  });

  test("Prevent duplicate SKU", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Duplicate Product")
      .field("sku", productData.sku)
      .field("description", "Desc")
      .field("price", 10.0);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/SKU already exists/i);
  });
  test("Get all products", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  test("Get product by ID", async () => {
    const res = await request(app)
      .get(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", productId);
  });

  test("Update product", async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Updated Product")
      .field("sku", "TP001")
      .field("description", "Updated desc")
      .field("price", 29.99);


    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product updated successfully");
  });

  test("Delete product", async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product deleted successfully");
  });

  test("Get non-existent product", async () => {
    const res = await request(app)
      .get("/api/products/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });

  test("Update non-existent product", async () => {
    const res = await request(app)
      .put("/api/products/999999")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Nonexistent")
      .field("sku", "SKU999")
      .field("description", "Does not exist")
      .field("price", 9.99);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });
  test("Delete non-existent product", async () => {
    const res = await request(app)
      .delete("/api/products/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });

  test("Reject product creation with missing fields", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Incomplete" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/All fields are required/i);
  });
  
});

afterAll(() => {
  db.end();
});
