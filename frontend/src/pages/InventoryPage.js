import React, { useEffect, useState } from "react";
import axios from "axios";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [storeId, setStoreId] = useState(""); // Store filtering
  const [newInventory, setNewInventory] = useState({
    store_id: "",
    product_id: "",
    quantity: "",
    min_stock_level: "",
  });
  const [editingInventory, setEditingInventory] = useState(null); // Track item being edited
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);
  const role = localStorage.getItem("role"); // User role (admin/employee)
  const token = localStorage.getItem("token"); // Authentication token

  const [lowStockItems, setLowStockItems] = useState([]); // ✅ Track low-stock items


  // ✅ Fetch All Inventory Items
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(response.data);
                // ✅ Filter items with "LOW STOCK" and store them
    const lowStock = response.data.filter((item) => item.stock_status === "LOW STOCK");
    setLowStockItems(lowStock);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  // ✅ Fetch Inventory by Store
  const fetchInventoryByStore = async () => {
    if (!storeId) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/inventory/store/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(response.data);

    } catch (error) {
      console.error("Error fetching inventory by store:", error);
    }
  };

  // ✅ Add New Inventory Item (Admins Only)
  // ✅ Add New Inventory Item (Admins Only)
  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/inventory", newInventory, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Inventory item added successfully! ✅");
      fetchInventory(); // Refresh inventory list
      setNewInventory({ store_id: "", product_id: "", quantity: "", min_stock_level: "" });

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setSuccessMessage("❌ Error adding inventory.");
      setTimeout(() => setSuccessMessage(""), 3000);
      console.error("Error adding inventory:", error);
    }
  };

  // ✅ Show Delete Confirmation Popup
  const confirmDeleteInventory = (inventoryId) => {
    setInventoryToDelete(inventoryId);
    setShowDeletePopup(true);
  };

  // ✅ Delete Inventory Item (Admins Only)
  const handleDeleteInventory = async () => {
    if (!inventoryToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/inventory/${inventoryToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Inventory item deleted successfully! 🗑️");
      fetchInventory();
    } catch (error) {
      setSuccessMessage("❌ Error deleting inventory.");
    } finally {
      setShowDeletePopup(false);
      setInventoryToDelete(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // ✅ Start Editing an Inventory Item
  const startEditing = (item) => {
    setEditingInventory(item);
  };

  // ✅ Update Inventory Item (Admins Only)
  const handleUpdateInventory = async () => {
    try {
      await axios.put(`http://localhost:5000/api/inventory/${editingInventory.id}`, {
        quantity: editingInventory.quantity,
        min_stock_level: editingInventory.min_stock_level,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Inventory updated successfully! ✅");
      fetchInventory();
      setEditingInventory(null);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setSuccessMessage("❌ Error updating inventory.");
      setTimeout(() => setSuccessMessage(""), 3000);
      console.error("Error updating inventory:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Inventory</h2>

      {/* ✅ Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-500 rounded">
          {successMessage}
        </div>
      )}

      {/* Filter Inventory by Store */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Enter Store ID"
          className="p-2 border rounded-md"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
        />
        <button onClick={fetchInventoryByStore} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Filter by Store
        </button>
        <button onClick={fetchInventory} className="bg-gray-500 text-white px-4 py-2 rounded-md">
          All Stores
        </button>
      </div>
      {/* Custom Delete Confirmation Modal */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this inventory item?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleDeleteInventory}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Inventory Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3 w-1/5 text-left">Product</th>
            <th className="border p-3 w-1/5 text-left">Store</th>
            <th className="border p-3 w-1/10 text-center">Quantity</th>
            <th className="border p-3 w-1/10 text-right">Min Stock</th>
            <th className="border p-3 w-1/10 text-center">Stock Status</th>
            {role === "admin" && <th className="border p-3 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
        {inventory.map((item) => (
            <tr key={item.id} className="border">
              <td className="p-3">{item.product_name}</td>
              <td className="p-3">{item.store_name}</td>
              <td className="p-3 text-center">{item.quantity}</td>
              <td className="p-3 text-right">{item.min_stock_level}</td>
              <td className={`p-3 text-center font-bold ${item.stock_status === "LOW STOCK" ? "text-red-500" : "text-green-500"}`}>
                {item.stock_status}
              </td>

              {role === "admin" && (
                <td className="p-3 text-center">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onClick={() => startEditing(item)}>Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => confirmDeleteInventory(item.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add Inventory (Admins Only) */}
      {role === "admin" && (
        <>
          <h3 className="text-2xl font-bold mt-6">Add New Inventory Item</h3>
          <form onSubmit={handleAddInventory} className="mt-4">
            <input
              type="text"
              placeholder="Store ID"
              className="p-2 border rounded-md mr-2"
              value={newInventory.store_id}
              onChange={(e) => setNewInventory({ ...newInventory, store_id: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Product ID"
              className="p-2 border rounded-md mr-2"
              value={newInventory.product_id}
              onChange={(e) => setNewInventory({ ...newInventory, product_id: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              className="p-2 border rounded-md mr-2"
              value={newInventory.quantity}
              onChange={(e) => setNewInventory({ ...newInventory, quantity: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Min Stock Level"
              className="p-2 border rounded-md mr-2"
              value={newInventory.min_stock_level}
              onChange={(e) => setNewInventory({ ...newInventory, min_stock_level: e.target.value })}
              required
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
              Add Inventory
            </button>
          </form>
        </>
      )}
{/* ✅ Low Stock Notification Banner */}
{lowStockItems.length > 0 && (
  <div className="mb-4 p-3 bg-red-100 border border-red-500 text-red-700 rounded">
    <strong>⚠️ Low Stock Alert!</strong> Some products are running low:
    <ul className="mt-2 ml-4 list-disc">
      {lowStockItems.map((item) => (
        <li key={item.id}>
          {item.product_name} at {item.store_name} (Only {item.quantity} left!)
        </li>
      ))}
    </ul>
  </div>
)}

      {/* Update Inventory Form */}
      {editingInventory && (
        <div className="mt-6">
          <h3 className="text-2xl font-bold">Edit Inventory</h3>
          <input type="number" placeholder="Quantity" className="p-2 border rounded-md mr-2" value={editingInventory.quantity}
            onChange={(e) => setEditingInventory({ ...editingInventory, quantity: e.target.value })} required />
          <input type="number" placeholder="Min Stock Level" className="p-2 border rounded-md mr-2" value={editingInventory.min_stock_level}
            onChange={(e) => setEditingInventory({ ...editingInventory, min_stock_level: e.target.value })} required />
          <button onClick={handleUpdateInventory} className="bg-green-500 text-white px-4 py-2 rounded-md">Update</button>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
