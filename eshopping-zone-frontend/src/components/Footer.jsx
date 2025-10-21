export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-10 px-4 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">About eShopping Zone</h2>
          <p className="text-sm leading-relaxed">
            eShopping Zone is your one-stop destination for the latest and greatest in fashion, electronics, and lifestyle products. We’re committed to delivering a seamless shopping experience with top-notch customer service and unbeatable deals.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p className="text-sm">📧 support@eshoppingzone.com</p>
          <p className="text-sm">📞 +91 98765 43210</p>
          <p className="text-sm">📍 Mumbai, Maharashtra, India</p>
        </div>

        {/* Greetings & Socials */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Stay Connected</h2>
          <p className="text-sm mb-2">Thank you for shopping with us! We hope to see you again soon. 😊</p>
          <div className="flex justify-center md:justify-start gap-4 mt-2">
            <a href="#" className="hover:text-blue-300">Facebook</a>
            <a href="#" className="hover:text-blue-300">Instagram</a>
            <a href="#" className="hover:text-blue-300">Twitter</a>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-400 mt-8 pt-4 text-center text-sm">
        &copy; {new Date().getFullYear()} eShopping Zone. All rights reserved.
      </div>
    </footer>
  );
}
