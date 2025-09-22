const express = require("express");
const db = require("../db");
const router = express.Router();


const { authenticateUser, authorizeAdmin, authorizeEmployee } = require("../middlewares/authMiddleware");

module.exports = router;

// Get all sales transactions
//router.get("/", (req, res) => {
router.get("/", authenticateUser,  (req, res) => {
  db.query(
    `SELECT sales.id, stores.name AS store_name, products.name AS product_name, 
            sales.quantity, sales.total_price, sales.sold_at 
     FROM sales 
     JOIN stores ON sales.store_id = stores.id 
     JOIN products ON sales.product_id = products.id`,
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error while fetching sales", error: err });
      res.json(results);
    }
  );
});

// Get sales by store
//router.get("/store/:storeId", (req, res) => {
router.get("/store/:storeId", authenticateUser,  (req, res) => {
  const storeId = Number(req.params.storeId);
  if (!Number.isInteger(storeId) || storeId <= 0) {
    return res.status(400).json({ message: "Invalid store ID. Must be a positive number." });
  }
  db.query(
    `SELECT sales.id, stores.name AS store_name, products.name AS product_name, 
            sales.quantity, sales.total_price, sales.sold_at 
     FROM sales 
     JOIN stores ON sales.store_id = stores.id 
     JOIN products ON sales.product_id = products.id     
     WHERE sales.store_id = ?
     ORDER BY sales.sold_at DESC`,
    [storeId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json(results);
    }
  );
});

// Add a new sale (and reduce inventory)
//router.post("/", (req, res) => {
router.post("/", authenticateUser, (req, res) => {
  const { store_id, product_id, quantity } = req.body;
    // Input validation
    if (!store_id || !product_id || !quantity) {
      return res.status(400).json({ message: "store_id, product_id, and quantity are required" });
    }
    if (isNaN(store_id) || isNaN(product_id) || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input: store_id, product_id must be numbers and quantity must be positive" });
    }

  // Check if enough stock is available
  db.query(
    "SELECT quantity, price FROM inventory JOIN products ON inventory.product_id = products.id WHERE store_id = ? AND product_id = ?",
    [store_id, product_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "Inventory record not found for this product in the store" });
      }

      const stockAvailable = results[0].quantity;
      const productPrice = results[0].price;

      if (stockAvailable < quantity) {
        return res.status(400).json({ message: "Not enough stock available for sale" });
      }

      const total_price = productPrice * quantity;

      // Insert sale record
      db.query(
        "INSERT INTO sales (store_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)",
        [store_id, product_id, quantity, total_price],
        (err, result) => {
          if (err) return res.status(500).json({ message: "Error recording sale", error: err });

          // Reduce inventory stock
          db.query(
            "UPDATE inventory SET quantity = quantity - ? WHERE store_id = ? AND product_id = ?",
            [quantity, store_id, product_id],
            (err, updateResult) => {
              if (err) return res.status(500).json({ message: "Error updating inventory", error: err });

              res.status(201).json({
                message: "Sale recorded successfully and inventory updated",
                saleId: result.insertId,
                total_price: total_price,
              });
            }
          );
        }
      );
    }
  );
});

// Delete a sales record (optional)
//router.delete("/:id", (req, res) => {
  router.delete("/:id", authenticateUser, authorizeAdmin, (req, res) => {
    const saleId = req.params.id;
  
    if (isNaN(saleId)) {
      return res.status(400).json({ message: "Invalid sale ID" });
    }
  
    db.query("DELETE FROM sales WHERE id = ?", [saleId], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error while deleting sale", error: err });
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Sale not found" });
      }
  
      res.json({ message: "Sale deleted successfully" });
    });
  });

module.exports = router;
