const request = require("supertest");
const app = require("../server");
const db = require("../db");

let token;

beforeAll(async () => {
  await db.promise().query("DELETE FROM users WHERE username = 'reporttest'");
  await request(app).post("/api/auth/register").send({
    username: "reporttest",
    password: "test123",
    role: "admin",
  });

  const res = await request(app).post("/api/auth/login").send({
    username: "reporttest",
    password: "test123",
  });

  token = res.body.token;
});

describe("📦 Reports Export Routes", () => {
  test("Export sales data as CSV", async () => {
    const res = await request(app)
      .get("/api/reports/sales/csv")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.statusCode); // Accept either valid or empty
    if (res.statusCode === 200) {
      expect(res.headers["content-type"]).toContain("text/csv");
      expect(res.text).toContain("store_name");
    } else {
      expect(res.body.message).toMatch(/no sales data/i);
    }
  });

  test("Export inventory data as CSV", async () => {
    const res = await request(app)
      .get("/api/reports/inventory/csv")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.headers["content-type"]).toContain("text/csv");
      expect(res.text).toContain("store_name");
    } else {
      expect(res.body.message).toMatch(/no inventory data/i);
    }
  });

  test("Export sales report as PDF", async () => {
    const res = await request(app)
      .get("/api/reports/sales/pdf")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.headers["content-type"]).toBe("application/pdf");
    } else {
      expect(res.body.message).toMatch(/no sales data/i);
    }
  });


});

afterAll(() => {
  db.end();
});