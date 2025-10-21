import Navbar from './Navbar';

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen mt-8">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-blue-500 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">About eShopping Zone</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Your one-stop destination for fashion, electronics, and lifestyle essentials.
        </p>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-16 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">Who We Are</h2>
          <p className="text-gray-700 text-lg mb-12">
            At <strong>eShopping Zone</strong>, we’re passionate about delivering the best online shopping experience with top-quality products and unbeatable service.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">🎯 Our Mission</h3>
              <p className="text-gray-600">
                Deliver quality products at affordable prices with unmatched customer service.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">🌟 Our Vision</h3>
              <p className="text-gray-600">
                To become India’s most trusted and loved online shopping platform.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">🚀 Why Choose Us</h3>
              <p className="text-gray-600">
                Fast delivery, secure payments, easy returns, and a wide range of products.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer removed here if already globally included */}
    </div>
  );
}
