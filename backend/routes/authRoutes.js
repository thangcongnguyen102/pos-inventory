const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// Register a new user
// router.post("/register", async (req, res) => {
//   const { username, password, role } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   db.query(
//     "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
//     [username, hashedPassword, role || "employee"],
//     (err, result) => {
//       if (err) {
//         return res.status(500).json({ message: "Error registering user", error: err });
//       }
//       res.status(201).json({ message: "User registered successfully" });
//     }
//   );
// });
// Register a new user
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  // Kiểm tra đầu vào: username và password không được rỗng
  if (!username || !password || username.trim() === "" || password.trim() === "") {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role || "employee"],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error registering user", error: err });
        }
        res.status(200).json({ message: "User registered successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login
// router.post("/login", (req, res) => {
//   const { username, password } = req.body;

//   db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error" });

//     if (results.length === 0) return res.status(401).json({ message: "User not found" });

//     const user = results[0];
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.json({ message: "Login successful", token, role: user.role });
//   });
// });
// Login
// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!username || !password || username.trim() === "" || password.trim() === "") {
    return res.status(400).json({ message: "Username and password are required." });
  }

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" }); 
    }

    const user = results[0];

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        role: user.role
      });
    } catch (compareError) {
      return res.status(500).json({ message: "Server error", error: compareError });
    }
  });
});

module.exports = router;
