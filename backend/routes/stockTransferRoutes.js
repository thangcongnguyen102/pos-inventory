const express = require("express");
const db = require("../db");
const router = express.Router();
const { authenticateUser, authorizeAdmin, authorizeEmployee } = require("../middlewares/authMiddleware");
// Get inventory for a specific product in a store
router.get("/store/:storeId/product/:productId", authenticateUser, (req, res) => {
  const { storeId, productId } = req.params;
  const storeIdNum = Number(storeId);
  const productIdNum = Number(productId);

  if (!storeId || !productId || isNaN(storeIdNum) || isNaN(productIdNum) || storeIdNum <= 0 || productIdNum <= 0) {
    return res.status(400).json({ message: "Store ID and Product ID are required and must be positive numbers" });
  }
  db.query(
    `SELECT quantity FROM inventory WHERE store_id = ? AND product_id = ?`,
    [storeId, productId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      // ✅ If no result, return quantity = 0
      if (results.length === 0) {
        return res.json({ quantity: 0 }); 
      }

      res.json(results[0]);
    }
  );
});
// Get all stock transfers (ORDER BY latest date first)
router.get("/", authenticateUser, (req, res) => {
  db.query(
    `SELECT stock_transfers.id, from_store.name AS from_store, to_store.name AS to_store, 
            products.name AS product_name, stock_transfers.quantity, 
            stock_transfers.transferred_at 
     FROM stock_transfers
     JOIN stores AS from_store ON stock_transfers.from_store_id = from_store.id
     JOIN stores AS to_store ON stock_transfers.to_store_id = to_store.id
     JOIN products ON stock_transfers.product_id = products.id
     ORDER BY stock_transfers.transferred_at DESC`,  // ✅ Sort by latest transfer
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json(results);
    }
  );
});

// Transfer stock between stores
router.post("/", authenticateUser, authorizeAdmin, (req, res) => {
  const { from_store_id, to_store_id, product_id, quantity } = req.body;
  if (!from_store_id || !to_store_id || !product_id || !quantity) {
    return res.status(400).json({ message: "All fields are required: from_store_id, to_store_id, product_id, quantity" });
  }
  if (from_store_id === to_store_id) {
    return res.status(400).json({ message: "Cannot transfer stock within the same store" });
  }
  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }
  // Check if enough stock is available in the source store
  db.query(
    "SELECT quantity FROM inventory WHERE store_id = ? AND product_id = ?",
    [from_store_id, product_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "Product not found in the source store inventory" });
      }

      const stockAvailable = results[0].quantity;

      if (stockAvailable < quantity) {
        return res.status(400).json({ message: "Not enough stock available for transfer" });
      }

      // Deduct stock from the source store
      db.query(
        "UPDATE inventory SET quantity = quantity - ? WHERE store_id = ? AND product_id = ?",
        [quantity, from_store_id, product_id],
        (err, updateResult) => {
          if (err) return res.status(500).json({ message: "Error updating source store inventory", error: err });

          // Check if product exists in the destination store
          db.query(
            "SELECT quantity FROM inventory WHERE store_id = ? AND product_id = ?",
            [to_store_id, product_id],
            (err, destResults) => {
              if (err) return res.status(500).json({ message: "Database error", error: err });

              if (destResults.length > 0) {
                // Product exists, update quantity
                db.query(
                  "UPDATE inventory SET quantity = quantity + ? WHERE store_id = ? AND product_id = ?",
                  [quantity, to_store_id, product_id],
                  (err, updateDestResult) => {
                    if (err) return res.status(500).json({ message: "Error updating destination store inventory", error: err });

                    // Record the stock transfer
                    db.query(
                      "INSERT INTO stock_transfers (from_store_id, to_store_id, product_id, quantity) VALUES (?, ?, ?, ?)",
                      [from_store_id, to_store_id, product_id, quantity],
                      (err, transferResult) => {
                        if (err) return res.status(500).json({ message: "Error recording stock transfer", error: err });

                        res.status(201).json({ message: "Stock transferred successfully", transferId: transferResult.insertId });
                      }
                    );
                  }
                );
              } else {
                // Product does not exist, insert new record
                db.query(
                  "INSERT INTO inventory (store_id, product_id, quantity) VALUES (?, ?, ?)",
                  [to_store_id, product_id, quantity],
                  (err, insertResult) => {
                    if (err) return res.status(500).json({ message: "Error inserting into destination store inventory", error: err });

                    // Record the stock transfer
                    db.query(
                      "INSERT INTO stock_transfers (from_store_id, to_store_id, product_id, quantity) VALUES (?, ?, ?, ?)",
                      [from_store_id, to_store_id, product_id, quantity],
                      (err, transferResult) => {
                        if (err) return res.status(500).json({ message: "Error recording stock transfer", error: err });

                        res.status(201).json({ message: "Stock transferred successfully", transferId: transferResult.insertId });
                      }
                    );
                  }
                );
              }
            }
          );
        }
      );
    }
  );
});
//router.delete("/:id", (req, res) => {
router.delete("/:id", authenticateUser, authorizeAdmin, (req, res) => {
  const transferId = req.params.id;
  if (isNaN(transferId)) {
    return res.status(400).json({ message: "Invalid transfer ID" });
  }
  db.query("DELETE FROM stock_transfers WHERE id = ?", [transferId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting stock transfer", error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Stock transfer not found" });
    }
    res.json({ message: "Stock transfer deleted successfully" });
  });
});

module.exports = router;
