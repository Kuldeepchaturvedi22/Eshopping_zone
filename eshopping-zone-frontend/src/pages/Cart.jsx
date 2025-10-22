// import React, {useState} from "react";
// import {useCart} from "../context/CartContext";
// import {useNavigate} from "react-router-dom";
// import {placeOrder} from "../api/order";
// import LoginPromptModal from "../components/LoginPromptModal";
// import {getAuthToken} from "../api/_auth";
//
// export default function Cart() {
//     const {
//         cart, handleUpdateQuantity, handleRemoveItem, getTotalPrice,
//     } = useCart();
//     const navigate = useNavigate();
//     const token = getAuthToken();
//
//     const [coupon, setCoupon] = useState("");
//     const [discount, setDiscount] = useState(3.99);
//     const shipping = 4.99;
//     const [showLoginModal, setShowLoginModal] = useState(false);
//
//     const handleOrder = async () => {
//         if (!token) {
//             setShowLoginModal(true);
//             return;
//         }
//         // Local helper ensures navigation even if assign is blocked by the browser
//         const goToPayment = (url) => {
//             try {
//                 window.location.assign(url);
//             } catch (e) {
//                 const a = document.createElement("a");
//                 a.href = url;
//                 a.rel = "opener";
//                 a.target = "_self";
//                 document.body.appendChild(a);
//                 a.click();
//                 a.remove();
//             }
//         };
//
//
//         try {
//             const order = await placeOrder(token);
//             // Persist in case user refreshes
//             sessionStorage.setItem("lastOrder", JSON.stringify(order));
//
//             // If backend gave us the payment link, open it right away
//             const link = order?.paymentUrl || order?.paymentLink || order?.link;
//             if (link && typeof link === "string") {
//                 console.log("Opening payment link:", link);
//                 goToPayment(link);
//                 return;
//             }
//
//             // Fallback to pending screen
//             navigate("/checkout", {state: {order}});
//         } catch (error) {
//             console.error("Order placement failed:", error);
//             alert(error?.message || "Failed to place order. Please try again.");
//         }
//     };
//
//     const subtotal = getTotalPrice();
//     const total = (subtotal - discount + shipping).toFixed(2);
//
//
//     return (<div
//         className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6 md:px-20 mt-16 transition-all duration-500 ease-in-out">
//         <h2 className="text-4xl font-extrabold mb-10 text-center text-purple-900 drop-shadow-lg animate-fade-in">
//             🛒 Your Cart
//         </h2>
//
//         {!cart || !cart.items || cart.items.length === 0 ? (
//             <p className="text-center text-gray-600 text-lg animate-pulse">
//                 Your cart is empty.
//             </p>) : (<div className="grid md:grid-cols-3 gap-8 animate-slide-up">
//             <div className="md:col-span-2 space-y-6">
//                 {cart.items.map((item) => (<div
//                     key={item.itemId}
//                     className="flex items-center bg-white p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
//                 >
//                     <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-24 h-24 object-cover rounded-xl mr-6 border-2 border-purple-200"
//                     />
//                     <div className="flex-1">
//                         <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
//                         <p className="text-sm text-gray-600 mt-1">{item.category}</p>
//                         <p className="text-sm text-gray-500 italic">{item.description}</p>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                         <button
//                             onClick={() => handleUpdateQuantity(cart.cartId, item.itemId, item.quantity - 1)}
//                             className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
//                             disabled={item.quantity <= 1}
//                         >
//                             -
//                         </button>
//                         <span className="font-medium">{item.quantity}</span>
//                         <button
//                             onClick={() => handleUpdateQuantity(cart.cartId, item.itemId, item.quantity + 1)}
//                             className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
//                         >
//                             +
//                         </button>
//                     </div>
//                     <div className="ml-6 text-right">
//                         <p className="text-lg font-bold text-gray-800">₹{item.price}</p>
//                         <button
//                             onClick={() => handleRemoveItem(item.itemId)}
//                             className="text-red-500 text-sm hover:underline mt-1"
//                         >
//                             Remove
//                         </button>
//                     </div>
//                 </div>))}
//             </div>
//
//             <div className="space-y-6">
//                 <div className="bg-white p-6 rounded-2xl shadow-lg">
//                     <h3 className="text-xl font-semibold mb-4 text-gray-800">🎟️ Apply Coupons</h3>
//                     <div className="flex">
//                         <input
//                             type="text"
//                             value={coupon}
//                             onChange={(e) => setCoupon(e.target.value)}
//                             placeholder="Apply your coupons here"
//                             className="flex-1 px-4 py-2 border border-purple-300 rounded-l focus:outline-none focus:ring-2 focus:ring-purple-400"
//                         />
//                         <button
//                             className="bg-purple-600 text-white px-4 py-2 rounded-r hover:bg-purple-700 transition">
//                             Apply
//                         </button>
//                     </div>
//                 </div>
//
//                 <div className="bg-white p-6 rounded-2xl shadow-lg">
//                     <h3 className="text-xl font-semibold mb-4 text-gray-800">💳 Checkout</h3>
//                     <div className="space-y-2 text-gray-700">
//                         <p>Your cart subtotal: ₹{subtotal.toFixed(2)}</p>
//                         <p>Discount through applied coupons: ₹{discount.toFixed(2)}</p>
//                         <p>Shipping fees: ₹{shipping.toFixed(2)}</p>
//                     </div>
//                     <div className="flex justify-between items-center mt-4">
//                         <p className="text-xl font-bold text-gray-800">Total: ₹{total}</p>
//                         <button
//                             onClick={handleOrder}
//                             className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
//                         >
//                             Order Now
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>)}
//
//         <LoginPromptModal show={showLoginModal}/>
//     </div>);
// }

