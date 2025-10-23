// const API_URL = 'http://localhost:8081/userservice/auth';
//
// export const register = async (userData) => {
//   const response = await fetch(`${API_URL}/register`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(userData),
//   });
//
//   const contentType = response.headers.get("content-type");
//
//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(errorText || 'Registration failed');
//   }
//
//   if (contentType && contentType.includes("application/json")) {
//     return response.json();
//   } else {
//     return response.text();
//   }
// };
//
// export const login = async ({ email, password }) => {
//     const response = await fetch(`${API_URL}/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//     });
//
//     const isJson = response.headers.get('content-type')?.includes('application/json');
//     const data = isJson ? await response.json() : await response.text();
//
//     if (!response.ok) {
//         const msg = isJson ? (data?.message || 'Login failed') : (data || 'Login failed');
//         throw new Error(msg);
//     }
//
//     const jwt = isJson ? data?.jwtToken : null;
//     if (!jwt) throw new Error('No token received from server');
//
//     // Clear any stale tokens/roles from both storages
//     ['token', 'jwt', 'jwtToken'].forEach((k) => {
//         localStorage.removeItem(k);
//         sessionStorage.removeItem(k);
//     });
//     localStorage.removeItem('role');
//
//     // Store fresh token and role
//     localStorage.setItem('token', jwt);
//     if (isJson && data?.role) localStorage.setItem('role', data.role);
//
//     return data;
// };

const API_URL = 'http://localhost:8081/userservice/auth';

export const register = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    const contentType = response.headers.get("content-type");
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
    }
    
    // Send welcome email notification
    try {
        const params = new URLSearchParams();
        params.append('email', userData.emailId);
        params.append('userName', userData.fullName);
        
        await fetch(`http://localhost:8081/notificationservice/notification/welcome?${params.toString()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.warn('Failed to send welcome email:', error);
    }
    
    if (contentType && contentType.includes("application/json")) return response.json();
    return response.text();
};

export const login = async ({ email, password }) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const msg = isJson ? (data?.message || 'Login failed') : (data || 'Login failed');
        throw new Error(msg);
    }

    const jwt = isJson ? data?.jwtToken : null;
    if (!jwt) throw new Error('No token received from server');

    ['token', 'jwt', 'jwtToken'].forEach((k) => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
    });
    localStorage.removeItem('role');

    localStorage.setItem('token', jwt);
    if (isJson && data?.role) localStorage.setItem('role', data.role);

    // Send login notification
    try {
        const loginData = {
            email: email,
            loginTime: new Date().toLocaleString(),
            ipAddress: 'Unknown', // You can get this from a service
            userAgent: navigator.userAgent,
            location: 'Unknown' // You can get this from a geolocation service
        };
        
        const params = new URLSearchParams();
        params.append('email', email);
        
        await fetch(`http://localhost:8081/notificationservice/notification/login-notification?${params.toString()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });
    } catch (error) {
        console.warn('Failed to send login notification:', error);
    }

    return data;
};

// Forgot password — sends emailId as query param to match controller signature
export const forgotPassword = async (emailId) => {
    const res = await fetch(`${API_URL}/forgetPassword?emailId=${encodeURIComponent(emailId)}`, {
        method: "POST",
    });
    if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to request password reset");
    }
    return res.text().catch(() => "OK");
};
