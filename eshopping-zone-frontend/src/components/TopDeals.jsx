// // NEW COMPONENT: src/components/TopDeals.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { fetchAllProducts } from "../api/product";
// import { motion, AnimatePresence } from "framer-motion";
//
// export default function TopDeals() {
//     const [products, setProducts] = useState([]);
//     const [idx, setIdx] = useState(0);
//
//     useEffect(() => {
//         fetchAllProducts()
//             .then((all) => {
//                 const sorted = [...(all || [])]
//                     .sort((a, b) => Number(b.discount ?? 0) - Number(a.discount ?? 0))
//                     .slice(0, 4);
//                 setProducts(sorted);
//             })
//             .catch(() => setProducts([]));
//     }, []);
//
//     useEffect(() => {
//         if (products.length <= 1) return;
//         const t = setInterval(() => setIdx((i) => (i + 1) % products.length), 4000);
//         return () => clearInterval(t);
//     }, [products]);
//
//     const current = useMemo(() => products[idx] || null, [products, idx]);
//
//     if (!current) return null;
//
//     return (
//         <section className="max-w-7xl mx-auto mt-8 px-4">
//             <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-1 shadow-lg">
//                 <div className="bg-white rounded-2xl p-4 md:p-6">
//                     <div className="flex items-center justify-between mb-3">
//                         <h2 className="text-xl md:text-2xl font-bold text-gray-800">Top Deals</h2>
//                         <span className="text-xs text-gray-500">
//               {idx + 1} / {products.length}
//             </span>
//                     </div>
//
//                     <div className="grid md:grid-cols-2 gap-4 md:gap-6">
//                         <AnimatePresence mode="wait">
//                             <motion.div
//                                 key={current.productId}
//                                 initial={{ opacity: 0, x: 20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 exit={{ opacity: 0, x: -20 }}
//                                 transition={{ duration: 0.4 }}
//                                 className="flex items-center gap-4"
//                             >
//                                 <img
//                                     src={current.image}
//                                     alt={current.productName}
//                                     className="w-32 h-32 md:w-44 md:h-44 rounded-xl object-cover shadow"
//                                 />
//                                 <div>
//                                     <h3 className="text-lg md:text-xl font-semibold text-gray-900">
//                                         {current.productName}
//                                     </h3>
//                                     <p className="text-sm text-gray-600 line-clamp-2">{current.description}</p>
//                                     <div className="mt-2 flex items-center gap-2">
//                                         <span className="text-2xl font-bold text-blue-700">₹{current.price}</span>
//                                         <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
//                       {current.discount}% OFF
//                     </span>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         </AnimatePresence>
//
//                         <div className="flex items-center justify-end gap-2">
//                             <button
//                                 onClick={() => setIdx((i) => (i - 1 + products.length) % products.length)}
//                                 className="px-3 py-2 rounded border text-sm hover:bg-gray-50"
//                             >
//                                 Prev
//                             </button>
//                             <button
//                                 onClick={() => setIdx((i) => (i + 1) % products.length)}
//                                 className="px-3 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }

// src/components/TopDeals.jsx
import React, { useEffect, useMemo, useState } from "react";
import { fetchAllProducts } from "../api/product";
import { motion, AnimatePresence } from "framer-motion";

export default function TopDeals() {
    const [products, setProducts] = useState([]);
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        fetchAllProducts()
            .then((all) => {
                const sorted = [...(all || [])]
                    .sort((a, b) => Number(b.discount ?? 0) - Number(a.discount ?? 0))
                    .slice(0, 4);
                setProducts(sorted);
            })
            .catch(() => setProducts([]));
    }, []);

    useEffect(() => {
        if (products.length <= 1) return;
        const t = setInterval(() => setIdx((i) => (i + 1) % products.length), 4000);
        return () => clearInterval(t);
    }, [products]);

    const current = useMemo(() => products[idx] || null, [products, idx]);

    if (!current) return null;

    return (
        <section className="max-w-7xl mx-auto mt-8 px-4">
            <div className="bg-gradient-to-r from-purple-700 to-blue-700 rounded-2xl p-1 shadow-xl">
                <div className="bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-800">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl md:text-2xl font-bold text-white">🔥 Top Deals</h2>
                        <span className="text-xs text-gray-400">
                            {idx + 1} / {products.length}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current.productId}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="flex items-center gap-4"
                            >
                                <img
                                    src={current.image}
                                    alt={current.productName}
                                    className="w-32 h-32 md:w-44 md:h-44 rounded-xl object-cover shadow-lg border border-gray-700"
                                />
                                <div>
                                    <h3 className="text-lg md:text-xl font-semibold text-white">
                                        {current.productName}
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-2">
                                        {current.description}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-2xl font-bold text-blue-400">
                                            ₹{current.price}
                                        </span>
                                        <span className="px-2 py-0.5 rounded text-xs bg-green-800 text-green-300 border border-green-600">
                                            {current.discount}% OFF
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Controls */}
                        <div className="flex items-center justify-end gap-2">
                            <button
                                onClick={() => setIdx((i) => (i - 1 + products.length) % products.length)}
                                className="px-3 py-2 rounded border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => setIdx((i) => (i + 1) % products.length)}
                                className="px-3 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-500 transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
