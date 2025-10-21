import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";
import AnimatedToast from "../components/AnimatedToast";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    emailId: "",
    mobileNumber: "",
    about: "",
    dateOfBirth: "",
    gender: "",
    role: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      fullName: formData.fullName,
      emailId: formData.emailId,
      mobileNumber: formData.mobileNumber,
      about: formData.about,
      dateOfBirth: formatDate(formData.dateOfBirth),
      gender: formData.gender,
      role: formData.role,
      address: [
        {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
        },
      ],
    };

    try {
      await register(userData);
      showToast("Registration successful!", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Registration failed:", err);
      showToast(err.message || "Registration failed.", "error");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] px-4 mt-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 transition-all duration-500 ease-in-out">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700 drop-shadow">
          Create Your Account
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up"
          onSubmit={handleSubmit}
        >
          <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} className="p-3 border border-purple-200 rounded focus:ring-2 focus:ring-purple-400" required />
          <input type="email" name="emailId" placeholder="Email" onChange={handleChange} className="p-3 border border-purple-200 rounded focus:ring-2 focus:ring-purple-400" required />
          <input type="tel" name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} className="p-3 border border-purple-200 rounded focus:ring-2 focus:ring-purple-400" required />
          <input type="date" name="dateOfBirth" onChange={handleChange} className="p-3 border border-purple-200 rounded focus:ring-2 focus:ring-purple-400" required />

          <select name="gender" onChange={handleChange} className="p-3 border border-purple-200 rounded focus:ring-2 focus:ring-purple-400" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select name="role" onChange={handleChange} className="p-3 border border-purple-200 rounded focus:ring-2 focus:ring-purple-400" required>
            <option value="">Select Role</option>
            <option value="CUSTOMER">Customer</option>
            <option value="MERCHANT">Merchant</option>
            <option value="ADMIN">Admin</option>
          </select>

          <textarea name="about" placeholder="About" onChange={handleChange} className="p-3 border border-purple-200 rounded md:col-span-2 focus:ring-2 focus:ring-purple-400" rows="3" />

          <input type="text" name="street" placeholder="Street" onChange={handleChange} className="p-3 border border-purple-200 rounded focus:ring-2 focus:ring-purple-400" required />
          <input type="text" name="city" placeholder="City" onChange={handleChange} className="p-3 border border-purple-200 rounded focus:ring-2 focus:ring-purple-400" required />
          <input type="text" name="state" placeholder="State" onChange={handleChange} className="p-3 border border-purple-200 rounded focus:ring-2 focus:ring-purple-400" required />
          <input type="text" name="country" placeholder="Country" onChange={handleChange} className="p-3 border border-purple-200 rounded focus:ring-2 focus:ring-purple-400" required />
          <input type="text" name="zipCode" placeholder="Zip Code" onChange={handleChange} className="p-3 border border-purple-200 rounded focus:ring-2 focus:ring-purple-400" required />

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:scale-105 transition-transform duration-300 shadow-md md:col-span-2"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>

      <AnimatedToast {...toast} />
    </div>
  );
}