import React, {useState} from "react";
import {useCart} from "../context/CartContext";
import {useNavigate} from "react-router-dom";
import {placeOrder} from "../api/order";
import LoginPromptModal from "../components/LoginPromptModal";
import {getAuthToken} from "../api/_auth";
import PaymentSuccess from "./PaymentSuccess.jsx";

export default function Cart() {
    const {
        cart, handleUpdateQuantity, handleRemoveItem, getTotalPrice,
    } = useCart();
    const navigate = useNavigate();
    const token = getAuthToken();

    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(3.99);
    const shipping = 4.99;
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleOrder = async () => {
        if (!token) {
            setShowLoginModal(true);
            return;
        }
        const goToPayment = (url) => {
            try {
                window.location.assign(url);
            } catch (e) {
                const a = document.createElement("a");
                a.href = url;
                a.rel = "opener";
                a.target = "_self";
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        };

        try {
            const order = await placeOrder(token);
            sessionStorage.setItem("lastOrder", JSON.stringify(order));
            const link = order?.paymentUrl || order?.paymentLink || order?.link;
            if (link && typeof link === "string") {
                goToPayment(link);
                return;
            }
            navigate("/checkout", {state: {order}});
        } catch (error) {
            console.error("Order placement failed:", error);
            alert(error?.message || "Failed to place order. Please try again.");
        }
    };

    const subtotal = getTotalPrice();
    const total = (subtotal - discount + shipping).toFixed(2);

    return (
        <div className="min-h-screen bg-black text-white p-6 md:px-20 mt-16 transition-all duration-500 ease-in-out">
            <h2 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 drop-shadow-lg">
                🛒 Your Cart
            </h2>

            {!cart || !cart.items || cart.items.length === 0 ? (
                <p className="text-center text-gray-400 text-lg animate-pulse">
                    Your cart is empty.
                </p>
            ) : (
                <div className="grid md:grid-cols-3 gap-8 animate-slide-up">
                    {/* Cart Items */}
                    <div className="md:col-span-2 space-y-6">
                        {cart.items.map((item) => (
                            <div
                                key={item.itemId}
                                className="flex items-center bg-zinc-900 p-5 rounded-2xl shadow-lg hover:shadow-purple-700/40 transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-xl mr-6 border-2 border-purple-500/50"
                                />
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{item.category}</p>
                                    <p className="text-sm text-gray-500 italic">{item.description}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleUpdateQuantity(cart.cartId, item.itemId, item.quantity - 1)}
                                        className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded hover:bg-purple-600/40 transition"
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(cart.cartId, item.itemId, item.quantity + 1)}
                                        className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded hover:bg-purple-600/40 transition"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="ml-6 text-right">
                                    <p className="text-lg font-bold text-white">₹{item.price}</p>
                                    <button
                                        onClick={() => handleRemoveItem(item.itemId)}
                                        className="text-red-400 text-sm hover:underline mt-1"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Coupon */}
                        <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg hover:shadow-blue-700/40 transition">
                            <h3 className="text-xl font-semibold mb-4 text-white">🎟️ Apply Coupons</h3>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                    placeholder="Enter coupon code"
                                    className="flex-1 px-4 py-2 bg-black border border-purple-500/50 text-white placeholder-gray-500 rounded-l focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-r hover:opacity-90 transition"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>

                        {/* Checkout */}
                        <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg hover:shadow-purple-700/40 transition">
                            <h3 className="text-xl font-semibold mb-4 text-white">💳 Checkout</h3>
                            <div className="space-y-2 text-gray-300">
                                <p>Your cart subtotal: ₹{subtotal.toFixed(2)}</p>
                                <p>Discount through applied coupons: ₹{discount.toFixed(2)}</p>
                                <p>Shipping fees: ₹{shipping.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <p className="text-xl font-bold text-white">Total: ₹{total}</p>
                                <button
                                    onClick={handleOrder}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    Order Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <LoginPromptModal show={showLoginModal}/>
        </div>
    );
}

