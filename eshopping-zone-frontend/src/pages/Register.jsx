import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { sendWelcomeEmail } from '../api/notification';
import AnimatedToast from '../components/AnimatedToast';
import LoadingScreen from '../components/LoadingScreen';

export default function RegistrationForm() {
    const navigate = useNavigate();
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
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please fix the errors before submitting', 'error');
            return;
        }

        setLoading(true);
        try {
            // Convert date from yyyy-mm-dd to dd/mm/yyyy
            const convertDate = (dateStr) => {
                if (!dateStr) return '';
                const [year, month, day] = dateStr.split('-');
                return `${day}/${month}/${year}`;
            };

            // Prepare data for API
            const userData = {
                fullName: formData.fullName,
                emailId: formData.emailId,
                mobileNumber: formData.mobileNumber,
                dateOfBirth: convertDate(formData.dateOfBirth),
                gender: formData.gender,
                role: formData.role,
                about: formData.about || '',
                image: formData.image || '',
                address: [{
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    zipCode: formData.zipCode
                }]
            };

            console.log('Sending registration data:', userData);
            await register(userData);
            
            // Send welcome email
            try {
                await sendWelcomeEmail(userData.emailId, userData.fullName);
            } catch (error) {
                console.warn('Failed to send welcome email:', error);
            }
            
            showToast('Registration successful! Please login.', 'success');
            
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            console.error('Registration error:', error);
            showToast(error?.message || 'Registration failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const inputClassName = (fieldName) => `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors bg-white text-gray-900 placeholder-gray-500 ${
        errors[fieldName] 
            ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
    }`;

    const selectClassName = (fieldName) => `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors bg-white text-gray-900 ${
        errors[fieldName] 
            ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
    }`;

    const dateClassName = (fieldName) => `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors bg-white text-gray-900 ${
        errors[fieldName] 
            ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
    }`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="px-8 py-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Create Your Account
                            </h2>
                            <p className="text-gray-600">Join us today and start your shopping journey</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={inputClassName('fullName')}
                                        required
                                    />
                                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        name="emailId"
                                        placeholder="Enter your email address"
                                        value={formData.emailId}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={inputClassName('emailId')}
                                        required
                                    />
                                    {errors.emailId && <p className="text-red-500 text-sm">{errors.emailId}</p>}
                                </div>

                                {/* Mobile Number */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobileNumber"
                                        placeholder="Enter your mobile number"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={inputClassName('mobileNumber')}
                                        required
                                    />
                                    {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
                                </div>

                                {/* Date of Birth */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={dateClassName('dateOfBirth')}
                                        required
                                    />
                                    {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
                                </div>

                                {/* Gender */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={selectClassName('gender')}
                                        required
                                    >
                                        <option value="" className="text-gray-500">Select Gender</option>
                                        <option value="Male" className="text-gray-900">Male</option>
                                        <option value="Female" className="text-gray-900">Female</option>
                                        <option value="Other" className="text-gray-900">Other</option>
                                    </select>
                                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                                </div>

                                {/* Role */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Account Type</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={selectClassName('role')}
                                        required
                                    >
                                        <option value="" className="text-gray-500">Select Account Type</option>
                                        <option value="CUSTOMER" className="text-gray-900">Customer</option>
                                        <option value="MERCHANT" className="text-gray-900">Merchant</option>
                                    </select>
                                    {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                                </div>
                            </div>

                            {/* Profile Image URL */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Profile Image URL (Optional)</label>
                                <input
                                    type="url"
                                    name="image"
                                    placeholder="Enter profile image URL"
                                    value={formData.image}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={inputClassName('image')}
                                />
                                {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                            </div>

                            {/* About */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">About (Optional)</label>
                                <textarea
                                    name="about"
                                    placeholder="Tell us about yourself"
                                    value={formData.about}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-900 placeholder-gray-500"
                                    rows="3"
                                />
                            </div>

                            {/* Address Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Address Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Street */}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                        <input
                                            type="text"
                                            name="street"
                                            placeholder="Enter your street address"
                                            value={formData.street}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClassName('street')}
                                            required
                                        />
                                        {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
                                    </div>

                                    {/* City */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Enter your city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClassName('city')}
                                            required
                                        />
                                        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                                    </div>

                                    {/* State */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="Enter your state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClassName('state')}
                                            required
                                        />
                                        {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                                    </div>

                                    {/* Country */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            placeholder="Enter your country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClassName('country')}
                                            required
                                        />
                                        {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                                    </div>

                                    {/* Zip Code */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            placeholder="Enter your zip code"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClassName('zipCode')}
                                            required
                                        />
                                        {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                                    loading 
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                                }`}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                        
                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <LoadingScreen show={loading} message="Creating your account" />
            <AnimatedToast message={toast.message} type={toast.type} show={toast.visible} />
        </div>
    );
}