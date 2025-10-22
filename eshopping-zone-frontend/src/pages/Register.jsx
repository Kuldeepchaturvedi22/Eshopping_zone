import { useState } from 'react';

// Mock Link component for demo (replace with actual router link)
const Link = ({ to, className, children }) => (
    <a href={to} className={className}>{children}</a>
);

// Mock AnimatedToast component (replace with your actual component)
const AnimatedToast = ({ message, type, visible }) => (
    visible ? (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'error' ? 'bg-red-500 text-black' : 'bg-green-500 text-black'
        }`}>
            {message}
        </div>
    ) : null
);

export default function RegistrationForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        emailId: '',
        mobileNumber: '',
        dateOfBirth: '',
        image: '',
        gender: '',
        role: '',
        about: '',
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
    });

    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    const showToast = (message, type) => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'fullName':
                if (!value.trim()) {
                    error = 'Full name is required';
                } else if (value.trim().length < 2) {
                    error = 'Full name must be at least 2 characters';
                } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
                    error = 'Full name can only contain letters and spaces';
                }
                break;

            case 'emailId':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;

            case 'mobileNumber':
                if (!value.trim()) {
                    error = 'Mobile number is required';
                } else if (!/^\+?[\d\s\-()]+$/.test(value)) {
                    error = 'Please enter a valid mobile number';
                } else if (value.replace(/\D/g, '').length < 10) {
                    error = 'Mobile number must be at least 10 digits';
                }
                break;

            case 'dateOfBirth':
                if (!value) {
                    error = 'Date of birth is required';
                } else {
                    const birthDate = new Date(value);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();

                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }

                    if (birthDate > today) {
                        error = 'Date of birth cannot be in the future';
                    } else if (age < 13) {
                        error = 'You must be at least 13 years old';
                    } else if (age > 120) {
                        error = 'Please enter a valid date of birth';
                    }
                }
                break;

            case 'image':
                if (value.trim() && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value)) {
                    error = 'Please enter a valid image URL (jpg, jpeg, png, gif, webp)';
                }
                break;

            case 'gender':
                if (!value) {
                    error = 'Please select a gender';
                }
                break;

            case 'role':
                if (!value) {
                    error = 'Please select a role';
                }
                break;

            case 'street':
                if (!value.trim()) {
                    error = 'Street address is required';
                } else if (value.trim().length < 5) {
                    error = 'Street address must be at least 5 characters';
                }
                break;

            case 'city':
                if (!value.trim()) {
                    error = 'City is required';
                } else if (!/^[a-zA-Z\s\-.]+$/.test(value.trim())) {
                    error = 'City can only contain letters, spaces, hyphens, and periods';
                }
                break;

            case 'state':
                if (!value.trim()) {
                    error = 'State is required';
                } else if (!/^[a-zA-Z\s\-.]+$/.test(value.trim())) {
                    error = 'State can only contain letters, spaces, hyphens, and periods';
                }
                break;

            case 'country':
                if (!value.trim()) {
                    error = 'Country is required';
                } else if (!/^[a-zA-Z\s\-.]+$/.test(value.trim())) {
                    error = 'Country can only contain letters, spaces, hyphens, and periods';
                }
                break;

            case 'zipCode':
                if (!value.trim()) {
                    error = 'Zip code is required';
                } else if (!/^[\d\-\s]+$/.test(value.trim())) {
                    error = 'Please enter a valid zip code';
                } else if (value.trim().length < 3) {
                    error = 'Zip code must be at least 3 characters';
                }
                break;

            default:
                break;
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        Object.keys(formData).forEach(field => {
            // Skip validation for optional fields
            if (field === 'image' || field === 'about') {
                const error = validateField(field, formData[field]);
                if (error) {
                    newErrors[field] = error;
                    isValid = false;
                }
                return;
            }

            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            showToast('Registration successful!', 'success');
            console.log('Form submitted:', formData);
            // Handle a successful submission here
        } else {
            showToast('Please fix the errors before submitting', 'error');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-[80vh] px-4 bg-gradient-to-br from-blue-400 b to-black transition-all duration-500 ease-in-out">
            <div className="w-full max-w-2xl bg-black   p-8 rounded-2xl shadow-2xl animate-fade-in">
                <h2 className="text-3xl font-bold text-center mb-6 text-purple-700 drop-shadow">
                    Create Your Account
                </h2>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up"
                >
                    {/* Full Name */}
                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`p-3   bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all border rounded focus:ring-2 focus:outline-none placeholder:text-black   ${
                                errors.fullName ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-400'
                            }`}
                            required
                        />
                        {errors.fullName && <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <input
                            type="email"
                            name="emailId"
                            placeholder="Email"
                            value={formData.emailId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`p-3 border  bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all rounded focus:ring-2 focus:outline-none placeholder:text-black   ${
                                errors.emailId ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-400'
                            }`}
                            required
                        />
                        {errors.emailId && <span className="text-red-500 text-xs mt-1">{errors.emailId}</span>}
                    </div>

                    {/* Mobile Number */}
                    <div className="flex flex-col">
                        <input
                            type="tel"
                            name="mobileNumber"
                            placeholder="Mobile Number"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`p-3 border  bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all rounded focus:ring-2 focus:outline-none placeholder:text-black  ${
                                errors.mobileNumber ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-400'
                            }`}
                            required
                        />
                        {errors.mobileNumber && <span className="text-red-500 text-xs mt-1">{errors.mobileNumber}</span>}
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col">
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`p-3 border  bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all rounded focus:ring-2 focus:outline-none placeholder:text-black   ${
                                errors.dateOfBirth ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-400'
                            }`}
                            required
                        />
                        {errors.dateOfBirth && <span className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</span>}
                    </div>

                    {/* Profile Image URL */}
                    <div className="flex flex-col md:col-span-2">
                        <input
                            type="url"
                            name="image"
                            placeholder="Profile Image URL (optional)"
                            value={formData.image}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`p-3 border  bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all rounded focus:ring-2 focus:outline-none placeholder:text-black   ${
                                errors.image ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-400'
                            }`}
                        />
                        {errors.image && <span className="text-red-500 text-xs mt-1">{errors.image}</span>}
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col">
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`p-3 border bg-gradient-to-br from-gray-400 via-purple-300 text-black to-black transition-all rounded focus:ring-2 focus:outline-none placeholder:text-black   ${
                                errors.gender ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-400'
                            }`}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.gender && <span className="text-red-500 text-xs mt-1">{errors.gender}</span>}
                    </div>

                    {/* Role */}
                    <div className="flex flex-col">
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`p-3 border bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all rounded focus:ring-2 focus:outline-none placeholder:text-black   ${
                                errors.role ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-400'
                            }`}
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="CUSTOMER">Customer</option>
                            <option value="MERCHANT">Merchant</option>
                        </select>
                        {errors.role && <span className="text-red-500 text-xs mt-1">{errors.role}</span>}
                    </div>

                    {/* About */}
                    <div className="flex flex-col md:col-span-2">
            <textarea
                name="about"
                placeholder="About (optional)"
                value={formData.about}
                onChange={handleChange}
                className="p-3 border  bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all border-purple-200 rounded focus:ring-2 focus:ring-purple-400 placeholder:text-black focus:outline-none  "
                rows="3"
            />
                    </div>

                    {/* Address Fields */}
                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="street"
                            placeholder="Street"
                            value={formData.street}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`p-3 border  bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all rounded focus:ring-2 placeholder:text-black focus:outline-none   ${
                                errors.street ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-400'
                            }`}
                            required
                        />
                        {errors.street && <span className="text-red-500 text-xs mt-1">{errors.street}</span>}
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`p-3 border  bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all rounded focus:ring-2 placeholder:text-black focus:outline-none   ${
                                errors.city ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-400'
                            }`}
                            required
                        />
                        {errors.city && <span className="text-red-500 text-xs mt-1">{errors.city}</span>}
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`p-3 border  bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all rounded focus:ring-2 placeholder:text-black focus:outline-none   ${
                                errors.state ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-400'
                            }`}
                            required
                        />
                        {errors.state && <span className="text-red-500 text-xs mt-1">{errors.state}</span>}
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`p-3 border  bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all rounded focus:ring-2 placeholder:text-black focus:outline-none   ${
                                errors.country ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-400'
                            }`}
                            required
                        />
                        {errors.country && <span className="text-red-500 text-xs mt-1">{errors.country}</span>}
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="zipCode"
                            placeholder="Zip Code"
                            value={formData.zipCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`p-3 border  bg-gradient-to-br from-gray-400 via-purple-400 to-black  text-black transition-all rounded focus:ring-2 placeholder:text-black focus:outline-none   ${
                                errors.zipCode ? 'border-red-400 focus:ring-red-400' : 'border-purple-200 focus:ring-purple-400'
                            }`}
                            required
                        />
                        {errors.zipCode && <span className="text-red-500 text-xs mt-1">{errors.zipCode}</span>}
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-black py-3 rounded-lg hover:scale-105 transition-transform duration-300 shadow-md md:col-span-2 placeholder:text-black font-semibold"
                    >
                        Register
                    </button>
                </div>

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

// import { useState } from 'react';
//
// // Mock Link component (replace with actual router link)
// const Link = ({ to, className, children }) => (
//     <a href={to} className={className}>{children}</a>
// );
//
// // Mock AnimatedToast component
// const AnimatedToast = ({ message, type, visible }) => (
//     visible ? (
//         <div
//             className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300
//                 ${type === 'error' ? 'bg-red-600 text-black' : 'bg-green-600 text-black'}`}
//         >
//             {message}
//         </div>
//     ) : null
// );
//
// export default function RegistrationForm() {
//     const [formData, setFormData] = useState({
//         fullName: '',
//         emailId: '',
//         mobileNumber: '',
//         dateOfBirth: '',
//         image: '',
//         gender: '',
//         role: '',
//         about: '',
//         street: '',
//         city: '',
//         state: '',
//         country: '',
//         zipCode: ''
//     });
//
//     const [errors, setErrors] = useState({});
//     const [toast, setToast] = useState({ message: '', type: '', visible: false });
//
//     const showToast = (message, type) => {
//         setToast({ message, type, visible: true });
//         setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
//     };
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//         if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
//     };
//
//     const validateForm = () => {
//         const newErrors = {};
//         let isValid = true;
//
//         Object.keys(formData).forEach(field => {
//             if (!formData[field] && field !== "image" && field !== "about") {
//                 newErrors[field] = `${field} is required`;
//                 isValid = false;
//             }
//         });
//
//         setErrors(newErrors);
//         return isValid;
//     };
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validateForm()) {
//             showToast('Registration successful!', 'success');
//             console.log('Form submitted:', formData);
//         } else {
//             showToast('Please fix the errors before submitting', 'error');
//         }
//     };
//
//     return (
//         <div className="flex flex-col justify-center items-center min-h-[90vh] px-4
//                         bg-gradient-to-br from-black via-gray-900 to-black transition-all duration-500">
//             <div className="w-full max-w-2xl bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
//                 <h2 className="text-3xl font-bold text-center mb-6 text-black drop-shadow-lg">
//                     Create Your Account
//                 </h2>
//
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
//                     {/* Full Name */}
//                     <div className="flex flex-col">
//                         <input
//                             type="text"
//                             name="fullName"
//                             placeholder="Full Name"
//                             value={formData.fullName}
//                             onChange={handleChange}
//                             className={`p-3 rounded bg-gray-800 text-black
//                                 focus:ring-2 focus:outline-none  
//                                 ${errors.fullName ? 'border border-red-500 focus:ring-red-500' : 'border border-gray-700 focus:ring-purple-500'}`}
//                         />
//                         {errors.fullName && <span className="text-red-400 text-xs mt-1">{errors.fullName}</span>}
//                     </div>
//
//                     {/* Email */}
//                     <div className="flex flex-col">
//                         <input
//                             type="email"
//                             name="emailId"
//                             placeholder="Email"
//                             value={formData.emailId}
//                             onChange={handleChange}
//                             className={`p-3 rounded bg-gray-800 text-black
//                                 focus:ring-2 focus:outline-none  
//                                 ${errors.emailId ? 'border border-red-500 focus:ring-red-500' : 'border border-gray-700 focus:ring-purple-500'}`}
//                         />
//                         {errors.emailId && <span className="text-red-400 text-xs mt-1">{errors.emailId}</span>}
//                     </div>
//
//                     {/* Mobile */}
//                     <div className="flex flex-col">
//                         <input
//                             type="tel"
//                             name="mobileNumber"
//                             placeholder="Mobile Number"
//                             value={formData.mobileNumber}
//                             onChange={handleChange}
//                             className={`p-3 rounded bg-gray-800 text-black
//                                 focus:ring-2 focus:outline-none  
//                                 ${errors.mobileNumber ? 'border border-red-500 focus:ring-red-500' : 'border border-gray-700 focus:ring-purple-500'}`}
//                         />
//                         {errors.mobileNumber && <span className="text-red-400 text-xs mt-1">{errors.mobileNumber}</span>}
//                     </div>
//
//                     {/* DOB */}
//                     <div className="flex flex-col">
//                         <input
//                             type="date"
//                             name="dateOfBirth"
//                             value={formData.dateOfBirth}
//                             onChange={handleChange}
//                             className={`p-3 rounded bg-gray-800 text-black
//                                 focus:ring-2 focus:outline-none  
//                                 ${errors.dateOfBirth ? 'border border-red-500 focus:ring-red-500' : 'border border-gray-700 focus:ring-purple-500'}`}
//                         />
//                         {errors.dateOfBirth && <span className="text-red-400 text-xs mt-1">{errors.dateOfBirth}</span>}
//                     </div>
//
//                     {/* Gender */}
//                     <div className="flex flex-col">
//                         <select
//                             name="gender"
//                             value={formData.gender}
//                             onChange={handleChange}
//                             className="p-3 rounded bg-gray-800 text-black border border-gray-700 focus:ring-2 focus:ring-purple-500"
//                         >
//                             <option value="">Select Gender</option>
//                             <option>Male</option>
//                             <option>Female</option>
//                             <option>Other</option>
//                         </select>
//                     </div>
//
//                     {/* Role */}
//                     <div className="flex flex-col">
//                         <select
//                             name="role"
//                             value={formData.role}
//                             onChange={handleChange}
//                             className="p-3 rounded bg-gray-800 text-black border border-gray-700 focus:ring-2 focus:ring-purple-500"
//                         >
//                             <option value="">Select Role</option>
//                             <option>CUSTOMER</option>
//                             <option>MERCHANT</option>
//                         </select>
//                     </div>
//
//                     {/* About */}
//                     <div className="flex flex-col md:col-span-2">
//                         <textarea
//                             name="about"
//                             placeholder="About (optional)"
//                             value={formData.about}
//                             onChange={handleChange}
//                             className="p-3 rounded bg-gray-800 text-black border border-gray-700 focus:ring-2 focus:ring-purple-500"
//                             rows="3"
//                         />
//                     </div>
//
//                     {/* Address */}
//                     {['street', 'city', 'state', 'country', 'zipCode'].map(field => (
//                         <div key={field} className="flex flex-col">
//                             <input
//                                 type="text"
//                                 name={field}
//                                 placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//                                 value={formData[field]}
//                                 onChange={handleChange}
//                                 className={`p-3 rounded bg-gray-800 text-black
//                                     focus:ring-2 focus:outline-none  
//                                     ${errors[field] ? 'border border-red-500 focus:ring-red-500' : 'border border-gray-700 focus:ring-purple-500'}`}
//                             />
//                             {errors[field] && <span className="text-red-400 text-xs mt-1">{errors[field]}</span>}
//                         </div>
//                     ))}
//
//                     {/* Submit */}
//                     <button
//                         type="button"
//                         onClick={handleSubmit}
//                         className="bg-gradient-to-r from-purple-600 to-blue-600 text-black py-3 rounded-lg
//                                    hover:scale-105 transition-transform duration-300 shadow-lg md:col-span-2 font-semibold"
//                     >
//                         Register
//                     </button>
//                 </div>
//
//                 <p className="text-center text-sm text-gray-400 mt-4">
//                     Already have an account?{" "}
//                     <Link to="/login" className="text-blue-400 font-semibold hover:underline">
//                         Login
//                     </Link>
//                 </p>
//             </div>
//
//             <AnimatedToast {...toast} />
//         </div>
//     );
// }
//
