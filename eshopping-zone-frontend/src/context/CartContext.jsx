import React, { createContext, useContext, useEffect, useState } from "react";
import {
    fetchCartByCustomer,
    addItemToCart,
    updateCart,
    removeItemFromCart,
} from "../api/cart";
import { getAuthToken } from "../api/_auth";

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

// Normalize backend CartDTO -> UI-friendly cart
function normalizeCart(raw) {
    if (!raw) return { cartId: "", items: [] };

    // If API returns a list, take the first cart (adjust if you later support multiple carts)
    const cartDto = Array.isArray(raw) ? raw[0] : raw;
    const items = Array.isArray(cartDto?.items) ? cartDto.items : [];

    const normItems = items.map((it) => ({
        itemId: it.itemId,                // backend field
        productId: it.productId,          // used by Products.isInCart
        name: it.itemName ?? it.name,     // UI expects "name"
        category: it.category,
        description: it.description,
        image: it.image,
        price: Number(it.price ?? 0),
        quantity: Number(it.quantity ?? 1),
        itemType: it.itemType,
        discount: it.discount,
    }));

    return {
        cartId: cartDto.cartId ?? "",
        items: normItems,
        customerId: cartDto.customerId,
        totalPrice: cartDto.totalPrice,
    };
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState({ cartId: "", items: [] });

    const loadCart = async () => {
        try {
            const token = getAuthToken();
            const customerId = localStorage.getItem("customerId");
            if (!token || !customerId) {
                setCart({ cartId: "", items: [] });
                return;
            }

            const data = await fetchCartByCustomer(customerId, token);
            setCart(normalizeCart(data));
        } catch (err) {
            console.error("Failed to load cart", err);
            setCart({ cartId: "", items: [] });
        }
    };

    useEffect(() => {
        // Load on mount
        loadCart();

        // Reload whenever auth changes
        const onStorage = (e) => {
            if (!e || ["token", "customerId"].includes(e.key)) loadCart();
        };
        window.addEventListener("storage", onStorage);
        window.addEventListener("auth:changed", loadCart);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("auth:changed", loadCart);
        };
    }, []);

    const handleAddToCart = async (product) => {
        try {
            const token = getAuthToken();
            const customerId = localStorage.getItem("customerId");
            if (!token || !customerId) {
                console.log("Please log in to add items to cart");
                return;
            }
            await addItemToCart(product.productId, token);
            await loadCart();
        } catch (err) {
            console.error("Add to cart failed", err);
            throw err;
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const token = getAuthToken();
            const customerId = localStorage.getItem("customerId");
            if (!token || !customerId) {
                console.log("Please log in to remove items from cart");
                return;
            }
            
            // Optimistic update - remove item immediately from UI
            setCart(prevCart => ({
                ...prevCart,
                items: prevCart.items.filter(item => item.itemId !== itemId)
            }));
            
            await removeItemFromCart(itemId, token);
            await loadCart(); // Sync with backend
        } catch (err) {
            console.error("Remove item failed", err);
            await loadCart(); // Revert on error
            throw err;
        }
    };

    const handleUpdateQuantity = async (cartId, itemId, newQuantity) => {
        const token = getAuthToken();
        const customerId = localStorage.getItem("customerId");
        if (!token || !customerId || !cart || cart.cartId !== cartId) return;

        // Optimistic update - update quantity immediately in UI
        const updatedItems = cart.items.map((item) =>
            item.itemId === itemId ? { ...item, quantity: newQuantity } : item
        );
        const updatedCart = { ...cart, items: updatedItems };
        setCart(updatedCart);

        try {
            await updateCart(cartId, updatedCart, token);
            await loadCart(); // Sync with backend
        } catch (err) {
            console.error("Update quantity failed", err);
            await loadCart(); // Revert on error
        }
    };

    const getTotalItems = () => (cart?.items ? cart.items.length : 0);
    const getTotalPrice = () =>
        cart?.items ? cart.items.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0) : 0;

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                handleAddToCart,
                handleRemoveItem,
                handleUpdateQuantity,
                getTotalItems,
                getTotalPrice,
                reloadCart: loadCart,
                cartItems: cart.items,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}