const calculateTotalPrice = require("../utils/calculateTotalPrice");
const validateUserInput = require("../utils/validateUserInput");
const validateProduct = require("../utils/validateProduct");
const isLowStock = require("../utils/isLowStock");
const isAdmin = require("../utils/isAdmin");
const isTransferValid = require("../utils/isTransferValid");

// === Модульный тест: calculateTotalPrice ===
describe("Модульный тест: calculateTotalPrice()", () => {
  test("возвращает правильную сумму", () => {
    expect(calculateTotalPrice(100, 2)).toBe(200);
  });
});

// === Модульный тест: validateUserInput ===
describe("Модульный тест: validateUserInput()", () => {
  test("возвращает true при корректных данных", () => {
    expect(validateUserInput("john", "123456")).toBe(true);
  });

  test("возвращает false при пустом имени пользователя", () => {
    expect(validateUserInput("", "123456")).toBe(false);
  });

  test("возвращает false при пустом пароле", () => {
    expect(validateUserInput("john", "")).toBe(false);
  });

  test("возвращает false при вводе только пробелов", () => {
    expect(validateUserInput("  ", "  ")).toBe(false);
  });
});

// === Модульный тест: validateProduct ===
describe("Модульный тест: validateProduct()", () => {
  test("корректный товар возвращает true", () => {
    expect(validateProduct({ name: "Milk", price: 20 })).toBe(true);
  });

  test("отсутствие имени возвращает false", () => {
    expect(validateProduct({ name: "", price: 20 })).toBe(false);
  });

  test("цена 0 возвращает false", () => {
    expect(validateProduct({ name: "Juice", price: 0 })).toBe(false);
  });
});

// === Модульный тест: isLowStock ===
describe("Модульный тест: isLowStock()", () => {
  test("возвращает true, если количество ниже минимума", () => {
    expect(isLowStock(5, 10)).toBe(true);
  });

  test("возвращает false, если количество не ниже минимума", () => {
    expect(isLowStock(10, 10)).toBe(false);
    expect(isLowStock(15, 10)).toBe(false);
  });
});

// === Модульный тест: isAdmin ===
describe("Модульный тест: isAdmin()", () => {
  test("возвращает true для роли admin", () => {
    expect(isAdmin({ username: "test", role: "admin" })).toBe(true);
  });

  test("возвращает false для роли employee", () => {
    expect(isAdmin({ username: "test", role: "employee" })).toBe(false);
  });

  test("возвращает false при null", () => {
    expect(isAdmin(null)).toBe(false);
  });
});

// === Модульный тест: isTransferValid ===
describe("Модульный тест: isTransferValid()", () => {
  test("возвращает true при допустимом переносе", () => {
    expect(isTransferValid(50, 10)).toBe(true);
  });

  test("возвращает false, если запрашиваемое количество превышает остаток", () => {
    expect(isTransferValid(5, 10)).toBe(false);
  });

  test("возвращает false при нуле количестве", () => {
    expect(isTransferValid(100, 0)).toBe(false);
  });
  test("возвращает false при отрицательном количестве", () => {
    expect(isTransferValid(100, -5)).toBe(false);
  });
});
