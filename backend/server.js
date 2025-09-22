require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const path = require("path");
const db = require("./db");
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Inventory Management API is running...");
});

// Import and use routes
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/stores", require("./routes/storeRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/sales", require("./routes/salesRoutes"));
app.use("/api/stock-transfers", require("./routes/stockTransferRoutes"));
app.use("/api/employees", require("./routes/usersRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/reports", require("./routes/reportsRoutes"));

 app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});


// if (require.main === module) {
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }

// module.exports = app;










