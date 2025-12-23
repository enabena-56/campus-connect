// auth.js - Authentication Middleware
const jwt = require('jsonwebtoken');

// JWT SECRET KEY CONFIGURATION
// In production: MUST use environment variable (process.env.JWT_SECRET)
// Never commit secrets to version control (use .env file with .gitignore)
// This secret key is used to sign and verify JWT tokens
// If compromised, all tokens can be forged - treat as highly sensitive
// Reference: OWASP Authentication Cheat Sheet - Secure secret management
const JWT_SECRET = process.env.JWT_SECRET || 'campus-info-secret-key-2025';
const JWT_EXPIRES_IN = '24h';

// Generate JWT token
function generateToken(user) {
    // JWT TOKEN GENERATION: Create signed token with user claims
    // Payload contains: user ID, student ID, role, and name (no sensitive data)
    // Token is signed using JWT_SECRET to prevent tampering
    // expiresIn: Token automatically becomes invalid after 24 hours
    // Reduces risk window if token is stolen or leaked
    // Reference: RFC 7519 - JSON Web Token (JWT) standard
    return jwt.sign(
        { 
            id: user.id, 
            student_id: user.student_id, 
            role: user.role,
            name: user.name
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

// Verify JWT token middleware
function authenticateToken(req, res, next) {
    // AUTHORIZATION HEADER EXTRACTION
    // Standard format: "Authorization: Bearer <token>"
    // authHeader will be null if header is missing
    const authHeader = req.headers['authorization'];
    // Split by space and take second part (the token after "Bearer")
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // TOKEN PRESENCE VALIDATION
    // 401 Unauthorized: Request lacks valid authentication credentials
    // Reference: RFC 7235 - HTTP Authentication framework
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    // TOKEN VERIFICATION AND DECODING
    // Verifies token signature using JWT_SECRET
    // Checks if token has expired (based on 'exp' claim)
    // Decodes payload if valid, returns error if invalid/tampered/expired
    // Reference: jsonwebtoken library documentation
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // 403 Forbidden: Server understands request but refuses authorization
            // Token exists but is invalid (tampered with or expired)
            // Reference: HTTP status codes - 403 vs 401 distinction
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        // Attach decoded user information to request object
        // Makes user data available to subsequent middleware and route handlers
        // Contains: id, student_id, role, name from token payload
        req.user = user;
        next(); // Pass control to next middleware/route handler
    });
}

// Admin role check middleware
function requireAdmin(req, res, next) {
    // ROLE-BASED ACCESS CONTROL (RBAC): Verify admin privileges
    // Assumes authenticateToken has already run and populated req.user
    // Checks user's role claim from decoded JWT token
    // Enforces least privilege principle - only admins can access certain endpoints
    // Used for: CRUD operations, booking approvals, user management
    // Reference: OWASP Authorization Cheat Sheet - Implement RBAC properly
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next(); // User is admin, allow access to protected route
}

// Student or Admin role check middleware
function requireAuth(req, res, next) {
    // AUTHENTICATION & ROLE VALIDATION: Verify user is logged in with valid role
    // Double-checks that req.user exists and has an authorized role
    // Prevents access if token is valid but role is invalid/tampered
    // Defense in depth: Additional validation layer after token verification
    // Reference: Security best practices - Never trust client-provided data alone
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'student')) {
        return res.status(403).json({ error: 'Valid user access required' });
    }
    next(); // User has valid authentication and authorized role
}

module.exports = {
    generateToken,
    authenticateToken,
    requireAdmin,
    requireAuth,
    JWT_SECRET
};