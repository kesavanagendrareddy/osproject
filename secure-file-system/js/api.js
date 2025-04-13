// API helper functions
const API_BASE_URL = '/api';

async function fetchData(url, options = {}) {
    try {
        // Add default headers
        options.headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add authorization token if available
        const token = localStorage.getItem('token');
        if (token) {
            options.headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${url}`, options);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Network response was not ok');
        }

        return response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

async function verifyTwoFactor(code) {
    return fetchData('/verify-2fa', {
        method: 'POST',
        body: JSON.stringify({ code })
    });
}

// Export API functions
window.api = {
    fetchData,
    verifyTwoFactor
};
