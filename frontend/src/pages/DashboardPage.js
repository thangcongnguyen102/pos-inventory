// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Button, Container, Typography, Box, Grid } from "@mui/material";

// const DashboardPage = () => {
//   const navigate = useNavigate();
//   const role = localStorage.getItem("role");

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ mt: 5, textAlign: "center" }}>
//         <Typography variant="h4">Dashboard</Typography>
//         <Grid container spacing={2} sx={{ mt: 3 }}>
//           {role === "admin" && (
//             <>
//               <Grid item xs={6}>
//                 <Button variant="contained" fullWidth onClick={() => navigate("/inventory")}>
//                   Manage Inventory
//                 </Button>
//               </Grid>
//               <Grid item xs={6}>
//                 <Button variant="contained" fullWidth onClick={() => navigate("/stock-transfer")}>
//                   Transfer Stock
//                 </Button>
//               </Grid>
//             </>
//           )}
//           <Grid item xs={6}>
//             <Button variant="contained" fullWidth onClick={() => navigate("/sales")}>
//               Record Sales
//             </Button>
//           </Grid>
//           <Grid item xs={6}>
//             <Button variant="contained" fullWidth onClick={() => navigate("/profile")}>
//               Profile
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>
//     </Container>
//   );
// };

// export default DashboardPage;
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Card } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { motion } from "framer-motion";


// const DashboardPage = () => {
//   const navigate = useNavigate();
//   const role = localStorage.getItem("role");

//   return (
//     <div className="h-screen bg-gray-100 flex flex-col items-center justify-center">
//       <motion.div 
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6"
//       >
//         <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Dashboard</h2>
        
//         <div className="grid grid-cols-2 gap-4">
//           {role === "admin" && (
//             <>
//               <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => navigate("/inventory")}>
//                 Manage Inventory
//               </Button>
//               <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={() => navigate("/stock-transfer")}>
//                 Transfer Stock
//               </Button>
//             </>
//           )}
//           <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => navigate("/sales")}>
//             Record Sales
//           </Button>
//           <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white" onClick={() => navigate("/profile")}>
//             Profile
//           </Button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default DashboardPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, CartesianGrid, Line } from "recharts";


const DashboardPage = () => {
  const [stats, setStats] = useState({ total_sales: 0, total_revenue: 0 });
  const [lowStockItems, setLowStockItems] = useState([]);
  const token = localStorage.getItem("token");
  const [dailySales, setDailySales] = useState([]);
  const role = localStorage.getItem("role") || ""; // Ensure role is always defined

  const downloadCSV = async (type) => {
    if (role !== "admin") {
      alert("Only admins can download reports.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reports/${type}/csv`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to download CSV");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${type}_report.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      alert("Failed to download CSV.");
    }
  };

  const downloadPDF = async (type) => {
    if (role !== "admin") {
      alert("Only admins can download reports.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reports/${type}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to download PDF");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${type}_report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF.");
    }
  };
  useEffect(() => {
    fetchSalesStats();
    fetchLowStock();
    fetchDailySales();
  }, []);

  // 📌 Fetch Sales Stats
  const fetchSalesStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/dashboard/sales/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching sales stats:", error);
    }
  };

/////
  const fetchDailySales = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/dashboard/sales/stats/daily-sales", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const formattedData = response.data.map((sale) => ({
        ...sale,
        sale_date: new Date(sale.sale_date).toLocaleDateString("en-GB"), // "DD/MM/YYYY"
      }));
      setDailySales(formattedData);
    } catch (error) {
      console.error("Error fetching daily sales:", error);
    }
  };



  // 📌 Fetch Low Stock Alerts
  const fetchLowStock = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/dashboard/inventory/low-stock", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLowStockItems(response.data);
    } catch (error) {
      console.error("Error fetching low stock items:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">📊 Dashboard</h2>
      {/* 📌 Show Export Buttons ONLY if Admin */}
      {role === "admin" && (
        <div className="mb-6 flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => downloadCSV("sales")}>
            📥 Export Sales CSV
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => downloadPDF("sales")}>
            📄 Export Sales PDF
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => downloadCSV("inventory")}>
            📥 Export Inventory CSV
          </button>
        </div>
      )}



      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold">🛒 Total Sales</h3>
          <p className="text-3xl font-semibold">{stats.total_sales}</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold">💰 Total Revenue</h3>
          <p className="text-3xl font-semibold">
  ${stats.total_revenue ? Number(stats.total_revenue).toFixed(2) : "0.00"}</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg">
    <h3 className="text-lg font-semibold">🏆 Top Product</h3>
    <p className="text-3xl font-semibold">{stats.top_selling_product}</p>
  </div>
      </div>

      {/* Sales Chart */}
      <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
      <h3 className="text-xl font-bold mb-4">📈 Sales Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
  <BarChart data={dailySales}>
    <XAxis dataKey="sale_date" />
    <YAxis domain={[0, "auto"]} tickCount={15} allowDecimals={false} />
    <Tooltip />
    <Bar dataKey="total_products_sales" fill="#4CAF50" />
  </BarChart>
</ResponsiveContainer>

    </div>

      {/* Low Stock Alerts */}
      <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
        <h3 className="text-xl font-bold mb-4">⚠️ Low Stock Alerts</h3>
        {lowStockItems.length === 0 ? (
          <p className="text-gray-600">✅ No low stock items.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 w-1/5 text-left">Product</th>
                <th className="border p-3 w-1/5 text-left">Store</th>
                <th className="border p-3 w-1/5 text-left">Quantity</th>
                <th className="border p-3 w-1/5 text-left">Min Stock Level</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item, index) => (
                <tr key={index} className="border">
                  <td className="border p-3 w-1/5 text-left">{item.product_name}</td>
                  <td className="border p-3 w-1/5 text-left">{item.store_name}</td>
                  <td className="border p-3 w-1/5 text-red-500 font-bold text-left">{item.quantity}</td>
                  <td className="border p-3 w-1/10 text-left">{item.min_stock_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
