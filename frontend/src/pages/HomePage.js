// import React from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// const HomePage = () => {
//   return (
//     <div className="relative bg-gray-100 h-screen">
//       {/* Background Image */}
//       <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/2.jpg')" }}></div>


//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//       {/* Content */}
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white"
//       >
//         <h1 className="text-5xl font-bold mb-4">The Best POS System for Your Sales</h1>
//         <p className="text-lg mb-6">Manage your inventory and sales seamlessly.</p>
//         <div className="flex space-x-4">
//           <Link to="/login" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg">
//             Get Started
//           </Link>
//         </div>
//       </motion.div>
//     </div>

//   );
// };

// export default HomePage;



import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center text-center text-white">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/2.jpg')" }} // Replace with actual image in `public/`
        ></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

              {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

     {/* Content */}
      <motion.div
         initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8 }}
         className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white"
       >
         <h1 className="text-5xl font-bold mb-4">The Best POS System for Your Sales</h1>
         <p className="text-lg mb-6">Manage your inventory and sales seamlessly.</p>
         <div className="flex space-x-4">
          <Link to="/login" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg">
             Get Started
           </Link>
         </div>
       </motion.div>
     </div>

      {/* Features Section */}
      <section className="container mx-auto py-20">
        <h2 className="text-4xl font-bold text-center mb-10">Why Choose Our POS System?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <img src="/feature1.jpg" alt="Feature 1" className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-semibold">Easy Inventory Management</h3>
            <p className="text-gray-600 mt-2">Track stock levels and automate restocking.</p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <img src="/feature2.jpg" alt="Feature 2" className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-semibold">Seamless Sales Processing</h3>
            <p className="text-gray-600 mt-2">Process payments quickly and securely.</p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <img src="/feature3.jpg" alt="Feature 3" className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-semibold">Detailed Sales Reports</h3>
            <p className="text-gray-600 mt-2">Analyze performance with real-time insights.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
