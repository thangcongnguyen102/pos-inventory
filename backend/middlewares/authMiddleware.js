const jwt = require("jsonwebtoken");

// Middleware to check authentication
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  // if (!token) {
  //   return res.status(401).json({ message: "Access denied. No token provided." });
  // }
  if (!token) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Not authenticated the user"
    });
  }
  
  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware to check admin access
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Middleware to check employee access (only sales & inventory viewing)
const authorizeEmployee = (req, res, next) => {
  if (req.user.role !== "employee" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Employees only." });
  }
  next();
};

module.exports = { authenticateUser, authorizeAdmin, authorizeEmployee };
