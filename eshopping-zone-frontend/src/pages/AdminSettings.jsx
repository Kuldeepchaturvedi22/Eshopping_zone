// // src/pages/AdminSettings.jsx
// import React, { useEffect, useState } from "react";
//
// const TAGLINE_KEY = "site:tagline";
// const BANNER_KEY = "site:banner";
//
// export default function AdminSettings() {
//     const [tagline, setTagline] = useState("");
//     const [banner, setBanner] = useState("");
//
//     useEffect(() => {
//         setTagline(localStorage.getItem(TAGLINE_KEY) || "");
//         setBanner(localStorage.getItem(BANNER_KEY) || "");
//     }, []);
//
//     const save = () => {
//         localStorage.setItem(TAGLINE_KEY, tagline.trim());
//         localStorage.setItem(BANNER_KEY, banner.trim());
//         window.dispatchEvent(new Event("site:settings-updated"));
//         alert("Saved.");
//     };
//
//     const reset = () => {
//         localStorage.removeItem(TAGLINE_KEY);
//         localStorage.removeItem(BANNER_KEY);
//         window.dispatchEvent(new Event("site:settings-updated"));
//         setTagline("");
//         setBanner("");
//     };
//
//     return (
//         <div className="max-w-3xl mx-auto p-4 mt-16">
//             <h2 className="text-2xl font-bold mb-4">Storefront Settings</h2>
//             <div className="grid gap-3">
//                 <label className="text-sm">Homepage tagline</label>
//                 <input className="border rounded px-3 py-2" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Great deals everyday" />
//                 <label className="text-sm mt-2">Banner image URL</label>
//                 <input className="border rounded px-3 py-2" value={banner} onChange={(e) => setBanner(e.target.value)} placeholder="https://example.com/banner.jpg" />
//                 <div className="flex gap-2 mt-3">
//                     <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
//                     <button onClick={reset} className="px-4 py-2 border rounded">Reset</button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// src/pages/AdminSettings.jsx
import React, { useEffect, useState } from "react";

const TAGLINE_KEY = "site:tagline";
const BANNER_KEY = "site:banner";

export default function AdminSettings() {
    const [tagline, setTagline] = useState("");
    const [banner, setBanner] = useState("");

    useEffect(() => {
        setTagline(localStorage.getItem(TAGLINE_KEY) || "");
        setBanner(localStorage.getItem(BANNER_KEY) || "");
    }, []);

    const save = () => {
        localStorage.setItem(TAGLINE_KEY, tagline.trim());
        localStorage.setItem(BANNER_KEY, banner.trim());
        window.dispatchEvent(new Event("site:settings-updated"));
        alert("Saved.");
    };

    const reset = () => {
        localStorage.removeItem(TAGLINE_KEY);
        localStorage.removeItem(BANNER_KEY);
        window.dispatchEvent(new Event("site:settings-updated"));
        setTagline("");
        setBanner("");
    };

    return (
        <div className="max-w-3xl mx-auto p-6 mt-16 bg-black min-h-screen text-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-white">⚙️ Storefront Settings</h2>
            <div className="grid gap-4 bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">

                <label className="text-sm text-gray-300">Homepage Tagline</label>
                <input
                    className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Great deals everyday"
                />

                <label className="text-sm text-gray-300 mt-2">Banner Image URL</label>
                <input
                    className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    placeholder="https://example.com/banner.jpg"
                />

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={save}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/50 transition"
                    >
                        Save
                    </button>
                    <button
                        onClick={reset}
                        className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 hover:shadow-lg hover:shadow-gray-400/30 transition"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
