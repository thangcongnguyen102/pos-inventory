const express = require("express");
const db = require("../db");
const bcrypt = require("bcryptjs");
const { authenticateUser, authorizeAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Get all employees (admin only)
router.get("/", authenticateUser, authorizeAdmin, (req, res) => {
  db.query("SELECT id, username, role FROM users WHERE role = 'employee'", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching employees", error: err });
    res.json(results);
  });
});

// // 🔹 Add new employee
// router.post("/", authenticateUser, authorizeAdmin, async (req, res) => {
//   const { username, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   db.query(
//     "INSERT INTO users (username, password, role) VALUES (?, ?, 'employee')",
//     [username, hashedPassword],
//     (err, result) => {
//       if (err) return res.status(500).json({ message: "Error creating employee", error: err });
//       //res.status(201).json({ message: "Employee created successfully" });
//       res.status(201).json({ message: "Employee created successfully", employeeId: result.insertId });

//     }
//   );
// });
// 🔹 Add new employee
router.post("/", authenticateUser, authorizeAdmin, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check for duplicate username
  db.query("SELECT id FROM users WHERE username = ?", [username], async (err, existing) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (existing.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, 'employee')",
        [username, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ message: "Error creating employee", error: err });
          res.status(201).json({ message: "Employee created successfully", employeeId: result.insertId });
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Error hashing password", error });
    }
  });
});
// 🔹 Update employee
// router.put("/:id", authenticateUser, authorizeAdmin, (req, res) => {
//   const { username, password } = req.body;
//   const userId = req.params.id;

//   const updates = [];
//   const values = [];

//   if (username) {
//     updates.push("username = ?");
//     values.push(username);
//   }

//   if (password) {
//     const hashedPassword = bcrypt.hashSync(password, 10);
//     updates.push("password = ?");
//     values.push(hashedPassword);
//   }

//   if (updates.length === 0) return res.status(400).json({ message: "No data to update" });

//   values.push(userId);

//   db.query(
//     `UPDATE users SET ${updates.join(", ")} WHERE id = ? AND role = 'employee'`,
//     values,
//     (err, result) => {
//       if (err) return res.status(500).json({ message: "Error updating employee", error: err });
//       res.json({ message: "Employee updated successfully" });
//     }
//   );
// });
// // 🔹 Update employee
// router.put("/:id", authenticateUser, authorizeAdmin, async (req, res) => {
//   const { username, password } = req.body;
//   const userId = req.params.id;

//   const updates = [];
//   const values = [];

//   try {
//     if (username) {
//       updates.push("username = ?");
//       values.push(username);
//     }

//     if (password) {
//       const hashedPassword = await bcrypt.hash(password, 10); // 🔄 Await async hash
//       updates.push("password = ?");
//       values.push(hashedPassword);
//     }

//     if (updates.length === 0) {
//       return res.status(400).json({ message: "No data to update" });
//     }

//     values.push(userId); // ✅ Add ID to values

//     db.query(
//       `UPDATE users SET ${updates.join(", ")} WHERE id = ? AND role = 'employee'`,
//       values,
//       (err, result) => {
//         if (err) {
//           console.error("DB Update Error:", err); // Log for debugging
//           return res.status(500).json({ message: "Error updating employee", error: err });
//         }

//         if (result.affectedRows === 0) {
//           return res.status(404).json({ message: "Employee not found or invalid role" });
//         }

//         res.json({ message: "Employee updated successfully" });
//       }
//     );
//   } catch (error) {
//     console.error("Hashing error:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });
// 🔹 Update employee
router.put("/:id", authenticateUser, authorizeAdmin, async (req, res) => {
  const { username, password } = req.body;
  const userId = req.params.id;

  const updates = [];
  const values = [];

  try {
    if (username) {
      updates.push("username = ?");
      values.push(username);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // 🔄 Await async hash
      updates.push("password = ?");
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No data to update" });
    }

    values.push(userId); // ✅ Add ID to values

    db.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ? AND role = 'employee'`,
      values,
      (err, result) => {
        if (err) {
          console.error("DB Update Error:", err); // Log for debugging
          return res.status(500).json({ message: "Error updating employee", error: err });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Employee not found or invalid role" });
        }

        res.json({ message: "Employee updated successfully" });
      }
    );
  } catch (error) {
    console.error("Hashing error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// 🔹 Delete employee
router.delete("/:id", authenticateUser, authorizeAdmin, (req, res) => {
  const userId = req.params.id;
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid employee ID" });
  }
  // db.query("DELETE FROM users WHERE id = ? AND role = 'employee'", [userId], (err, result) => {
  //   if (err) return res.status(500).json({ message: "Error deleting employee", error: err });
  //   res.json({ message: "Employee deleted successfully" });
  db.query("DELETE FROM users WHERE id = ? AND role = 'employee'", [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting employee", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  });
});

module.exports = router;
