// Helper Utilities Module

/**
 * USER EXPERIENCE: Enhanced Error Message Formatter
 * 
 * Converts technical backend error messages into user-friendly text
 * Improves UX by providing clear, actionable feedback
 * 
 * Example Usage:
 *   alert(formatErrorMessage(error.message));
 *   or
 *   alert(formatErrorMessage('Invalid credentials'));
 */
function formatErrorMessage(error) {
    // Extract error message from various formats
    let errorMessage = '';
    
    if (typeof error === 'string') {
        errorMessage = error;
    } else if (error?.message) {
        errorMessage = error.message;
    } else if (error?.error) {
        errorMessage = error.error;
    } else {
        return 'Something went wrong. Please try again.';
    }
    
    // Common error patterns and user-friendly alternatives
    const errorMappings = {
        'Invalid credentials': 'The Student ID or password is incorrect. Please try again.',
        'Access token required': 'Your session has expired. Please log in again.',
        'Invalid or expired token': 'Your session has expired. Please log in again.',
        'Student ID already exists': 'This Student ID is already registered. Please log in instead.',
        'Password must be at least 6 characters long': 'Password must be at least 6 characters.',
        'Admin access required': 'You need administrator privileges for this action.',
        'Access denied': 'You don\'t have permission to perform this action.',
        'Failed to fetch': 'Unable to connect. Please check your internet connection.',
    };
    
    // Return mapped message or cleaned original
    return errorMappings[errorMessage] || errorMessage || 'An error occurred. Please try again.';
}

/**
 * Format timestamp to readable date/time
 * 
 * Example Usage:
 *   formatDateTime('2025-12-23T10:30:00') → "Dec 23, 2025 at 10:30 AM"
 */
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return date.toLocaleDateString('en-US', options);
}

