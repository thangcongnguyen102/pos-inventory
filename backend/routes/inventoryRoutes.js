const express = require("express");
const db = require("../db");
const router = express.Router();


const { authenticateUser, authorizeAdmin, authorizeEmployee } = require("../middlewares/authMiddleware");


  
  // Get all inventory items (with low-stock alert and email notification)
//router.get("/", (req, res) => {
router.get("/", authenticateUser, (req, res) => {
    db.query(
      `SELECT inventory.id, stores.name AS store_name, products.name AS product_name, 
              inventory.quantity, inventory.min_stock_level,
              (CASE WHEN inventory.quantity < inventory.min_stock_level THEN 'LOW STOCK' ELSE 'OK' END) AS stock_status
       FROM inventory 
       JOIN stores ON inventory.store_id = stores.id 
       JOIN products ON inventory.product_id = products.id`,
      (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
  
        results.forEach((item) => {
          if (item.quantity < item.min_stock_level) {
            sendLowStockAlert(item.store_name, item.product_name, item.quantity, item.min_stock_level);
          }
        });
  
        res.json(results);
      }
    );
});

// Get inventory by store
//router.get("/store/:storeId", (req, res) => {
router.get("/store/:storeId", authenticateUser, (req, res) => {
  const storeId = req.params.storeId;
  db.query(
    `SELECT inventory.id, stores.name AS store_name, products.name AS product_name, 
            inventory.quantity, inventory.min_stock_level 
     FROM inventory 
     JOIN stores ON inventory.store_id = stores.id 
     JOIN products ON inventory.product_id = products.id
     WHERE inventory.store_id = ?`,
    [storeId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "Invalid store ID" });
      }      
      res.json(results);
    }
  );
});

// Get inventory for a specific product in a store
//router.get("/store/:storeId/product/:productId", (req, res) => {
router.get("/store/:storeId/product/:productId", authenticateUser, (req, res) => {
  const { storeId, productId } = req.params;
  db.query(
    `SELECT * FROM inventory WHERE store_id = ? AND product_id = ?`,
    [storeId, productId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      if (isNaN(storeId) || isNaN(productId)) {
        return res.status(400).json({ message: "Invalid store or product ID" });
      }      
      if (results.length === 0) return res.status(404).json({ message: "Inventory not found" });
      res.json(results[0]);
    }
  );
});

// Add inventory
//router.post("/", (req, res) => {
router.post("/", authenticateUser, authorizeAdmin, (req, res) => {
    const { store_id, product_id, quantity, min_stock_level } = req.body;
  
    // Check if the product already exists in the store inventory
    db.query(
      "SELECT quantity FROM inventory WHERE store_id = ? AND product_id = ?",
      [store_id, product_id],
      (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        if (!store_id || !product_id || isNaN(quantity) || isNaN(min_stock_level)) {
          return res.status(400).json({ message: "Invalid or missing fields: store_id, product_id, quantity, min_stock_level" });
        }
        
        if (quantity <= 0 || min_stock_level < 0) {
          return res.status(400).json({ message: "Quantity must be greater than 0 and min_stock_level must be >= 0" });
        }
        
        if (results.length > 0) {
          // Product exists, update quantity
          db.query(
            "UPDATE inventory SET quantity = quantity + ?, min_stock_level = ? WHERE store_id = ? AND product_id = ?",
            [quantity, min_stock_level, store_id, product_id],
            (err, updateResult) => {
              if (err) return res.status(500).json({ message: "Error updating inventory", error: err });
  
              res.status(200).json({ message: "Inventory updated successfully" });
            }
          );
        } else {
          // Product does not exist, insert new record
          db.query(
            "INSERT INTO inventory (store_id, product_id, quantity, min_stock_level) VALUES (?, ?, ?, ?)",
            [store_id, product_id, quantity, min_stock_level],
            (err, insertResult) => {
              if (err) return res.status(500).json({ message: "Error adding inventory", error: err });
  
              res.status(201).json({ message: "Inventory added successfully", inventoryId: insertResult.insertId });
            }
          );
        }
      }
    );
});
// Update inventory quantity
//router.put("/:id", (req, res) => {
router.put("/:id", authenticateUser, authorizeAdmin, (req, res) => {
  const inventoryId = req.params.id;  // Get inventory ID from the URL
  const { quantity, min_stock_level } = req.body; // Get updated data from request body
  if (isNaN(inventoryId)) {
    return res.status(400).json({ message: "Invalid inventory ID" });
  }
  if (quantity == null || min_stock_level == null || isNaN(quantity) || isNaN(min_stock_level)) {
    return res.status(400).json({ message: "Quantity and min_stock_level must be numbers" });
  }    
  if (quantity <= 0 || min_stock_level < 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0 and min_stock_level must be >= 0" });
  }
  db.query(
    "UPDATE inventory SET quantity = ?, min_stock_level = ? WHERE id = ?",
    [quantity, min_stock_level, inventoryId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error updating inventory", error: err });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Inventory record not found" }); // If no record was updated
      }

      res.json({ message: "Inventory updated successfully" });
    }
  );
});

  
  
// Delete inventory record
//router.delete("/:id", (req, res) => {
router.delete("/:id", authenticateUser, authorizeAdmin, (req, res) => {
  const inventoryId = req.params.id;
  db.query("DELETE FROM inventory WHERE id = ?", [inventoryId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting inventory", error: err });
    if (isNaN(inventoryId)) {
      return res.status(400).json({ message: "Invalid inventory ID" });
    }    
    res.json({ message: "Inventory deleted successfully" });
  });
});
 
const nodemailer = require("nodemailer");

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // Your email
    pass: process.env.EMAIL_PASS   // Your email password
  }
});

// Function to send low-stock alert email
const sendLowStockAlert = (store, product, quantity, min_stock_level) => {
    const mailOptions = {
        from: `"Inventory POS-system" <${process.env.EMAIL_USER}>`, // Custom sender name
        to: process.env.ALERT_EMAIL,
        subject: "Low Stock Alert - Inventory Management",
        text: `Warning! The stock for "${product}" in "${store}" is low.\n\nCurrent Quantity: ${quantity}\nMinimum Stock Level: ${min_stock_level}\n\nPlease restock soon.`
      };
      

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Low stock alert email sent:", info.response);
    }
  });
};

  

module.exports = router;
