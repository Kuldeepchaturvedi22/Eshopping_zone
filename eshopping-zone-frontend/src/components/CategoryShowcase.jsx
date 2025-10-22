// import womenImg from "../assets/banner-01.jpg";
// import menImg from "../assets/banner-02.jpg";
// import asses from "../assets/banner-03.jpg";
//
//
// export default function CategoryShowcase() {
//     const categories = [
//       {
//         title: "Women",
//         subtitle: "Spring 2018",
//         image: womenImg,
//       },
//       {
//         title: "Men",
//         subtitle: "Spring 2018",
//         image:menImg,
//       },
//       {
//         title: "Accessories",
//         subtitle: "New Trend",
//         image: asses,
//       },
//     ];
//
//     return (
//       <section className="py-10 px-4 relative h-[360px] md:h-[500px] rounded-3xl overflow-hidden group bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50 shadow-2xl">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {categories.map((cat) => (
//             <div key={cat.title} className="relative group overflow-hidden rounded shadow-lg">
//               <img
//                 src={cat.image}
//                 alt={cat.title}
//                 className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300"
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white">
//                 <h3 className="text-2xl font-bold">{cat.title}</h3>
//                 <p className="text-sm">{cat.subtitle}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     );
//   }
//

import womenImg from "../assets/banner-01.jpg";
import menImg from "../assets/banner-02.jpg";
import asses from "../assets/banner-03.jpg";

export default function CategoryShowcase() {
    const categories = [
        {
            title: "Women",
            subtitle: "Spring Collection 2024",
            image: womenImg,
            gradient: "from-pink-600/80 via-purple-600/60 to-rose-600/80",
            accent: "from-pink-400 to-rose-400"
        },
        {
            title: "Men",
            subtitle: "Latest Trends 2024",
            image: menImg,
            gradient: "from-blue-600/80 via-indigo-600/60 to-cyan-600/80",
            accent: "from-blue-400 to-cyan-400"
        },
        {
            title: "Accessories",
            subtitle: "Premium Collection",
            image: asses,
            gradient: "from-emerald-600/80 via-teal-600/60 to-green-600/80",
            accent: "from-emerald-400 to-teal-400"
        },
    ];

    return (
        <div className="relative py-12 px-4 max-w-7xl mx-auto">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 blur-3xl opacity-50 pointer-events-none"></div>

            <section className="relative backdrop-blur-xl bg-black/60 border-2 border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 pointer-events-none"></div>

                {/* Section Header */}
                <div className="relative text-center py-8 px-6">
                    <div className="relative inline-block">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
                            Shop by Category
                        </h2>
                        {/* Text glow effect */}
                        <div className="absolute inset-0 text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent blur-sm opacity-30 scale-110">
                            Shop by Category
                        </div>
                    </div>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                        Discover our curated collections designed for every style and occasion
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="relative p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categories.map((cat, index) => (
                            <div
                                key={cat.title}
                                className="relative group cursor-pointer"
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                {/* Outer glow container */}
                                <div className="relative">
                                    <div className={`absolute -inset-1 bg-gradient-to-r ${cat.accent} rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500`}></div>

                                    {/* Main card */}
                                    <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden backdrop-blur-sm bg-black/20 border border-white/10 shadow-2xl group-hover:scale-105 transition-all duration-500">
                                        {/* Image */}
                                        <img
                                            src={cat.image}
                                            alt={cat.title}
                                            className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700 ease-out"
                                        />

                                        {/* Gradient overlays */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-70 group-hover:opacity-50 transition-opacity duration-300`}></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                                        {/* Shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        {/* Content */}
                                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-10">
                                            <div className="relative">
                                                {/* Category title */}
                                                <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                                                    {cat.title}
                                                </h3>

                                                {/* Subtitle */}
                                                <p className="text-white/90 text-sm md:text-base font-medium mb-6 group-hover:text-white transition-colors duration-300">
                                                    {cat.subtitle}
                                                </p>

                                                {/* Enhanced CTA Button */}
                                                <div className="relative">
                                                    <div className={`absolute -inset-1 bg-gradient-to-r ${cat.accent} rounded-xl blur opacity-0 group-hover:opacity-70 transition-opacity duration-300`}></div>
                                                    <button className={`relative px-6 py-3 bg-gradient-to-r ${cat.accent} text-white font-bold text-sm rounded-xl shadow-xl border border-white/20 transform group-hover:scale-105 transition-all duration-300 hover:shadow-2xl`}>
                                                        <span className="flex items-center gap-2">
                                                            Explore Collection
                                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                                            </svg>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Decorative elements */}
                                        <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm"></div>
                                        <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 backdrop-blur-sm"></div>

                                        {/* Category badge */}
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${cat.accent} text-white shadow-lg backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0`}>
                                                NEW
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced hover effect - bottom glow */}
                                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r ${cat.accent} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm`}></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom section with additional info */}
                <div className="relative p-6 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-6 text-gray-300 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>Free Shipping</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                                <span>Easy Returns</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
                                <span>Premium Quality</span>
                            </div>
                        </div>

                        <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-semibold text-sm hover:scale-105 transition-all duration-300 shadow-lg border border-white/20">
                            View All Categories
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}