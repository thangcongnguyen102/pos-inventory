// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/login", { username, password });
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("role", response.data.role);
//       navigate("/dashboard");
//     } catch (error) {
//       alert("Invalid credentials");
//     }
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-semibold text-gray-700 text-center">Login</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           className="w-full p-3 mt-4 border rounded-md"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-3 mt-2 border rounded-md"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 mt-4 rounded-md" onClick={handleLogin}>
//           Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// const LoginPage = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/login", { username, password });
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("role", response.data.role);
//       navigate("/dashboard");
//     } catch (error) {
//       alert("Invalid credentials");
//     }
//   };

//   return (
//     <div 
//       className="flex h-screen items-center justify-center bg-cover bg-center"
//       style={{ backgroundImage: "url('/backgroundlogin.jpg')" }} // ✅ Use the background image
//     >
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-xl shadow-lg"
//       >
//         {/* Logo */}
//         <div className="flex justify-center">
//           <img src="/logopos.png" alt="POS Logo" className="h-16 mb-4" />
//         </div>

//         {/* Title */}
//         <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Welcome Back</h2>

//         {/* Username Input */}
//         <motion.input 
//           type="text" 
//           placeholder="Username" 
//           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-3"
//           value={username} 
//           onChange={(e) => setUsername(e.target.value)} 
//           whileFocus={{ scale: 1.05 }}
//         />

//         {/* Password Input */}
//         <motion.input 
//           type="password" 
//           placeholder="Password" 
//           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//           whileFocus={{ scale: 1.05 }}
//         />

//         {/* Login Button */}
//         <motion.button 
//           className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg shadow-md"
//           onClick={handleLogin}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           Login
//         </motion.button>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// const LoginPage = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/login", { username, password });
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("role", response.data.role);
//       navigate("/dashboard");
//     } catch (error) {
//       alert("Invalid credentials");
//     }
//   };

//   return (
//     <div 
//       className="flex h-screen items-center justify-center bg-cover bg-center"
//       style={{ backgroundImage: "url('/backgroundlogin.jpg')" }} // ✅ Background Image
//     >
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-xl shadow-lg"
//       >
//         {/* Logo */}
//         <div className="flex justify-center">
//           <img src="/logopos.png" alt="POS Logo" className="h-16 mb-4" />
//         </div>

//         {/* Title */}
//         <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Welcome Back</h2>

//         {/* Login Form */}
//         <form 
//           onSubmit={(e) => {
//             e.preventDefault(); // Prevents page refresh
//             handleLogin(); // Calls login function
//           }}
//         >
//           {/* Username Input */}
//           <motion.input 
//             type="text" 
//             placeholder="Username" 
//             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-3"
//             value={username} 
//             onChange={(e) => setUsername(e.target.value)} 
//             whileFocus={{ scale: 1.05 }}
//           />

//           {/* Password Input */}
//           <motion.input 
//             type="password" 
//             placeholder="Password" 
//             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             whileFocus={{ scale: 1.05 }}
//           />

//           {/* Login Button */}
//           <motion.button 
//             type="submit"  // ✅ This allows "Enter" to trigger login
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg shadow-md"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Login
//           </motion.button>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁 Toggle state
  const [error, setError] = useState(""); // ✅ State for error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents page refresh

    // ✅ Validation: Check if fields are empty
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { username, password });

      // ✅ If login is successful, save token and navigate
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", username);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid username or password."); // ✅ Show error for incorrect credentials
    }
  };

  return (
    <div 
      className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/backgroundlogin.jpg')" }} // ✅ Background Image
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-xl shadow-lg"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <img src="/logopos.png" alt="POS Logo" className="h-16 mb-4" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Welcome Back</h2>

        {/* Show Error Message if Exists */}
        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Username Input */}
          <motion.input 
            type="text" 
            placeholder="Username" 
            autoComplete="username"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-3"
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            whileFocus={{ scale: 1.05 }}
          />

           {/* Password with Show/Hide */}
           <div className="relative mb-4">
            <motion.input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              autoComplete="current-password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              whileFocus={{ scale: 1.05 }}
            />
            <div 
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          

          {/* Login Button */}
          <motion.button 
            type="submit"  // ✅ This allows "Enter" to trigger login
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
