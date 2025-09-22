const express = require("express");
const db = require("../db");
const router = express.Router();
const { authenticateUser, authorizeAdmin } = require("../middlewares/authMiddleware");

// 📌 Get Sales Statistics
router.get("/sales/stats", authenticateUser, (req, res) => {
  db.query(
    `SELECT 
      COUNT(id) AS total_sales, 
      SUM(total_price) AS total_revenue, 
      (SELECT name FROM products WHERE id = 
        (SELECT product_id FROM sales GROUP BY product_id ORDER BY SUM(quantity) DESC LIMIT 1)
      ) AS top_selling_product
    FROM sales`,
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      // const stats = results[0] || { total_sales: 0, total_revenue: 0 }; // Default values
      // res.json({
      //   total_sales: stats.total_sales || 0,
      //   total_revenue: stats.total_revenue ? Number(stats.total_revenue) : 0, // Ensure it's a number
      //   top_selling_product: stats.top_selling_product || 0,
      // });
      if (!Array.isArray(results) || results.length === 0) {
        return res.status(404).json({ message: "No sales statistics available" });
      }

      const stats = results[0];
      res.json({
        total_sales: stats.total_sales || 0,
        total_revenue: stats.total_revenue ? Number(stats.total_revenue) : 0,
        top_selling_product: stats.top_selling_product || "N/A",
      });
      
    }
  );
});

router.get("/sales/stats/daily-sales", authenticateUser, (req, res) => {
  db.query(
    `SELECT DATE(sold_at) AS sale_date, SUM(quantity) AS total_products_sales 
     FROM sales 
     GROUP BY sale_date 
     ORDER BY sale_date ASC`,
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No daily sales data available" });
      }
      res.json(results);
    }
  );
});
// 📌 Get Low Stock Alerts
router.get("/inventory/low-stock", authenticateUser, (req, res) => {
  db.query(
    `SELECT 
        products.name AS product_name, 
        stores.name AS store_name, 
        inventory.quantity, 
        inventory.min_stock_level 
     FROM inventory
     JOIN products ON inventory.product_id = products.id
     JOIN stores ON inventory.store_id = stores.id
     WHERE inventory.quantity < inventory.min_stock_level`,
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      res.json(results);
    }
  );
});

module.exports = router;
