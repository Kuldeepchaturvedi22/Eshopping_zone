// import React, { useEffect, useMemo, useState, useCallback } from "react";
//
// const TAGLINE_KEY = "site:tagline";
// const BANNER_KEY = "site:banner";
//
// export default function Hero() {
//     const defaultTagline = "Shop the latest collections";
//     const defaultBanners = useMemo(() => ["/banner-01.jpg", "/banner-02.jpg", "/banner-03.jpg", "/hero-bg.jpg"], []);
//
//     // Stable random-picker so effects don't re-run endlessly
//     const pickDefault = useCallback(
//         () => defaultBanners[Math.floor(Math.random() * defaultBanners.length)],
//         [defaultBanners]
//     );
//
//     const [tagline, setTagline] = useState(() => localStorage.getItem(TAGLINE_KEY) || defaultTagline);
//     const [banner, setBanner] = useState(() => localStorage.getItem(BANNER_KEY) || pickDefault());
//
//     useEffect(() => {
//         const onUpdate = () => {
//             const nextTagline = localStorage.getItem(TAGLINE_KEY) || defaultTagline;
//             const stored = localStorage.getItem(BANNER_KEY);
//             const nextBanner = stored || pickDefault();
//
//             // Update only when value actually changes to avoid render loops
//             setTagline((prev) => (prev === nextTagline ? prev : nextTagline));
//             setBanner((prev) => (prev === nextBanner ? prev : nextBanner));
//         };
//
//         window.addEventListener("site:settings-updated", onUpdate);
//         return () => window.removeEventListener("site:settings-updated", onUpdate);
//     }, [pickDefault]);
//
//     return (
//         <section className="relative h-[320px] md:h-[460px] rounded-3xl overflow-hidden mt-16 group">
//             <img
//                 src={banner}
//                 alt="Banner"
//                 className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[1800ms] ease-out group-hover:scale-110"
//                 onError={(e) => {
//                     const fallback = pickDefault();
//                     if (e.currentTarget.src.endsWith(fallback)) return; // avoid loops if fallback fails too
//                     e.currentTarget.src = fallback;
//                 }}
//                 fetchPriority="high"
//             />
//             <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/70" />
//
//             <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2">
//                 <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-black shadow">New Arrivals</span>
//                 <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500 text-white shadow">Up to 60% Off</span>
//                 <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500 text-white shadow">Free Shipping over ₹999</span>
//             </div>
//
//             <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
//                 <h1 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
//                     {tagline || defaultTagline}
//                 </h1>
//                 <p className="mt-3 text-white/90 text-sm md:text-base">
//                     Discover curated styles, exclusive drops, and everyday essentials.
//                 </p>
//                 <div className="mt-6 flex gap-3">
//                     <a href="/categories" className="btn-glossy">Shop Now</a>
//                     <a href="/products" className="btn-glossy">Explore</a>
//                 </div>
//             </div>
//         </section>
//     );
// }

import React, { useEffect, useMemo, useState, useCallback } from "react";

const TAGLINE_KEY = "site:tagline";
const BANNER_KEY = "site:banner";

export default function Hero() {
    const defaultTagline = "Shop the latest collections";
    const defaultBanners = useMemo(() => ["/banner-01.jpg", "/banner-02.jpg", "/banner-03.jpg", "/hero-bg.jpg"], []);

    // Stable random-picker so effects don't re-run endlessly
    const pickDefault = useCallback(
        () => defaultBanners[Math.floor(Math.random() * defaultBanners.length)],
        [defaultBanners]
    );

    const [tagline, setTagline] = useState(() => localStorage?.getItem(TAGLINE_KEY) || defaultTagline);
    const [banner, setBanner] = useState(() => localStorage?.getItem(BANNER_KEY) || pickDefault());

    useEffect(() => {
        const onUpdate = () => {
            const nextTagline = localStorage?.getItem(TAGLINE_KEY) || defaultTagline;
            const stored = localStorage?.getItem(BANNER_KEY);
            const nextBanner = stored || pickDefault();

            // Update only when value actually changes to avoid render loops
            setTagline((prev) => (prev === nextTagline ? prev : nextTagline));
            setBanner((prev) => (prev === nextBanner ? prev : nextBanner));
        };

        window.addEventListener("site:settings-updated", onUpdate);
        return () => window.removeEventListener("site:settings-updated", onUpdate);
    }, [pickDefault]);

    return (
        <div className="relative mt-20 py-5 px-4 max-w-7xl mx-auto">
            {/* Glow effect container */}
            <div className="relative">
                {/* Animated background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>

                {/* Main hero section */}
                <section className="relative h-[360px] md:h-[500px] rounded-3xl overflow-hidden group bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50 shadow-2xl">
                    {/* Background image */}
                    <img
                        src={banner}
                        alt="Banner"
                        className="absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-[2000ms] ease-out group-hover:scale-110 opacity-80"
                        onError={(e) => {
                            const fallback = pickDefault();
                            if (e.currentTarget.src.endsWith(fallback)) return;
                            e.currentTarget.src = fallback;
                        }}
                        fetchPriority="high"
                    />

                    {/* Enhanced gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black/60 to-blue-900/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {/* Floating badges with enhanced styling */}
                    <div className="absolute top-6 left-6 z-20 flex flex-wrap gap-3">
                        <span className="px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-white to-gray-100 text-gray-900 shadow-xl border border-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                            ✨ New Arrivals
                        </span>
                        <span className="px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl border border-emerald-400/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                            🔥 Up to 60% Off
                        </span>
                        <span className="px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl border border-indigo-400/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                            🚚 Free Shipping ₹999+
                        </span>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

                    {/* Main content */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                        {/* Enhanced title with glow effect */}
                        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 leading-tight">
                            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl filter">
                                {tagline || defaultTagline}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent blur-2xl opacity-30 scale-110">
                                {tagline || defaultTagline}
                            </div>
                        </h1>

                        {/* Enhanced subtitle */}
                        <p className="text-gray-100 text-lg md:text-xl max-w-2xl leading-relaxed font-medium drop-shadow-lg">
                            Discover curated styles, exclusive drops, and everyday essentials crafted for the modern lifestyle.
                        </p>

                        {/* Enhanced CTA buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <a
                                href="/categories"
                                className="group relative px-8 py-4 font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden border border-purple-400/30"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    Shop Now
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                    </svg>
                                </span>
                            </a>

                            <a
                                href="/products"
                                className="group relative px-8 py-4 font-bold text-white bg-white/10 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm hover:bg-white/20"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Explore Collection
                                    <svg className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </span>
                            </a>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-8 flex items-center gap-6 text-gray-300 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>Live Support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                                <span>Secure Checkout</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
                                <span>Fast Delivery</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom gradient fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"></div>
                </section>
            </div>
        </div>
    );
}