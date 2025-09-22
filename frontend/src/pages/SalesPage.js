import React, { useEffect, useState } from "react";
import axios from "axios";




const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ State for success messages
  const [storeId, setStoreId] = useState(""); // Store filtering
  const [newSale, setNewSale] = useState({ store_id: "", product_id: "", quantity: "" }); // Form input
  const role = localStorage.getItem("role"); // Get user role (admin/employee)
  const token = localStorage.getItem("token"); // Authentication token
  const [showDeletePopup, setShowDeletePopup] = useState(false); // ✅ Controls delete confirmation popup
  const [saleToDelete, setSaleToDelete] = useState(null); // ✅ Stores sale to delete
  
  // ✅ Fetch All Sales
  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sales", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  // ✅ Fetch Sales by Store
  const fetchSalesByStore = async () => {
    if (!storeId) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/sales/store/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sales by store:", error);
    }
  };

  // ✅ Add New Sale (Employees & Admins)
  const handleAddSale = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/sales", newSale, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setSuccessMessage("Sale added successfully! ✅"); // ✅ Set success message
      fetchSales(); // Refresh sales list
      setNewSale({ store_id: "", product_id: "", quantity: "" }); // Reset form
  
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setSuccessMessage("❌ Error adding sale. Check stock availability.");
      setTimeout(() => setSuccessMessage(""), 3000);
      console.error("Error adding sale:", error);
    }
  };
  const confirmDeleteSale = (saleId) => {
    setSaleToDelete(saleId);
    setShowDeletePopup(true); // ✅ Show delete confirmation popup
  };
  const handleConfirmDeleteSale = async () => {
    if (!saleToDelete) return;
  
    try {
      await axios.delete(`http://localhost:5000/api/sales/${saleToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setSuccessMessage("Sale deleted successfully! 🗑️");
      fetchSales(); // Refresh sales list
    } catch (error) {
      setSuccessMessage("❌ Error deleting sale.");
    } finally {
      setShowDeletePopup(false); // ✅ Close popup
      setSaleToDelete(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };
  

  // ✅ Delete Sale (Admins Only)
  const handleDeleteSale = async (saleId) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/sales/${saleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setSuccessMessage("Sale deleted successfully! 🗑️"); // ✅ Set success message
      fetchSales(); // Refresh sales list
  
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setSuccessMessage("❌ Error deleting sale.");
      setTimeout(() => setSuccessMessage(""), 3000);
      console.error("Error deleting sale:", error);
    }
  };
  
const sortedSales = [...sales].sort((a, b) => new Date(b.sold_at) - new Date(a.sold_at));

<tbody>
  {sortedSales.map((sale) => (
    <tr key={sale.id} className="border">
      <td className="p-3">{sale.product_name}</td>
      <td className="p-3">{sale.store_name}</td>
      <td className="p-3">{sale.quantity}</td>
      <td className="p-3">${sale.total_price}</td>
      <td className="p-3">{new Date(sale.sold_at).toLocaleDateString()}</td>
    </tr>
  ))}
</tbody>

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Sales</h2>

      {/* Filter Sales by Store */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Enter Store ID"
          className="p-2 border rounded-md"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
        />
        <button
          onClick={fetchSalesByStore}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Filter by Store
        </button>
        <button
          onClick={fetchSales}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          All Stores
        </button>
      </div>


      

      {/* Sales Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3 w-1/5 text-left">Product</th>
            <th className="border p-3 w-1/5 text-left">Store</th>
            <th className="border p-3 w-1/10 text-center">Quantity</th>
            <th className="border p-3 w-1/10 text-right">Total Price</th>
            <th className="border p-3 w-1/10 text-center">Date</th>
            {role === "admin" && <th className="border p-3 w-1/10 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedSales.map((sale) => (
            <tr key={sale.id} className="border">
              <td className="p-3 w-1/5 text-left">{sale.product_name}</td>
              <td className="p-3 w-1/5 text-left">{sale.store_name}</td>
              <td className="p-3 w-1/10 text-center">{sale.quantity}</td>
              <td className="p-3 w-1/10 text-right">${sale.total_price}</td>
              <td className="p-3 w-1/10 text-center">{new Date(sale.sold_at).toLocaleDateString()}</td>
              {role === "admin" && (
                <td className="p-3 w-1/10 text-center">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => confirmDeleteSale(sale.id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
{/* Success Message Display */}
{successMessage && (
  <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-500 rounded">
    {successMessage}
  </div>
)}
{/* Custom Delete Confirmation Modal */}
{showDeletePopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-md shadow-md w-96">
      <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
      <p>Are you sure you want to delete this sale?</p>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowDeletePopup(false)}
        >
          Cancel
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={handleConfirmDeleteSale}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


      {/* Add Sale (Employees & Admins) */}
      <h3 className="text-2xl font-bold mt-6">Add New Sale</h3>
      <form onSubmit={handleAddSale} className="mt-4">
        <input
          type="text"
          placeholder="Store ID"
          className="p-2 border rounded-md mr-2"
          value={newSale.store_id}
          onChange={(e) => setNewSale({ ...newSale, store_id: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Product ID"
          className="p-2 border rounded-md mr-2"
          value={newSale.product_id}
          onChange={(e) => setNewSale({ ...newSale, product_id: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          className="p-2 border rounded-md mr-2"
          value={newSale.quantity}
          onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })}
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
          Add Sale
        </button>
      </form>
    </div>
    
  );
};

export default SalesPage;
