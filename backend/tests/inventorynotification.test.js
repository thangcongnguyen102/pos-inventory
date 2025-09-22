const request = require("supertest");
const app = require("../server");
const db = require("../db");

// ✅ Mock nodemailer
jest.mock("nodemailer");
const nodemailer = require("nodemailer");
const { __mock__ } = nodemailer;
const sendMailMock = __mock__.sendMailMock;

let token;

describe("Интеграционное-тестирование", () => {
  describe("Проверка метода аутентификации пользователя после регистрации", () => {
    beforeAll(async () => {
      // Удалить пользователя testuser, если он уже есть
      await db.promise().query("DELETE FROM users WHERE username = 'testusernotify'");
    });
  
    test("Успешная регистрация", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testusernotify",
        password: "test1234",
        role: "admin",
      });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("User registered successfully");
    });
  
    test("Успешный вход", async () => {
      const res = await request(app).post("/api/auth/login").send({
        username: "testusernotify",
        password: "test1234",
      });
  
      expect(res.statusCode).toBe(200);
      token = res.body.token;
      expect(token).toBeDefined();
    });
  });

describe("Проверка отображения статуса наличия товара (в норме или недостаточно)", () => {
  test("Статус запасов должен быть 'OK' или 'LOW STOCK", async () => {
    const res = await request(app)
      .get("/api/inventory")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    res.body.forEach(item => {
      expect(item).toHaveProperty("stock_status");

      if (item.quantity < item.min_stock_level) {
        expect(item.stock_status).toBe("LOW STOCK");
      } else {
        expect(item.stock_status).toBe("OK");
      }
    });
  });
});

describe("Проверка отправки email-уведомления при низком уровне запаса", () => {
  test("Email-уведомление было успешно отправлено администратору при недостаточном уровне запаса", async () => {
            // Insert a low-stock inventory manually (requires valid store_id and product_id)
            await db.promise().query(`
              INSERT INTO inventory (store_id, product_id, quantity, min_stock_level)
              VALUES (1, 1, 1, 5)
              ON DUPLICATE KEY UPDATE quantity = 1, min_stock_level = 5
            `);
    const res = await request(app)
      .get("/api/inventory")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(sendMailMock).toHaveBeenCalled(); // ✅ Check if email was triggered
  });
});
});

afterAll(() => {
  db.end();
});