const request = require("supertest");
const app = require("../server");
const db = require("../db");

let token;

beforeAll(async () => {
  // Login to get token (assume user already exists with role admin)
  const res = await request(app).post("/api/auth/login").send({
    username: "admin",
    password: "password123",
  });
  token = res.body.token;
});

describe("📊 Dashboard Routes", () => {
    test("GET /api/dashboard/sales/stats should return sales statistics", async () => {
      const res = await request(app)
        .get("/api/dashboard/sales/stats")
        .set("Authorization", `Bearer ${token}`);
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("total_sales");
      expect(res.body).toHaveProperty("total_revenue");
      expect(res.body).toHaveProperty("top_selling_product");
    });
    test("GET /api/dashboard/sales/stats/daily-sales should return daily sales", async () => {
        const res = await request(app)
          .get("/api/dashboard/sales/stats/daily-sales")
          .set("Authorization", `Bearer ${token}`);
    
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });
    
      test("GET /api/dashboard/inventory/low-stock should return low stock alerts", async () => {
        const res = await request(app)
          .get("/api/dashboard/inventory/low-stock")
          .set("Authorization", `Bearer ${token}`);
    
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });

});

afterAll(() => {
  db.end();
});
