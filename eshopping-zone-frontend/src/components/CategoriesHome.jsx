import React from "react";

const categories = ["Electronics", "Fashion", "Home", "Books", "Toys"];

export default function Categories() {
  return (
    <section className="py-10 px-4 mt-20">
      <h3 className="text-2xl font-semibold mb-5">Shop by Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <div
            key={cat}
            className="bg-blue-100 p-4 rounded text-center hover:bg-blue-200 transition-colors"
          >
            <h4 className="text-lg font-semibold">{cat}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
