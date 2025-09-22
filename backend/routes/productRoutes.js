const express = require("express");
const multer = require("multer");
const db = require("../db");
const fs = require("fs");
const path = require("path");

const { authenticateUser, authorizeAdmin } = require("../middlewares/authMiddleware");
// ✅ Ensure the uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const router = express.Router();
// ✅ Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ✅ Save files to "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // ✅ Rename file with timestamp
  },
});
const upload = multer({ storage: storage });
// Get all products
//router.get("/", (req, res) => {
router.get("/", authenticateUser, (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});
// Get a product by ID
router.get("/:id", authenticateUser, (req, res) => {
  const productId = req.params.id;
  if (isNaN(productId)) return res.status(400).json({ message: "Invalid product ID" });
  db.query("SELECT * FROM products WHERE id = ?", [productId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(results[0]);
  });
});
// Create a new product
  router.post("/", authenticateUser, authorizeAdmin, upload.single("image"), (req, res) => {
    try {
      const { name, sku, description, price } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  
      if (!name || !sku || !description || !price) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      db.query("SELECT * FROM products WHERE sku = ?", [sku], (err, existing) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        if (existing.length > 0) return res.status(409).json({ message: "Product with the same SKU already exists" });
  
      db.query(
        "INSERT INTO products (name, sku, description, price, image) VALUES (?, ?, ?, ?, ?)",
        [name, sku, description, price, imageUrl],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Database error", error: err });
          }
          res.status(201).json({ message: "Product added successfully", productId: result.insertId });
        }
      );
    });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
// Update a product
//Update Product (with Optional Image Upload)
router.put("/:id", authenticateUser, authorizeAdmin, upload.single("image"), (req, res) => {
  const productId = req.params.id;
  const { name, sku, description, price } = req.body;
  const newImage = req.file ? `/uploads/${req.file.filename}` : null;

  //If there's a new image, update the image URL
  let query = "UPDATE products SET name = ?, sku = ?, description = ?, price = ? WHERE id = ?";
  let params = [name, sku, description, price, productId];

  db.query("SELECT * FROM products WHERE id = ?", [productId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Product not found" });
    
  if (newImage) {
    query = "UPDATE products SET name = ?, sku = ?, description = ?, price = ?, image = ? WHERE id = ?";
    params = [name, sku, description, price, newImage, productId];
  }
  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({ message: "Product updated successfully" });
  });
});
});
//Serve uploaded images as static files
router.use("/uploads", express.static("uploads"));

// Delete a product
  router.delete("/:id", authenticateUser, authorizeAdmin, (req, res) => {
    const productId = req.params.id;
  
    if (isNaN(productId)) return res.status(400).json({ message: "Invalid product ID" });
  
    db.query("SELECT * FROM products WHERE id = ?", [productId], (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      if (results.length === 0) return res.status(404).json({ message: "Product not found" });
  
      const imagePath = results[0].image ? path.join(__dirname, "..", results[0].image) : null;
  
      db.query("DELETE FROM products WHERE id = ?", [productId], (err, result) => {
        if (err) return res.status(500).json({ message: "Error deleting product", error: err });
        // Optional: remove image file
        if (imagePath && fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }  
        res.json({ message: "Product deleted successfully" });
      });
    });
  });
module.exports = router;
