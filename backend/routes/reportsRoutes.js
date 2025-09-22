const express = require("express");
const db = require("../db");
const router = express.Router();
const { authenticateUser, authorizeAdmin } = require("../middlewares/authMiddleware");
const json2csv = require("json2csv").parse;
const PDFDocument = require("pdfkit");
const fs = require("fs");

// 📌 Export Sales Data as CSV
router.get("/sales/csv", authenticateUser, authorizeAdmin, async (req, res) => {
  db.query(
    `SELECT sales.id, stores.name AS store_name, products.name AS product_name, 
            sales.quantity, sales.total_price, sales.sold_at 
     FROM sales 
     JOIN stores ON sales.store_id = stores.id 
     JOIN products ON sales.product_id = products.id`,
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No sales data available to export" });
      }      
      try {
        const csv = json2csv(results, { fields: ["id", "store_name", "product_name", "quantity", "total_price", "sold_at"] });
        res.setHeader("Content-Disposition", "attachment; filename=sales_report.csv");
        res.set("Content-Type", "text/csv");
        res.status(200).send(csv);
      } catch (csvError) {
        res.status(500).json({ message: "Error generating CSV", error: csvError });
      }
    }
  );
});

// 📌 Export Inventory Data as CSV
router.get("/inventory/csv", authenticateUser, authorizeAdmin, async (req, res) => {
  db.query(
    `SELECT inventory.id, stores.name AS store_name, products.name AS product_name, 
            inventory.quantity, inventory.min_stock_level 
     FROM inventory 
     JOIN stores ON inventory.store_id = stores.id 
     JOIN products ON inventory.product_id = products.id`,
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No inventory data available to export" });
      }      
      try {
        const csv = json2csv(results, { fields: ["id", "store_name", "product_name", "quantity", "min_stock_level"] });
        res.setHeader("Content-Disposition", "attachment; filename=inventory_report.csv");
        res.set("Content-Type", "text/csv");
        res.status(200).send(csv);
      } catch (csvError) {
        res.status(500).json({ message: "Error generating CSV", error: csvError });
      }
    }
  );
});

// 📌 Export Sales Report as PDF
router.get("/sales/pdf", authenticateUser, authorizeAdmin, (req, res) => {
  db.query(
    `SELECT sales.id, stores.name AS store_name, products.name AS product_name, 
            sales.quantity, sales.total_price, sales.sold_at 
     FROM sales 
     JOIN stores ON sales.store_id = stores.id 
     JOIN products ON sales.product_id = products.id`,
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No sales data available for PDF generation" });
      }      
      const doc = new PDFDocument();
      const filename = "sales_report.pdf";
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.setHeader("Content-Type", "application/pdf");

      doc.pipe(res);
      doc.fontSize(20).text("Sales Report", { align: "center" });
      doc.moveDown(2);

      results.forEach((sale) => {
        doc.fontSize(12).text(`Store: ${sale.store_name}`);
        doc.text(`Product: ${sale.product_name}`);
        doc.text(`Quantity: ${sale.quantity}`);
        doc.text(`Total Price: $${sale.total_price}`);
        doc.text(`Date: ${sale.sold_at}`);
        doc.moveDown(1);
      });

      doc.end();
    }
  );
});

module.exports = router;
