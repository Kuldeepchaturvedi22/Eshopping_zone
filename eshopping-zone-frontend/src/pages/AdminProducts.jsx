import React, { useState, useEffect } from "react";
import {
  fetchAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../api/admin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productType: "",
    productName: "",
    category: "",
    image: "",
    price: "",
    description: "",
    discount: "",
    stock: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const data = await fetchAllProducts(token);
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, formData, token);
        toast.success("Product updated successfully!");
      } else {
        await addProduct(formData, token);
        toast.success("Product added successfully!");
      }
      setFormData({
        productType: "",
        productName: "",
        category: "",
        image: "",
        price: "",
        description: "",
        discount: "",
        stock: "",
      });
      setEditingProductId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Error saving product");
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingProductId(product.productId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteProduct(productToDelete, token);
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products
    .filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "price") return a.price - b.price;
      if (sortOption === "stock") return b.stock - a.stock;
      return 0;
    });

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {editingProductId ? "Update Product" : "Add New Product"}
      </h1>

      <form
        onSubmit={handleAddOrUpdateProduct}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 bg-white p-6 rounded-xl shadow-md"
      >
        <input type="text" name="productType" placeholder="Product Type" value={formData.productType} onChange={handleChange} className="p-3 border rounded" required />
        <input type="text" name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} className="p-3 border rounded" required />
        <select name="category" value={formData.category} onChange={handleChange} className="p-3 border rounded" required>
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Home">Home</option>
        </select>
        <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="p-3 border rounded" />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="p-3 border rounded" required />
        <input type="number" name="discount" placeholder="Discount (%)" value={formData.discount} onChange={handleChange} className="p-3 border rounded" />
        <input type="number" name="stock" placeholder="Stock Quantity" value={formData.stock} onChange={handleChange} className="p-3 border rounded" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="p-3 border rounded md:col-span-2" rows="3" />
        {formData.image && (
          <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded border md:col-span-2" />
        )}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition md:col-span-2">
          {editingProductId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border rounded w-full md:w-1/2"
        />
        <select
          onChange={(e) => setSortOption(e.target.value)}
          className="p-3 border rounded w-full md:w-1/4"
        >
          <option value="">Sort By</option>
          <option value="price">Price (Low to High)</option>
          <option value="stock">Stock (High to Low)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.productId} className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
            <img src={product.image} alt={product.productName} className="w-full h-48 object-cover rounded-lg shadow-sm mb-3" />
            <h3 className="text-xl font-semibold text-gray-800">{product.productName}</h3>
            <p className="text-gray-600 text-sm mb-1">{product.description}</p>
            <p className="text-blue-600 font-bold text-lg">₹{product.price}</p>
            <p className="text-green-600 text-sm">Discount: {product.discount}%</p>
            <p className="text-gray-500 text-sm">Stock: {product.stock}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition">Edit</button>
              <button onClick={() => confirmDelete(product.productId)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this product?</h2>
            <div className="flex justify-center gap-4">
              <button onClick={handleDeleteConfirmed} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Yes</button>
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}