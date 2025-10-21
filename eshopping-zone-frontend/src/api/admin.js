const BASE_URL = "http://localhost:8000/productservice/products";

export const fetchAllProducts = async () => {
  const res = await fetch(`${BASE_URL}/getAllProducts`);
  if (!res.ok) throw new Error("Failed to fetch products..........");
  return res.json();
};



export const addProduct = async (productData, token) => {
  const res = await fetch(`${BASE_URL}/addProduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  console.log("Adding product with token:", token);
  console.log("Response status:", res.status);
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
};

export const deleteProduct = async (productId, token) => {
  const res = await fetch(`${BASE_URL}/deleteProduct/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res;
};

export const updateProduct = async (productId, updatedData, token) => {
  const res = await fetch(`${BASE_URL}/updateProduct/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};

export const getProductById = async (productId, token) => {
  const res = await fetch(`${BASE_URL}/getProductById/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to get product");
  return res.json();
};

export const getProductsByType = async (category, token) => {
  const res = await fetch(`${BASE_URL}/getProductsByType/${category}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to get products by category");
  return res.json();
};