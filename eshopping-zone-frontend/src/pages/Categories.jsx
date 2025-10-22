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
        <section className="px-4 py-10 mt-20">
            <h2 className="text-4xl font-extrabold mb-6 text-center text-black drop-shadow">
                🛍️ Shop by Category
            </h2>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-3 border rounded shadow focus:ring-2 focus:ring-purple-400 w-full md:w-1/3"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-3 border rounded shadow w-full md:w-1/4"
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
                    className="mb-12"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <h3 className="text-2xl font-semibold mb-4 text-black border-b pb-2 pl-1">
                        {category}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredGrouped[category].map((product) => (
                            <div
                                key={product.productId}
                                onClick={() => handleProductClick(product.productId)}
                                className="cursor-pointer card-glass"
                            >
                                <img
                                    src={product.image}
                                    alt={product.productName}
                                    className="w-full h-40 object-cover rounded-xl"
                                />
                                <div className="p-3">
                                    <h4 className="text-md font-semibold text-black truncate">
                                        {product.productName}
                                    </h4>
                                    <p className="text-sm text-gray-700 mt-1">₹{product.price}</p>
                                    {product.discount ? (
                                        <p className="text-emerald-600 text-xs">{product.discount}% OFF</p>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );

}
