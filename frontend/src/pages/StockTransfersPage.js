import React, { useEffect, useState } from "react";
import axios from "axios";

const StockTransfersPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [newTransfer, setNewTransfer] = useState({ from_store_id: "", to_store_id: "", product_id: "", quantity: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [transferToDelete, setTransferToDelete] = useState(null);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");


  // ✅ Fetch all stock transfers
  useEffect(() => {
    fetchStockTransfers();
    fetchStores();
    fetchProducts();
  }, []);

  const fetchStockTransfers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stock-transfers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransfers(response.data);
    } catch (error) {
      console.error("Error fetching stock transfers:", error);
    }
  };

  // ✅ Fetch stores for dropdown selection
  const fetchStores = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  // ✅ Fetch products for dropdown selection
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  const [availableStock, setAvailableStock] = useState(0);

  const handleFromStoreChange = async (storeId, productId) => {
    if (!storeId || !productId) return;
  
    try {
      const response = await axios.get(`http://localhost:5000/api/inventory/store/${storeId}/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // ✅ If no inventory record, return 0
      setAvailableStock(response.data.quantity || 0);
    } catch (error) {
      console.error("Error fetching stock availability:", error);
      setAvailableStock(0); // ✅ Fallback to 0 if error occurs
    }
  };
  


  // ✅ Add new stock transfer
  const handleAddTransfer = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/stock-transfers", newTransfer, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Stock transferred successfully! ✅");
      fetchStockTransfers();
      setNewTransfer({ from_store_id: "", to_store_id: "", product_id: "", quantity: "" });

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setSuccessMessage("❌ Error transferring stock.");
      setTimeout(() => setSuccessMessage(""), 3000);
      console.error("Error transferring stock:", error);
    }
  };


  // ✅ Show delete confirmation popup
  const confirmDeleteTransfer = (transferId) => {
    setTransferToDelete(transferId);
    setShowDeletePopup(true);
  };

  // ✅ Delete stock transfer
  const handleDeleteTransfer = async () => {
    if (!transferToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/stock-transfers/${transferToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Stock transfer deleted successfully! 🗑️");
      fetchStockTransfers();
    } catch (error) {
      setSuccessMessage("❌ Error deleting stock transfer.");
    } finally {
      setShowDeletePopup(false);
      setTransferToDelete(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Stock Transfers</h2>

      {/* ✅ Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-500 rounded">
          {successMessage}
        </div>
      )}

      {/* Stock Transfers Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3 text-left">From Store</th>
            <th className="border p-3 text-left">To Store</th>
            <th className="border p-3 text-left">Product</th>
            <th className="border p-3 text-center">Quantity</th>
            <th className="border p-3 text-center">Date</th>
            {role === "admin" && <th className="border p-3 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer) => (
            <tr key={transfer.id} className="border">
              <td className="p-3 text-left">{transfer.from_store}</td>
              <td className="p-3 text-left">{transfer.to_store}</td>
              <td className="p-3 text-left">{transfer.product_name}</td>
              <td className="p-3 text-center">{transfer.quantity}</td>
              <td className="p-3 text-center">{new Date(transfer.transferred_at).toLocaleDateString()}</td>
              {role === "admin" && (
                <td className="p-3 text-center">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => confirmDeleteTransfer(transfer.id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Delete Confirmation Modal */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this stock transfer?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleDeleteTransfer}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
{role === "admin" && (
  <>
    {/* From Store Dropdown */}
<select
  className="p-2 border rounded-md mr-2"
  value={newTransfer.from_store_id}
  onChange={(e) => {
    setNewTransfer({ ...newTransfer, from_store_id: e.target.value });
    handleFromStoreChange(e.target.value, newTransfer.product_id);
  }}
  required
>
  <option value="">From Store</option>
  {stores.map((store) => (
    <option key={store.id} value={store.id}>
      {store.name}
    </option>
  ))}
</select>

<select
  className="p-2 border rounded-md mr-2"
  value={newTransfer.product_id}
  onChange={(e) => {
    setNewTransfer({ ...newTransfer, product_id: e.target.value });
    handleFromStoreChange(newTransfer.from_store_id, e.target.value);
  }}
  required
>
  <option value="">Select Product</option>
  {products.map((product) => (
    <option key={product.id} value={product.id}>
      {product.name}
    </option>
  ))}
</select>

<p className="text-sm text-gray-700">
  Available Stock: <span className={availableStock === 0 ? "text-red-500" : "text-green-500"}>{availableStock}</span>
</p>
</>
)}


      {/* ✅ Add New Stock Transfer */}
      {role === "admin" && (
        <>
          <h3 className="text-2xl font-bold mt-6">Transfer Stock</h3>
          <form onSubmit={handleAddTransfer} className="mt-4">
            <select className="p-2 border rounded-md mr-2" value={newTransfer.from_store_id}
              onChange={(e) => setNewTransfer({ ...newTransfer, from_store_id: e.target.value })} required>
              <option value="">From Store</option>
              {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
            </select>

            <select className="p-2 border rounded-md mr-2" value={newTransfer.to_store_id}
              onChange={(e) => setNewTransfer({ ...newTransfer, to_store_id: e.target.value })} required>
              <option value="">To Store</option>
              {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
            </select>

            <select className="p-2 border rounded-md mr-2" value={newTransfer.product_id}
              onChange={(e) => setNewTransfer({ ...newTransfer, product_id: e.target.value })} required>
              <option value="">Select Product</option>
              {products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select>

            <input type="number" placeholder="Quantity" className="p-2 border rounded-md mr-2"
              value={newTransfer.quantity} onChange={(e) => setNewTransfer({ ...newTransfer, quantity: e.target.value })} required />

            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
              Transfer
            </button>
          </form>
        </>
      )}
    </div>
  );
};


export default StockTransfersPage;
