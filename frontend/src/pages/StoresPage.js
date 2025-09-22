import React, { useEffect, useState } from "react";
import axios from "axios";

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [newStore, setNewStore] = useState({ name: "", location: "" });
  const [editingStore, setEditingStore] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // ✅ Fetch All Stores
  useEffect(() => {
    fetchStores();
  }, []);

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

  // ✅ Add Store
  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/stores", newStore, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Store added successfully! ✅");
      fetchStores();
      setNewStore({ name: "", location: "" });

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setSuccessMessage("❌ Error adding store.");
      setTimeout(() => setSuccessMessage(""), 3000);
      console.error("Error adding store:", error);
    }
  };

  // ✅ Edit Store
  const startEditing = (store) => {
    setEditingStore(store);
  };

  const handleUpdateStore = async () => {
    try {
      await axios.put(`http://localhost:5000/api/stores/${editingStore.id}`, editingStore, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Store updated successfully! ✅");
      fetchStores();
      setEditingStore(null);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setSuccessMessage("❌ Error updating store.");
      setTimeout(() => setSuccessMessage(""), 3000);
      console.error("Error updating store:", error);
    }
  };

  // ✅ Show Delete Confirmation Popup
  const confirmDeleteStore = (storeId) => {
    setStoreToDelete(storeId);
    setShowDeletePopup(true);
  };

  // ✅ Delete Store
  const handleDeleteStore = async () => {
    if (!storeToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/stores/${storeToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Store deleted successfully! 🗑️");
      fetchStores();
    } catch (error) {
      setSuccessMessage("❌ Error deleting store.");
    } finally {
      setShowDeletePopup(false);
      setStoreToDelete(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Stores</h2>

      {/* ✅ Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-500 rounded">
          {successMessage}
        </div>
      )}

      {/* Stores Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3 w-1/3 text-left">Store Name</th>
            <th className="border p-3 w-1/3 text-left">Location</th>
            {role === "admin" && <th className="border p-3 w-1/3 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id} className="border">
              <td className="p-3 w-1/3 text-left">{store.name}</td>
              <td className="p-3 w-1/3 text-left">{store.location}</td>
              {role === "admin" && (
                <td className="p-3 w-1/3 text-center">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onClick={() => startEditing(store)}>Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => confirmDeleteStore(store.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Store Form */}
      {editingStore && (
        <div className="mt-6">
          <h3 className="text-2xl font-bold">Edit Store</h3>
          <input type="text" placeholder="Name" className="p-2 border rounded-md mr-2"
            value={editingStore.name} onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
          />
          <input type="text" placeholder="Location" className="p-2 border rounded-md mr-2"
            value={editingStore.location} onChange={(e) => setEditingStore({ ...editingStore, location: e.target.value })}
          />
          <button onClick={handleUpdateStore} className="bg-green-500 text-white px-4 py-2 rounded-md">
            Update
          </button>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this store?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={() => setShowDeletePopup(false)}>Cancel</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleDeleteStore}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Store (Admins Only) */}
      {role === "admin" && (
        <>
          <h3 className="text-2xl font-bold mt-6">Add New Store</h3>
          <form onSubmit={handleAddStore} className="mt-4">
            <input type="text" placeholder="Store Name" className="p-2 border rounded-md mr-2"
              value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} required />
            <input type="text" placeholder="Location" className="p-2 border rounded-md mr-2"
              value={newStore.location} onChange={(e) => setNewStore({ ...newStore, location: e.target.value })} required />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Add Store</button>
          </form>
        </>
      )}
    </div>
  );
};

export default StoresPage;
