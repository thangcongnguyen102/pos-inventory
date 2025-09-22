const request = require("supertest");
const app = require("../server"); 
const db = require("../db");

describe("Юнит-тестирование", () => {
  const successRegisterUser = {
    username: "Phucnguyen",
    password: "thang123"
  };
  const failedRegisterUser = {
    username: "",
    password: "russia123"
  };
  const successLoginUser = {
    username: "admin",
    password: "password123"
  };
  const failedLoginUser = {
    username: "adminn",
    password: "abc123"
  };
  beforeEach(async () => {
    //Start transaction before each test
    await db.promise().query("START TRANSACTION");
  });

  afterEach(async () => {
    //Rollback changes after each test
    await db.promise().query("ROLLBACK");
  });

  // === TEST REGISTER ===
  describe("Проверка метода регистрации пользователя", () => {
    it("Успешная регистрация", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(successRegisterUser);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "User registered successfully");
    });

    it("Ошибка регистрации", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(failedRegisterUser);

      expect(res.statusCode).toBe(400); // Bad Request
      expect(res.body).toHaveProperty("message", "Username and password are required.");
    });
  });

  // === TEST LOGIN ===
  describe("Проверка метода аутентификации пользователя", () => {
    it("Успешный вход", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send(successLoginUser);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("role");
    });

    it("Ошибка входа", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send(failedLoginUser);

      expect(res.statusCode).toBe(401); // Unauthorized
      expect(res.body).toHaveProperty("message", "Invalid username or password");
    });
  });
});
afterAll(() => {
  db.end();
});
