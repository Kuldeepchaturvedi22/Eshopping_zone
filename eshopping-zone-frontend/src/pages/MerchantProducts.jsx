import React, { useEffect, useState } from "react";
import { fetchProductsByMerchantEmail } from "../api/merchant";
import { addProduct } from "../api/admin";
import { getAuthToken } from "../api/_auth";

export default function MerchantProducts() {
    const [products, setProducts] = useState([]);
    const [err, setErr] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        productType: "",
        productName: "",
        category: "",
        image: "",
        price: "",
        description: "",
        discount: "",
        stock: "",
    });
    const email = localStorage.getItem("email") || "";
    const token = getAuthToken();

    useEffect(() => {
        const run = async () => {
            setErr("");
            try {
                const data = await fetchProductsByMerchantEmail(email, token);
                setProducts(Array.isArray(data) ? data : []);
            } catch (e) {
                setErr(e?.message || "Failed to load products");
            }
        };
        run();
    }, [email, token]);

    const onChange = (e) => {
        const {name, value} = e.target;
        setForm((f) => ({...f, [name]: value}));
    };

    const resetForm = () => {
        setForm({
            productType: "",
            productName: "",
            category: "",
            image: "",
            price: "",
            description: "",
            discount: "",
            stock: "",
        });
    };

    const onAddProduct = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErr("");
        try {
            // Basic validation
            if (!form.productName || !form.category || !form.price || !form.stock) {
                throw new Error("Please fill product name, category, price and stock.");
            }
            // Build payload with merchant email automatically injected
            const payload = {
                ...form,
                price: Number(form.price),
                discount: form.discount === "" ? 0 : Number(form.discount),
                stock: Number(form.stock),
                merchantEmail: email, // <- auto-attach signed-in merchant email
            };
            await addProduct(payload, token);
            resetForm();
            setShowForm(false);
            // ... existing code ...
            const data = await fetchProductsByMerchantEmail(email, token);
            setProducts(Array.isArray(data) ? data : []);
        } catch (e) {
            setErr(e?.message || "Failed to add product");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4 mt-16 max-w-6xl mx-auto text-gray-200 bg-gray-900 min-h-screen">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Products</h1>
                    <p className="text-sm text-gray-400">Signed in as {email}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowForm((v) => !v)}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {showForm ? "Close" : "Add Product"}
                    </button>
                </div>
            </div>

            {showForm && (
                <form onSubmit={onAddProduct}
                      className="bg-gray-800 rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        name="productType"
                        value={form.productType}
                        onChange={onChange}
                        className="border border-gray-700 rounded px-3 py-2 bg-gray-900 text-white placeholder-gray-400"
                        placeholder="Product Type"
                    />
                    <input
                        name="productName"
                        value={form.productName}
                        onChange={onChange}
                        className="border border-gray-700 rounded px-3 py-2 bg-gray-900 text-white placeholder-gray-400"
                        placeholder="Product Name"
                        required
                    />
                    <select
                        name="category"
                        value={form.category}
                        onChange={onChange}
                        className="border border-gray-700 rounded px-3 py-2 bg-gray-900 text-white"
                        required
                    >
                        <option value="">Select Category</option>
                        <option>Electronics</option>
                        <option>Clothing</option>
                        <option>Books</option>
                        <option>Home</option>
                    </select>
                    <input
                        name="image"
                        value={form.image}
                        onChange={onChange}
                        className="border border-gray-700 rounded px-3 py-2 bg-gray-900 text-white placeholder-gray-400"
                        placeholder="Image URL"
                    />
                    <input
                        name="price"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={onChange}
                        className="border border-gray-700 rounded px-3 py-2 bg-gray-900 text-white placeholder-gray-400"
                        placeholder="Price"
                        required
                    />
                    <input
                        name="discount"
                        type="number"
                        min="0"
                        value={form.discount}
                        onChange={onChange}
                        className="border border-gray-700 rounded px-3 py-2 bg-gray-900 text-white placeholder-gray-400"
                        placeholder="Discount (%)"
                    />
                    <input
                        name="stock"
                        type="number"
                        min="1"
                        value={form.stock}
                        onChange={onChange}
                        className="border border-gray-700 rounded px-3 py-2 bg-gray-900 text-white placeholder-gray-400"
                        placeholder="Stock Quantity"
                        required
                    />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        className="border border-gray-700 rounded px-3 py-2 bg-gray-900 text-white placeholder-gray-400 md:col-span-2"
                        rows={3}
                        placeholder="Description"
                    />
                    <div className="md:col-span-2 flex gap-2 justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 rounded border border-gray-600 text-white hover:bg-gray-700"
                            onClick={() => {
                                resetForm();
                                setShowForm(false);
                            }}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-4 py-2 rounded text-white ${submitting ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                            {submitting ? "Saving…" : "Save Product"}
                        </button>
                    </div>
                </form>
            )}

            {err ? (
                <div className="p-3 bg-red-900 text-red-200 border border-red-700 rounded">{err}</div>
            ) : products.length === 0 ? (
                <p className="text-gray-400">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <div key={p.productId} className="bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition">
                            <img src={p.image} alt={p.productName} className="w-full h-40 object-cover rounded mb-3"/>
                            <h3 className="font-semibold text-white">{p.productName}</h3>
                            <p className="text-sm text-gray-400 line-clamp-2">{p.description}</p>
                            <div className="mt-2 text-sm">
                                <span className="font-semibold text-white">₹{p.price}</span>
                                <span className="ml-2 text-green-400">{p.discount}% off</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Stock: {p.stock}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// import React, { useEffect, useState } from "react";
// import { fetchProductsByMerchantEmail } from "../api/merchant";
// import { addProduct } from "../api/admin";
// import { getAuthToken } from "../api/_auth";
//
// export default function MerchantProducts() {
//     const [products, setProducts] = useState([]);
//     const [err, setErr] = useState("");
//     const [showForm, setShowForm] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [validationErrors, setValidationErrors] = useState({});
//     const [form, setForm] = useState({
//         productType: "",
//         productName: "",
//         category: "",
//         image: "",
//         price: "",
//         description: "",
//         discount: "",
//         stock: "",
//     });
//
//     const email = localStorage.getItem("email") || "";
//     const token = getAuthToken();
//
//     useEffect(() => {
//         const run = async () => {
//             setErr("");
//             try {
//                 const data = await fetchProductsByMerchantEmail(email, token);
//                 setProducts(Array.isArray(data) ? data : []);
//             } catch (e) {
//                 setErr(e?.message || "Failed to load products");
//             }
//         };
//         run();
//     }, [email, token]);
//
//     // Validation functions
//     const validateField = (name, value) => {
//         switch (name) {
//             case 'productName':
//                 if (!value.trim()) return "Product name is required";
//                 if (value.length < 3) return "Product name must be at least 3 characters";
//                 if (value.length > 100) return "Product name must not exceed 100 characters";
//                 return "";
//
//             case 'category':
//                 if (!value) return "Category is required";
//                 return "";
//
//             case 'price':
//                 { if (!value) return "Price is required";
//                 const price = Number(value);
//                 if (isNaN(price) || price <= 0) return "Price must be a positive number";
//                 if (price > 1000000) return "Price seems too high";
//                 return ""; }
//
//             case 'stock':
//                 { if (!value && value !== "0") return "Stock quantity is required";
//                 const stock = Number(value);
//                 if (isNaN(stock) || stock < 0) return "Stock must be a non-negative number";
//                 if (stock > 100000) return "Stock quantity seems too high";
//                 return ""; }
//
//             case 'discount':
//                 if (value !== "" && value !== "0") {
//                     const discount = Number(value);
//                     if (isNaN(discount) || discount < 0) return "Discount must be a non-negative number";
//                     if (discount > 100) return "Discount cannot exceed 100%";
//                 }
//                 return "";
//
//             case 'image':
//                 if (value && !isValidUrl(value)) return "Please enter a valid image URL";
//                 return "";
//
//             case 'description':
//                 if (value.length > 500) return "Description must not exceed 500 characters";
//                 return "";
//
//             case 'productType':
//                 if (value.length > 50) return "Product type must not exceed 50 characters";
//                 return "";
//
//             default:
//                 return "";
//         }
//     };
//
//     const isValidUrl = (string) => {
//         try {
//             new URL(string);
//             return true;
//         } catch (_) {
//             return false;
//         }
//     };
//
//     const validateForm = () => {
//         const errors = {};
//         Object.keys(form).forEach(key => {
//             const error = validateField(key, form[key]);
//             if (error) errors[key] = error;
//         });
//
//         // Additional cross-field validation
//         if (form.discount && form.price) {
//             const discountAmount = (Number(form.price) * Number(form.discount)) / 100;
//             if (discountAmount >= Number(form.price)) {
//                 errors.discount = "Discount amount cannot be equal to or greater than price";
//             }
//         }
//
//         return errors;
//     };
//
//     const onChange = (e) => {
//         const { name, value } = e.target;
//         setForm((f) => ({ ...f, [name]: value }));
//
//         // Real-time validation
//         const error = validateField(name, value);
//         setValidationErrors(prev => ({
//             ...prev,
//             [name]: error
//         }));
//     };
//
//     const resetForm = () => {
//         setForm({
//             productType: "",
//             productName: "",
//             category: "",
//             image: "",
//             price: "",
//             description: "",
//             discount: "",
//             stock: "",
//         });
//         setValidationErrors({});
//     };
//
//     const onAddProduct = async (e) => {
//         e.preventDefault();
//         setSubmitting(true);
//         setErr("");
//
//         try {
//             // Comprehensive validation
//             const errors = validateForm();
//
//             if (Object.keys(errors).length > 0) {
//                 setValidationErrors(errors);
//                 throw new Error("Please fix the validation errors before submitting");
//             }
//
//             // Build payload with merchant email automatically injected
//             const payload = {
//                 ...form,
//                 productName: form.productName.trim(),
//                 description: form.description.trim(),
//                 productType: form.productType.trim(),
//                 price: Number(form.price),
//                 discount: form.discount === "" ? 0 : Number(form.discount),
//                 stock: Number(form.stock),
//                 merchantEmail: email,
//             };
//
//             await addProduct(payload, token);
//             resetForm();
//             setShowForm(false);
//
//             // Refresh products list
//             const data = await fetchProductsByMerchantEmail(email, token);
//             setProducts(Array.isArray(data) ? data : []);
//
//         } catch (e) {
//             setErr(e?.message || "Failed to add product");
//         } finally {
//             setSubmitting(false);
//         }
//     };
//
//     const getInputClassName = (fieldName) => {
//         const baseClass = "border rounded px-3 py-2 transition-colors";
//         if (validationErrors[fieldName]) {
//             return `${baseClass} border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200`;
//         }
//         return `${baseClass} border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200`;
//     };
//
//     return (
//         <div className="p-4 mt-16 max-w-6xl mx-auto">
//             <div className="mb-4 flex items-center justify-between">
//                 <div>
//                     <h1 className="text-2xl font-bold">My Products</h1>
//                     <p className="text-sm text-gray-600">Signed in as {email}</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <button
//                         onClick={() => setShowForm((v) => !v)}
//                         className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//                     >
//                         {showForm ? "Close" : "Add Product"}
//                     </button>
//                 </div>
//             </div>
//
//             {showForm && (
//                 <form onSubmit={onAddProduct} className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <div>
//                         <input
//                             name="productType"
//                             value={form.productType}
//                             onChange={onChange}
//                             className={getInputClassName('productType')}
//                             placeholder="Product Type"
//                         />
//                         {validationErrors.productType && (
//                             <p className="text-red-500 text-xs mt-1">{validationErrors.productType}</p>
//                         )}
//                     </div>
//
//                     <div>
//                         <input
//                             name="productName"
//                             value={form.productName}
//                             onChange={onChange}
//                             className={getInputClassName('productName')}
//                             placeholder="Product Name *"
//                         />
//                         {validationErrors.productName && (
//                             <p className="text-red-500 text-xs mt-1">{validationErrors.productName}</p>
//                         )}
//                     </div>
//
//                     <div>
//                         <select
//                             name="category"
//                             value={form.category}
//                             onChange={onChange}
//                             className={getInputClassName('category')}
//                         >
//                             <option value="">Select Category *</option>
//                             <option value="Electronics">Electronics</option>
//                             <option value="Clothing">Clothing</option>
//                             <option value="Books">Books</option>
//                             <option value="Home">Home</option>
//                         </select>
//                         {validationErrors.category && (
//                             <p className="text-red-500 text-xs mt-1">{validationErrors.category}</p>
//                         )}
//                     </div>
//
//                     <div>
//                         <input
//                             name="image"
//                             value={form.image}
//                             onChange={onChange}
//                             className={getInputClassName('image')}
//                             placeholder="Image URL"
//                         />
//                         {validationErrors.image && (
//                             <p className="text-red-500 text-xs mt-1">{validationErrors.image}</p>
//                         )}
//                     </div>
//
//                     <div>
//                         <input
//                             name="price"
//                             type="number"
//                             step="0.01"
//                             min="0"
//                             value={form.price}
//                             onChange={onChange}
//                             className={getInputClassName('price')}
//                             placeholder="Price *"
//                         />
//                         {validationErrors.price && (
//                             <p className="text-red-500 text-xs mt-1">{validationErrors.price}</p>
//                         )}
//                     </div>
//
//                     <div>
//                         <input
//                             name="discount"
//                             type="number"
//                             min="0"
//                             max="100"
//                             value={form.discount}
//                             onChange={onChange}
//                             className={getInputClassName('discount')}
//                             placeholder="Discount (%) - Optional"
//                         />
//                         {validationErrors.discount && (
//                             <p className="text-red-500 text-xs mt-1">{validationErrors.discount}</p>
//                         )}
//                     </div>
//
//                     <div>
//                         <input
//                             name="stock"
//                             type="number"
//                             min="0"
//                             value={form.stock}
//                             onChange={onChange}
//                             className={getInputClassName('stock')}
//                             placeholder="Stock Quantity *"
//                         />
//                         {validationErrors.stock && (
//                             <p className="text-red-500 text-xs mt-1">{validationErrors.stock}</p>
//                         )}
//                     </div>
//
//                     <div className="md:col-span-2">
//                         <textarea
//                             name="description"
//                             value={form.description}
//                             onChange={onChange}
//                             className={getInputClassName('description')}
//                             rows={3}
//                             placeholder="Product Description"
//                             maxLength={500}
//                         />
//                         <div className="flex justify-between items-center mt-1">
//                             {validationErrors.description ? (
//                                 <p className="text-red-500 text-xs">{validationErrors.description}</p>
//                             ) : (
//                                 <div></div>
//                             )}
//                             <p className="text-xs text-gray-400">
//                                 {form.description.length}/500 characters
//                             </p>
//                         </div>
//                     </div>
//
//                     <div className="md:col-span-2 flex gap-2 justify-end pt-3">
//                         <button
//                             type="button"
//                             className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
//                             onClick={() => {
//                                 resetForm();
//                                 setShowForm(false);
//                             }}
//                             disabled={submitting}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting || Object.keys(validationErrors).some(key => validationErrors[key])}
//                             className={`px-4 py-2 rounded text-white transition-colors ${
//                                 submitting || Object.keys(validationErrors).some(key => validationErrors[key])
//                                     ? "bg-gray-400 cursor-not-allowed"
//                                     : "bg-blue-600 hover:bg-blue-700"
//                             }`}
//                         >
//                             {submitting ? "Saving…" : "Save Product"}
//                         </button>
//                     </div>
//                 </form>
//             )}
//
//             {err && (
//                 <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded mb-4">
//                     {err}
//                 </div>
//             )}
//
//             {products.length === 0 && !err ? (
//                 <div className="text-center py-8">
//                     <p className="text-gray-500 mb-4">No products found.</p>
//                     {!showForm && (
//                         <button
//                             onClick={() => setShowForm(true)}
//                             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//                         >
//                             Add Your First Product
//                         </button>
//                     )}
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     {products.map((p) => (
//                         <div key={p.productId} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow">
//                             {p.image ? (
//                                 <img
//                                     src={p.image}
//                                     alt={p.productName}
//                                     className="w-full h-40 object-cover rounded mb-3"
//                                     onError={(e) => {
//                                         e.target.src = '/api/placeholder/300/160';
//                                     }}
//                                 />
//                             ) : (
//                                 <div className="w-full h-40 bg-gray-200 rounded mb-3 flex items-center justify-center">
//                                     <span className="text-gray-400">No Image</span>
//                                 </div>
//                             )}
//                             <h3 className="font-semibold text-lg mb-1">{p.productName}</h3>
//                             {p.productType && (
//                                 <p className="text-xs text-blue-600 mb-2">{p.productType}</p>
//                             )}
//                             <p className="text-sm text-gray-600 line-clamp-2 mb-2">{p.description}</p>
//                             <div className="mt-2 text-sm">
//                                 <span className="font-semibold text-lg">₹{p.price}</span>
//                                 {p.discount > 0 && (
//                                     <span className="ml-2 text-green-700 font-medium">{p.discount}% off</span>
//                                 )}
//                             </div>
//                             <p className="text-xs text-gray-500 mt-1">
//                                 Stock: {p.stock} {p.stock === 0 ? "(Out of Stock)" : ""}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }