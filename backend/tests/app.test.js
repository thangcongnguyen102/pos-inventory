const request = require("supertest");
const app = require("../server");
const db = require("../db");

let token;
let productId;
let saleId;
let employeeId;
let inventoryId;
let storeId;


describe("Интеграционное-тестирование", () => {
  describe("Проверка метода аутентификации пользователя после регистрации", () => {
    beforeAll(async () => {
      // Удалить пользователя testuser, если он уже есть
      await db.promise().query("DELETE FROM users WHERE username = 'testuser'");
    });
  
    test("Успешная регистрация", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        password: "test123",
        role: "admin",
      });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("User registered successfully");
    });
  
    test("Успешный вход", async () => {
      const res = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "test123",
      });
  
      expect(res.statusCode).toBe(200);
      token = res.body.token;
      expect(token).toBeDefined();
    });
  });

describe("Проверка управления товарами после входа администратора в систему", () => {
  // 🔹 PRODUCTS
  test("Успешное добавление товара", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Product",
        sku: "TP001",
        description: "Test description",
        price: 99.99,
      });

    expect(res.statusCode).toBe(201);
    productId = res.body.productId;
  });

  test("Успешное удаление товара", async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product deleted successfully");
  });

  test("Получение списка всех товаров из базы данных", async () => {
    const res = await request(app).get("/api/products").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});


describe("Проверка управления магазинами после входа администратора в систему", () => {
  //🔹 STORES

  test("Успешное создание магазина", async () => {
    const res = await request(app)
      .post("/api/stores")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Store", location: "Test Location" });

    expect(res.statusCode).toBe(201);
    storeId = res.body.storeId;
  });
  test("Успешное обновление информации о магазине", async () => {
    const res = await request(app)
      .put(`/api/stores/${storeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Store Name",
        location: "Test Location", // Optional: can stay the same
      });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Store updated successfully");
  });
});
  
//  🔹 INVENTORY
describe("Проверка функций управления запасами после входа администратора в систему", () => {


test("Успешное добавление товара на склад", async () => {
  const res = await request(app)
    .post("/api/inventory")
    .set("Authorization", `Bearer ${token}`)
    .send({
      store_id: 8,
      product_id: 2,
      quantity: 50,
      min_stock_level: 5,
    });

  expect([200, 201]).toContain(res.statusCode);
  inventoryId = res.body.inventoryId; // <-- Capture inventory ID for the next test
});


  test("Успешное обновление минимального уровня запаса", async () => {
    const res = await request(app)
      .put(`/api/inventory/${inventoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 50, // Keep the same quantity
        min_stock_level: 10, // New value to test update
      });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Inventory updated successfully");
  });

  test("Получение всех записей склада по ID магазина", async () => {
    const res = await request(app)
      .get(`/api/inventory/store/8`) // Replace 8 with dynamic storeId if needed
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // There should be at least one item
  });

});

  //🔹 SALES
  describe("Проверка управления продажами после входа администратора в систему", () => {
  test("Успешное добавление новой продажи", async () => {
    const res = await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${token}`)
      .send({
        store_id: 8,
        product_id: 2,
        quantity: 1,
      });

    expect(res.statusCode).toBe(201);
    saleId = res.body.saleId;
  });

  test("Получение списка всех продаж", async () => {
  const res = await request(app).get("/api/sales").set("Authorization", `Bearer ${token}`);
     expect(res.statusCode).toBe(200);
  });
  test("Успешное удаление ранее добавленной продажи", async () => {
    const res = await request(app)
      .delete(`/api/sales/${saleId}`)
      .set("Authorization", `Bearer ${token}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Sale deleted successfully");
  });
});
describe("Проверка функции передачи товара между магазинами под учетной записью администратора", () => {
// 🔹 STOCK TRANSFERS
test("Успешная передача товара со склада одного магазина на склад другого", async () => {
  const fromStoreId = 8; 
  const toStoreId = 1;  
  const testProductId = 2;

  const res = await request(app)
    .post("/api/stock-transfers")
    .set("Authorization", `Bearer ${token}`)
    .send({
      from_store_id: fromStoreId,
      to_store_id: toStoreId,
      product_id: testProductId,
      quantity: 1,
    });

  expect(res.statusCode).toBe(201);
});
});
describe("Проверка управления учетными записями сотрудников после входа администратора в систему", () => {
  // 🔹 EMPLOYEES
  test("Успешное создание новой учетной записи сотрудника", async () => {
    const res = await request(app)
      .post("/api/employees")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "Thien",
        password: "thien123",
      });
  
    expect(res.statusCode).toBe(201);
    employeeId = res.body.employeeId; // Save the ID for the next test (if your route returns it)
  });
  
  test("Успешное редактирование данных сотрудника", async () => {
    const res = await request(app)
      .put(`/api/employees/${employeeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "employee1_updated",
        password: "newpass456",
      });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Employee updated successfully");
  });
  
});
});
afterAll(() => {
  db.end();
});



