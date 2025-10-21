import React, { useEffect, useState } from "react";
import { fetchAllProducts } from "../api/product";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const [products, setProducts] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [filteredGrouped, setFilteredGrouped] = useState({});
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchAllProducts(token)
      .then((data) => {
        setProducts(data);
        groupByCategory(data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const groupByCategory = (products) => {
    const groupedData = {};
    products.forEach((product) => {
      const category = product.category || "Others";
      if (!groupedData[category]) groupedData[category] = [];
      groupedData[category].push(product);
    });
    setGrouped(groupedData);
    setFilteredGrouped(groupedData);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleSearchAndFilter = () => {
    const filtered = {};
    Object.keys(grouped).forEach((category) => {
      if (selectedCategory === "All" || category === selectedCategory) {
        const filteredProducts = grouped[category].filter((product) =>
          product.productName.toLowerCase().includes(search.toLowerCase())
        );
        if (filteredProducts.length > 0) {
          filtered[category] = filteredProducts;
        }
      }
    });
    setFilteredGrouped(filtered);
  };

  useEffect(() => {
    handleSearchAndFilter();
  }, [search, selectedCategory, grouped]);

  const allCategories = ["All", ...Object.keys(grouped)];

  return (
    <section className="px-4 py-10 mt-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 transition-all duration-500 ease-in-out">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-purple-800 drop-shadow animate-fade-in-up">
        🛍️ Shop by Category
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10 animate-fade-in-up">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border border-purple-300 rounded shadow focus:ring-2 focus:ring-purple-400 w-full md:w-1/3"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 border border-purple-300 rounded shadow w-full md:w-1/4"
        >
          {allCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Category-wise Product Grid */}
      {Object.keys(filteredGrouped).map((category, index) => (
        <div
          key={category}
          className="mb-12 animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-blue-900 border-b-2 border-blue-200 pb-2 pl-1">
            {category}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredGrouped[category].map((product) => (
              <div
                key={product.productId}
                onClick={() => handleProductClick(product.productId)}
                className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-100"
              >
                <img
                  src={product.image}
                  alt={product.productName}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <h4 className="text-md font-semibold text-gray-800 truncate">
                    {product.productName}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">₹{product.price}</p>
                  <p className="text-green-600 text-xs">Discount: {product.discount}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
