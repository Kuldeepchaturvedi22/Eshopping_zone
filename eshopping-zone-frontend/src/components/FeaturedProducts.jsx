// import React, { useEffect, useState } from "react";
// import { fetchAllProducts } from "../api/product";
// import { useNavigate } from "react-router-dom";
//
// export default function FeaturedProducts() {
//     const [items, setItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         let mounted = true;
//         const load = async () => {
//             try {
//                 const data = await fetchAllProducts();
//                 if (!mounted) return;
//                 // Simple heuristic: highest discount first; take top 8 as “featured”
//                 const sorted = (Array.isArray(data) ? data : [])
//                     .slice()
//                     .sort((a, b) => Number(b.discount ?? 0) - Number(a.discount ?? 0))
//                     .slice(0, 8);
//                 setItems(sorted);
//             } catch {
//                 setItems([]);
//             } finally {
//                 if (mounted) setLoading(false);
//             }
//         };
//         load();
//         return () => { mounted = false; };
//     }, []);
//
//     if (loading) {
//         return (
//             <section className="mt-10">
//                 <h3 className="text-xl font-semibold text-black mb-3">Featured</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {[...Array(4)].map((_, i) => (
//                         <div key={i} className="card-glass h-40 animate-pulse" />
//                     ))}
//                 </div>
//             </section>
//         );
//     }
//
//     if (items.length === 0) return null;
//
//     return (
//         <section className="mt-10">
//             <h2 className="text-4xl font-extrabold text-center mb-6 text-purple-900 drop-shadow-lg animate-fade-in">
//                 🛍️ Featured products
//             </h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
//                 {items.map((p) => (
//                     <button
//                         key={p.productId}
//                         onClick={() => navigate(`/product/${p.productId}`)}
//                         className="text-left card-glass hover:shadow-xl"
//                     >
//                         <img src={p.image} alt={p.productName} className="w-full h-36 object-cover rounded-xl mb-3" />
//                         <div className="px-1">
//                             <div className="font-semibold text-black truncate">{p.productName}</div>
//                             <div className="text-sm text-gray-700 mt-0.5">₹{p.price}</div>
//                             {p.discount ? <div className="text-xs text-emerald-600">{p.discount}% OFF</div> : null}
//                         </div>
//                     </button>
//                 ))}
//             </div>
//         </section>
//     );
// }

import React, { useEffect, useState } from "react";
import { fetchAllProducts } from "../api/product";
import { useNavigate } from "react-router-dom";

export default function FeaturedProducts() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const data = await fetchAllProducts();
                if (!mounted) return;
                // Simple heuristic: highest discount first; take top 8 as "featured"
                const sorted = (Array.isArray(data) ? data : [])
                    .slice()
                    .sort((a, b) => Number(b.discount ?? 0) - Number(a.discount ?? 0))
                    .slice(0, 8);
                setItems(sorted);
            } catch {
                setItems([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    if (loading) {
        return (
            <section className="mt-16 px-4">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8 text-center">
                    Featured Products
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl h-64 animate-pulse border border-gray-700 shadow-2xl"
                        />
                    ))}
                </div>
            </section>
        );
    }

    if (items.length === 0) return null;

    return (
        <section className="mt-16 px-4 relative">
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-3xl blur-3xl -z-10"></div>

            <div className="text-center mb-12">
                <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 animate-pulse">
                    ✨ FEATURED PRODUCTS
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
                {items.map((p) => (
                    <button
                        key={p.productId}
                        onClick={() => navigate(`/product/${p.productId}`)}
                        className="group text-left bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50 hover:border-purple-400/50 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 hover:rotate-1"
                    >
                        <div className="relative overflow-hidden rounded-xl mb-4">
                            <img
                                src={p.image}
                                alt={p.productName}
                                className="w-full h-36 md:h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Discount badge */}
                            {p.discount && (
                                <div className="absolute top-2 right-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                                    {p.discount}% OFF
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-white text-sm md:text-base leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
                                {p.productName}
                            </h3>
                            <div className="flex items-center justify-between">
                                <span className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                                    ₹{p.price}
                                </span>
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                    <span className="text-white text-xs">→</span>
                                </div>
                            </div>
                        </div>

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
                    </button>
                ))}
            </div>

            {/* Bottom decorative element */}
            <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                    ))}
                </div>
            </div>
        </section>
    );
}