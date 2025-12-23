// API Communication Module

// Function to make authenticated API calls
async function makeAuthenticatedRequest(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401 || response.status === 403) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        authToken = null;
        currentUser = null;
        showAuthForms();
        throw new Error('Authentication failed');
    }

    return response;
}
