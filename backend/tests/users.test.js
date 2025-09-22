const request = require("supertest");
const app = require("../server");
const db = require("../db");

let token;
let employeeId;

beforeAll(async () => {
  await db.promise().query("DELETE FROM users WHERE username = 'testemployee'");

  // Tạo admin test user
  await request(app).post("/api/auth/register").send({
    username: "adminTest",
    password: "admin123",
    role: "admin",
  });

  // Đăng nhập để lấy token
  const res = await request(app).post("/api/auth/login").send({
    username: "adminTest",
    password: "admin123",
  });
  token = res.body.token;
});

describe("👤 EMPLOYEE ROUTES", () => {
  test("Add employee successfully", async () => {
    const res = await request(app)
      .post("/api/employees")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "testemployee", password: "pass123" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Employee created successfully");
    employeeId = res.body.employeeId;
  });

  test("Fail to add employee (missing fields)", async () => {
    const res = await request(app)
      .post("/api/employees")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Username and password are required");
  });

  test("Fail to add employee (duplicate username)", async () => {
    const res = await request(app)
      .post("/api/employees")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "testemployee", password: "newpass" });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Username already exists");
  });

  test("Update employee successfully", async () => {
    const res = await request(app)
      .put(`/api/employees/${employeeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "testemployee_updated", password: "newpassword" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Employee updated successfully");
  });

  test("Fail to update employee (no data)", async () => {
    const res = await request(app)
      .put(`/api/employees/${employeeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("No data to update");
  });

  test("Fail to update non-existent employee", async () => {
    const res = await request(app)
      .put(`/api/employees/999999`)
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "ghost" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Employee not found or invalid role");
  });

  test("Get all employees", async () => {
    const res = await request(app)
      .get("/api/employees")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Delete employee successfully", async () => {
    const res = await request(app)
      .delete(`/api/employees/${employeeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Employee deleted successfully");
  });

  test("Fail to delete non-existent employee", async () => {
    const res = await request(app)
      .delete(`/api/employees/999999`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Employee not found");
  });

  test("Fail to delete with invalid ID", async () => {
    const res = await request(app)
      .delete(`/api/employees/abc`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid employee ID");
  });
});

afterAll(() => {
  db.end();
});
