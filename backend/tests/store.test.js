const request = require("supertest");
const app = require("../server");
const db = require("../db");
let token;
let storeId;
beforeAll(async () => {
  // Đăng nhập admin (đảm bảo admin tồn tại)
  const res = await request(app)
    .post("/api/auth/login")
    .send({ username: "admin", password: "password123" });

  token = res.body.token;

  // Xóa cửa hàng test nếu đã tồn tại
  await db.promise().query("DELETE FROM stores WHERE name = 'Test Store'");
});
afterAll(() => {
  db.end();
});

describe("🔍 Store Routes", () => {
  //Create Store
  test("Create new store successfully", async () => {
    const res = await request(app)
      .post("/api/stores")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Store", location: "Test City" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Store added successfully");
    storeId = res.body.storeId;
  });

  //Duplicate store name
  test("Duplicate store name should fail", async () => {
    const res = await request(app)
      .post("/api/stores")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Store", location: "Another City" });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Store name already exists");
  });

  //Missing fields
  test("Missing name or location", async () => {
    const res = await request(app)
      .post("/api/stores")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "", location: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Store name and location are required");
  });

  test("Get all stores", async () => {
    const res = await request(app)
      .get("/api/stores")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  test("Get store by ID", async () => {
    const res = await request(app)
      .get(`/api/stores/${storeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Test Store");
  });

  //Get store with invalid ID
  test("Get non-existing store", async () => {
    const res = await request(app)
      .get("/api/stores/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Store not found");
  });

  //Update store
  test("Update store name", async () => {
    const res = await request(app)
      .put(`/api/stores/${storeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Test Store", location: "Updated City" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Store updated successfully");
  });

  //Update with duplicate name
  test("Update with existing store name", async () => {
    // Tạo store khác để test trùng tên
    const dup = await request(app)
      .post("/api/stores")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Duplicate Store", location: "Anywhere" });

    const dupId = dup.body.storeId;

    const res = await request(app)
      .put(`/api/stores/${storeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Duplicate Store", location: "Another" });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Another store with this name already exists");

    // Xoá store test phụ
    await db.promise().query("DELETE FROM stores WHERE id = ?", [dupId]);
  });
  //Delete store
  test("Delete store successfully", async () => {
    const res = await request(app)
      .delete(`/api/stores/${storeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Store deleted successfully");
  });
});
