const express = require("express");
const db = require("../db");

const router = express.Router();

const { authenticateUser, authorizeAdmin, authorizeEmployee } = require("../middlewares/authMiddleware");


// Get all stores
//router.get("/", (req, res) => {
router.get("/", authenticateUser, (req, res) => {
  db.query("SELECT * FROM stores", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// Get a store by ID
//router.get("/:id", (req, res) => {
router.get("/:id",authenticateUser,  (req, res) => {
  const storeId = req.params.id;
  db.query("SELECT * FROM stores WHERE id = ?", [storeId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Store not found" });
    res.json(results[0]);
  });
});

// Create a new store
//router.post("/", (req, res) => {
// router.post("/",authenticateUser, authorizeAdmin, (req, res) => {
//   const { name, location } = req.body;
//   db.query(
//     "INSERT INTO stores (name, location) VALUES (?, ?)",
//     [name, location],
//     (err, result) => {
//       if (err) return res.status(500).json({ message: "Error adding store", error: err });
//       res.status(201).json({ message: "Store added successfully", storeId: result.insertId });
//     }
//   );
// });


router.post("/", authenticateUser, authorizeAdmin, (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: "Store name and location are required" });
  }

  // Check if store name already exists
  db.query("SELECT * FROM stores WHERE name = ?", [name], (err, existing) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (existing.length > 0) {
      return res.status(409).json({ message: "Store name already exists" });
    }

    db.query(
      "INSERT INTO stores (name, location) VALUES (?, ?)",
      [name, location],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Error adding store", error: err });
        res.status(201).json({ message: "Store added successfully", storeId: result.insertId });
      }
    );
  });
});

// Update a store
//router.put("/:id", (req, res) => {
// router.put("/:id", authenticateUser, authorizeAdmin, (req, res) => {
//   const storeId = req.params.id;
//   const { name, location } = req.body;
//   db.query(
//     "UPDATE stores SET name = ?, location = ? WHERE id = ?",
//     [name, location, storeId],
//     (err, result) => {
//       if (err) return res.status(500).json({ message: "Error updating store", error: err });
//       res.json({ message: "Store updated successfully" });
//     }
//   );
// });

router.put("/:id", authenticateUser, authorizeAdmin, (req, res) => {
  const storeId = req.params.id;
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: "Store name and location are required" });
  }

  // Check if the new store name (if changed) already exists in another store
  db.query("SELECT * FROM stores WHERE name = ? AND id != ?", [name, storeId], (err, existing) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (existing.length > 0) {
      return res.status(409).json({ message: "Another store with this name already exists" });
    }

    db.query(
      "UPDATE stores SET name = ?, location = ? WHERE id = ?",
      [name, location, storeId],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating store", error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Store not found" });
        res.json({ message: "Store updated successfully" });
      }
    );
  });
});

// Delete a store
//router.delete("/:id", (req, res) => {
router.delete("/:id", authenticateUser, authorizeAdmin, (req, res) => {
  const storeId = req.params.id;
  db.query("DELETE FROM stores WHERE id = ?", [storeId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting store", error: err });
    res.json({ message: "Store deleted successfully" });
  });
});

module.exports = router;
