// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     navigate("/");
//   };

//   return (
//     <nav className="bg-white shadow-md p-4 flex justify-between items-center">
//       <Link to="/" className="flex items-center space-x-2">
//         <img src="/5.png" alt="POS Logo" className="h-10 w-10" />  
//         <span className="text-2xl font-bold italic text-gray-800">POS System</span>
//       </Link>

//       <div className="space-x-4">
//         <Link to="/products" className="text-gray-600 hover:text-gray-800">Products</Link>
//         <Link to="/sales" className="text-gray-600 hover:text-gray-800">Sales</Link>
//         {token ? (
//           <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleLogout}>
//             Logout
//           </button>
//         ) : (
//           <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md">Login</Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token"); // ✅ Check if user is logged in
//   const role = localStorage.getItem("role"); // ✅ Get user role (optional for role-based access)

//   const username = localStorage.getItem("username"); // ✅ Get username from localStorage

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");

//     localStorage.removeItem("username"); // ✅ Remove username on logout

//     navigate("/"); // Redirect to home after logout
//   };

//   return (
//     <nav className="bg-white shadow-md p-4 flex justify-between items-center">
//       {/* Logo */}
//       <Link to="/" className="flex items-center space-x-2">
//         <img src="/logopos.png" alt="POS Logo" className="h-10 w-10" />
//         <span className="text-2xl font-bold italic text-gray-800">POS System</span>
//       </Link>

//       {/* Navigation Links */}
//       <div className="space-x-4">
//         {token && ( // ✅ Show only if logged in
//           <>
//             <Link to="/" className="text-gray-600 hover:text-gray-800">🏠Home</Link>
//             <Link to="/sales" className="text-gray-600 hover:text-gray-800">📊Sales</Link>
//             <Link to="/products" className="text-gray-600 hover:text-gray-800">📦Products</Link>
//             <Link to="/inventory" className="text-gray-600 hover:text-gray-800">📋Inventory</Link>
//             <Link to="/stores" className="text-gray-600 hover:text-gray-800">🏬Stores</Link>
//             <Link to="/stock-transfers" className="text-gray-600 hover:text-gray-800">🔄Stock Transfers</Link>
//           </>
//         )}


//         {/* Show Username if Logged In */}
//         {token && (
//           <span className="text-gray-700 font-semibold">Hello, {username} 👋</span>
//         )}
        

//         {/* Login & Logout Buttons */}
//         {token ? (
//           <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleLogout}>
//             Logout
//           </button>
//         ) : (
//           <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md">Login</Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React, { useState } from "react";
//import React, { useState, useEffect } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";
import {FaBars, FaTimes, FaStore, FaBox, FaShoppingCart, FaExchangeAlt, FaChartBar, FaUser, FaSignOutAlt, FaStoreAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token"); 
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username"); 
  const [menuOpen, setMenuOpen] = useState(false);
  //
    
  //

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/"); 
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4 ">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logopos.png" alt="POS Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold italic text-gray-800">POS System</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {token && (
            <>
              <NavItem to="/dashboard" icon={<FaChartBar />} label="Dashboard" location={location} />
              <NavItem to="/sales" icon={<FaShoppingCart />} label="Sales" location={location} />
              <NavItem to="/products" icon={<FaBox />} label="Products" location={location} />
              <NavItem to="/inventory" icon={<FaStore />} label="Inventory" location={location} />
              <NavItem to="/stores" icon={<FaStoreAlt />} label="Stores" location={location} />
              <NavItem to="/stock-transfers" icon={<FaExchangeAlt />} label="Stock Transfers" location={location} />
              {role === "admin" && (
              <NavItem to="/employees" icon={<FaUser />} label="Employees" location={location} />
              )}

            </>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="hidden md:flex items-center space-x-4">
          {token ? (
            <div className="relative group">
              <button className="flex items-center text-gray-700 font-semibold">
                <FaUser className="mr-2" /> Hello, {username} 👋
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
                

              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md">Login</Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md p-4">
          {token && (
            <>
              <MobileNavItem to="/dashboard" icon={<FaChartBar />} label="Dashboard" setMenuOpen={setMenuOpen} />
              <MobileNavItem to="/sales" icon={<FaShoppingCart />} label="Sales" setMenuOpen={setMenuOpen} />
              <MobileNavItem to="/products" icon={<FaBox />} label="Products" setMenuOpen={setMenuOpen} />
              <MobileNavItem to="/inventory" icon={<FaStore />} label="Inventory" setMenuOpen={setMenuOpen} />
              <MobileNavItem to="/stores" icon={<FaStoreAlt />} label="Stores" setMenuOpen={setMenuOpen} />
              <MobileNavItem to="/stock-transfers" icon={<FaExchangeAlt />} label="Stock Transfers" setMenuOpen={setMenuOpen} />
              {role === "admin" && (
  <MobileNavItem to="/employees" icon={<FaUser />} label="Employees" setMenuOpen={setMenuOpen} />
)}

            </>
          )}
          {token ? (
            <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-red-600">
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          ) : (
            <Link to="/login" className="block text-center bg-indigo-600 text-white px-4 py-2 rounded-md">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

// **Reusable NavItem Component**
const NavItem = ({ to, icon, label, location }) => (
  <Link to={to} className={`flex items-center space-x-2 text-gray-600 hover:text-gray-800 ${location.pathname === to ? "font-bold text-indigo-600" : ""}`}>
    {icon} <span>{label}</span>
  </Link>
);

// **Reusable MobileNavItem Component**
const MobileNavItem = ({ to, icon, label, setMenuOpen }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-2 border-b"
    onClick={() => setMenuOpen(false)}
  >
    {icon} <span>{label}</span>
  </Link>
);

export default Navbar;
