// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import DashboardPage from "./pages/DashboardPage";
// import InventoryPage from "./pages/InventoryPage";
// import SalesPage from "./pages/SalesPage";
// import StockTransferPage from "./pages/StockTransferPage";
// import StoreManagementPage from "./pages/StoreManagementPage";
// import UserProfilePage from "./pages/UserProfilePage";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/dashboard" element={<DashboardPage />} />
//         <Route path="/inventory" element={<InventoryPage />} />
//         <Route path="/sales" element={<SalesPage />} />
//         <Route path="/stock-transfer" element={<StockTransferPage />} />
//         <Route path="/stores" element={<StoreManagementPage />} />
//         <Route path="/profile" element={<UserProfilePage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import SalesPage from "./pages/SalesPage";
import InventoryPage from "./pages/InventoryPage";
import ProductsPage from "./pages/ProductsPage";
import StoresPage from "./pages/StoresPage"; // ✅ Import the Stores Page
import StockTransfersPage from "./pages/StockTransfersPage";
import DashboardPage from "./pages/DashboardPage";
//
import EmployeesPage from "./pages/EmployeesPage";
///


////
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/stock-transfers" element={<StockTransfersPage />} /> {/* ✅ Added Stock Transfers Route */}
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/employees" element={<EmployeesPage />} />



        {/* Add more routes later */}
      </Routes>
    </Router>
  );
}

export default App;
