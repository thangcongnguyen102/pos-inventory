import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", sku: "", description: "", price: "", image: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // ✅ Fetch All Products
  useEffect(() => {
    fetchProducts();
  }, []);

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

  // ✅ Filter Products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
    // ✅ Handle Image Selection
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setNewProduct({ ...newProduct, image: file });
        setImagePreview(URL.createObjectURL(file)); // ✅ Show image preview
      }
    };

  // ✅ Add New Product
// ✅ Add New Product (with Image Upload)
const handleAddProduct = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("name", newProduct.name);
  formData.append("sku", newProduct.sku);
  formData.append("description", newProduct.description);
  formData.append("price", newProduct.price);
  if (newProduct.image) {
    formData.append("image", newProduct.image); // ✅ Upload image
  }

  try {
    await axios.post("http://localhost:5000/api/products", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });

    setSuccessMessage("✅ Product added successfully!");
    fetchProducts();
    setNewProduct({ name: "", sku: "", description: "", price: "", image: null });
    setImagePreview(null); // ✅ Clear image preview

    setTimeout(() => setSuccessMessage(""), 3000);
  } catch (error) {
    setSuccessMessage("❌ Error adding product.");
    setTimeout(() => setSuccessMessage(""), 3000);
    console.error("Error adding product:", error);
  }
};

  // ✅ Edit Product
  const startEditing = (product) => {
    setEditingProduct(product);
  };

  const handleImageEditChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingProduct({ ...editingProduct, image: file });
    }
  };
  
  const handleUpdateProduct = async () => {
    const formData = new FormData();
    formData.append("name", editingProduct.name);
    formData.append("sku", editingProduct.sku);
    formData.append("description", editingProduct.description);
    formData.append("price", editingProduct.price);
    if (editingProduct.image) {
      formData.append("image", editingProduct.image); // ✅ Upload image only if selected
    }
  
    try {
      await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
  
      setSuccessMessage("✅ Product updated successfully!");
      fetchProducts();
      setEditingProduct(null);
  
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setSuccessMessage("❌ Error updating product.");
      setTimeout(() => setSuccessMessage(""), 3000);
      console.error("Error updating product:", error);
    }
  };
  

  // ✅ Show Delete Confirmation Popup
  const confirmDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setShowDeletePopup(true);
  };

  // ✅ Delete Product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${productToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Product deleted successfully! 🗑️");
      fetchProducts();
    } catch (error) {
      setSuccessMessage("❌ Error deleting product.");
    } finally {
      setShowDeletePopup(false);
      setProductToDelete(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Products</h2>

      {/* ✅ Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-500 rounded">
          {successMessage}
        </div>
      )}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Products..."
        className="p-2 border rounded-md mb-4 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Product Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
  {filteredProducts.map((product) => (
    <div key={product.id} className="p-4 bg-white shadow-md rounded-lg">
<img 
  src={`http://localhost:5000${product.image}`} 
  alt={product.name} 
  className="w-full h-56 object-cover rounded-md"
/>
      <h3 className="text-lg font-bold mt-2">{product.name}</h3>
      <p className="text-gray-600">SKU: {product.sku}</p>
      <p className="text-gray-700">{product.description}</p>
      <p className="text-gray-900 font-bold mt-1">${product.price}</p>
      {role === "admin" && (
        <div className="mt-2">
          <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onClick={() => startEditing(product)}>Edit</button>
          <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => confirmDeleteProduct(product.id)}>Delete</button>
        </div>
      )}
    </div>
  ))}
</div>


      {/* Edit Product Form */}
{/* Edit Product Form */}
{editingProduct && (
  <div className="mt-6">
    <h3 className="text-2xl font-bold">Edit Product</h3>
    <input type="text" placeholder="Name" className="p-2 border rounded-md mr-2"
      value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
    />
    <input type="text" placeholder="SKU" className="p-2 border rounded-md mr-2"
      value={editingProduct.sku} onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
    />
    <input type="text" placeholder="Description" className="p-2 border rounded-md mr-2"
      value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
    />
    <input type="number" placeholder="Price" className="p-2 border rounded-md mr-2"
      value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
    />

    {/* ✅ Image Upload */}
    <input type="file" accept="image/*" onChange={handleImageEditChange} />
    {editingProduct.image && (
      <img src={typeof editingProduct.image === "string" ? `http://localhost:5000${editingProduct.image}` : URL.createObjectURL(editingProduct.image)}
        alt="Product Preview" className="mt-2 w-32 h-32 object-cover rounded-md"
      />
    )}

    <button onClick={handleUpdateProduct} className="bg-green-500 text-white px-4 py-2 rounded-md">
      Update
    </button>
  </div>
)}

{showDeletePopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-md shadow-md w-96">
      <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
      <p>Are you sure you want to delete this product?</p>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowDeletePopup(false)} // Close popup
        >
          Cancel
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={handleDeleteProduct} // ✅ Call handleDeleteProduct when confirmed
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


      {/* Add Product (Admins Only) */}
      {role === "admin" && (
        <>
          <h3 className="text-2xl font-bold mt-6">Add New Product</h3>
          <form onSubmit={handleAddProduct} className="mt-4">
            <input type="text" placeholder="Name" className="p-2 border rounded-md mr-2" value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
            <input type="text" placeholder="SKU" className="p-2 border rounded-md mr-2" value={newProduct.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} required />
            <input type="text" placeholder="Description" className="p-2 border rounded-md mr-2" value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} required />
            <input type="number" placeholder="Price" className="p-2 border rounded-md mr-2" value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />

            {/* ✅ Image Upload */}
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />}

            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Add Product</button>
          </form>

        </>
      )}
    </div>
  );
};

export default ProductsPage;
