const products = [
    { id: 1, name: "Smartphone", price: "₹19,999" },
    { id: 2, name: "Headphones", price: "₹2,499" },
    { id: 3, name: "Sneakers", price: "₹3,999" },
  ];
  
  export default function FeaturedProducts() {
    return (
      <section className="py-10 px-4">
        <h3 className="text-2xl font-semibold mb-6">Featured Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow">
              <h4 className="text-lg font-bold">{product.name}</h4>
              <p className="text-gray-600">{product.price}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  