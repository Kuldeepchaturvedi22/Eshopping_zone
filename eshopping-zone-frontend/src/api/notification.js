const NOTIFICATION_BASE_URL = "http://localhost:8081/notificationservice/notification";

// Helper function to create URL with query parameters
const createNotificationUrl = (endpoint, email, additionalParams = {}) => {
    const params = new URLSearchParams();
    params.append('email', email);
    
    Object.entries(additionalParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            params.append(key, value);
        }
    });
    
    return `${NOTIFICATION_BASE_URL}${endpoint}?${params.toString()}`;
};

// Send welcome email after registration
export const sendWelcomeEmail = async (email, userName) => {
    try {
        const url = createNotificationUrl('/welcome', email, { userName });
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.ok;
    } catch (error) {
        console.warn('Failed to send welcome email:', error);
        return false;
    }
};

// Send login notification
export const sendLoginNotification = async (email, loginData = {}) => {
    try {
        const defaultLoginData = {
            email,
            loginTime: new Date().toLocaleString(),
            ipAddress: 'Unknown',
            userAgent: navigator.userAgent,
            location: 'Unknown',
            ...loginData
        };
        
        const url = createNotificationUrl('/login-notification', email);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(defaultLoginData)
        });
        return response.ok;
    } catch (error) {
        console.warn('Failed to send login notification:', error);
        return false;
    }
};

// Send order confirmation email
export const sendOrderConfirmation = async (email, orderData) => {
    try {
        const url = createNotificationUrl('/order-confirmation', email);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        return response.ok;
    } catch (error) {
        console.warn('Failed to send order confirmation email:', error);
        return false;
    }
};

// Send payment success email with PDF receipt
export const sendPaymentSuccessEmail = async (email, orderData) => {
    try {
        const url = createNotificationUrl('/payment-success', email);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        return response.ok;
    } catch (error) {
        console.warn('Failed to send payment success email:', error);
        return false;
    }
};

// Send order status update email
export const sendOrderStatusUpdate = async (email, orderData) => {
    try {
        const url = createNotificationUrl('/order-status-update', email);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        return response.ok;
    } catch (error) {
        console.warn('Failed to send order status update email:', error);
        return false;
    }
};

// Send merchant notification for new orders
export const sendMerchantOrderNotification = async (merchantEmail, orderData) => {
    try {
        const url = createNotificationUrl('/merchant-order-notification', merchantEmail);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        return response.ok;
    } catch (error) {
        console.warn('Failed to send merchant order notification:', error);
        return false;
    }
};

// Send custom email notification
export const sendCustomEmail = async (recipient, subject, message) => {
    try {
        const response = await fetch(`${NOTIFICATION_BASE_URL}/sendMail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipient,
                subject,
                msgBody: message
            })
        });
        return response.ok;
    } catch (error) {
        console.warn('Failed to send custom email:', error);
        return false;
    }
};

// Alias for backward compatibility
export const sendMail = sendCustomEmail;