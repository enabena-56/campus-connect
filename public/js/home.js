// Home Page and UI Module

// Function to load home page
function loadHome() {
    const contentArea = document.getElementById('content-area');
    
    // Show login form if not authenticated
    if (!authToken || !currentUser) {
        contentArea.innerHTML = `
            <div class="home-page login-home">
                <div class="login-container">
                    <h1>Campus Navigator</h1>
                    <p class="subtitle">University Information System</p>
                    
                    <div class="auth-container-home">
                        <button onclick="showSigninFormHome()" class="auth-toggle-btn active" id="signin-tab-home">Sign In</button>
                        <button onclick="showSignupFormHome()" class="auth-toggle-btn" id="signup-tab-home">Sign Up</button>
                        
                        <div id="signin-form-home" class="auth-form-home">
                            <input type="text" id="signin-student-id-home" placeholder="Student ID (or 'admin' for admin access)" required>
                            <input type="password" id="signin-password-home" placeholder="Password" required>
                            <button onclick="signinHome()">Sign In</button>
                        </div>
                        
                        <div id="signup-form-home" class="auth-form-home" style="display: none;">
                            <input type="text" id="signup-student-id-home" placeholder="Student ID" required>
                            <input type="text" id="signup-name-home" placeholder="Full Name" required>
                            <input type="password" id="signup-password-home" placeholder="Password (min 6 characters)" required>
                            <button onclick="signupHome()">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    // Show home content if authenticated
    contentArea.innerHTML = `
        <div class="home-page">
            <div class="home-container">
                <section class="hero-section">
                    <h2>Welcome to Campus Navigator</h2>
                    <p>Your complete guide to university life</p>
                </section>
                
                <div class="main-content">
                    <section class="home-grid">
                        <div class="home-card" onclick="loadTab('classrooms', document.querySelectorAll('.tab-btn')[1])">
                            <div class="card-icon">📚</div>
                            <h3>Classrooms</h3>
                            <p>Find classrooms by department and floor</p>
                        </div>
                        
                        <div class="home-card" onclick="loadTab('labs', document.querySelectorAll('.tab-btn')[2])">
                            <div class="card-icon">🔬</div>
                            <h3>Labs</h3>
                            <p>Discover available laboratory facilities</p>
                        </div>
                        
                        <div class="home-card" onclick="loadTab('buses', document.querySelectorAll('.tab-btn')[3])">
                            <div class="card-icon">🚌</div>
                            <h3>Bus Schedule</h3>
                            <p>Check bus timings and routes</p>
                        </div>
                        
                        <div class="home-card" onclick="loadTab('cafeteria', document.querySelectorAll('.tab-btn')[4])">
                            <div class="card-icon">🍽️</div>
                            <h3>Cafeteria</h3>
                            <p>View menu and availability</p>
                        </div>
                    </section>
                    
                    <section class="features-section">
                        <h3>Features</h3>
                        <ul>
                            <li>✅ Real-time classroom availability</li>
                            <li>✅ Complete lab information</li>
                            <li>✅ Updated bus schedules</li>
                            <li>✅ Daily cafeteria menu</li>
                            <li>✅ Smart search and filters</li>
                        </ul>
                    </section>
                </div>

                <section class="notice-board">
                    <h3>📢 Notice Board</h3>
                    <div id="notices-list" class="notices-container">
                        <p class="loading-notice">Loading notices...</p>
                    </div>
                </section>
            </div>
            
            <footer class="contact-footer">
                <div class="footer-container">
                    <div class="footer-section">
                        <h4>About Campus Navigator</h4>
                        <p>Your complete guide to university life. Find classrooms, labs, bus schedules, and cafeteria information all in one place.</p>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Classrooms</a></li>
                            <li><a href="#">Labs</a></li>
                            <li><a href="#">Bus Schedule</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Contact Information</h4>
                        <p><strong>Email:</strong> <a href="mailto:support@campus.edu">support@campus.edu</a></p>
                        <p><strong>Phone:</strong> <a href="tel:+1234567890">+1 (234) 567-890</a></p>
                        <p><strong>Address:</strong> University Campus, Main Building</p>
                        <p><strong>Hours:</strong> Mon - Fri: 9:00 AM - 5:00 PM</p>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Follow Us</h4>
                        <div class="social-icons">
                            <a href="https://facebook.com" target="_blank" title="Facebook">f</a>
                            <a href="https://twitter.com" target="_blank" title="Twitter">𝕏</a>
                            <a href="https://instagram.com" target="_blank" title="Instagram">📷</a>
                            <a href="https://linkedin.com" target="_blank" title="LinkedIn">in</a>
                        </div>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>&copy; 2025 Campus Navigator. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    `;
    loadNotices();
}

// Function to load and display notices
async function loadNotices() {
    try {
        const noticesList = document.getElementById('notices-list');
        if (!noticesList) return;
        
        // Check if user is authenticated
        if (!authToken) {
            noticesList.innerHTML = '<p class="no-notices">Sign in to view bookings</p>';
            return;
        }
        
        // Fetch real bookings from API
        const response = await makeAuthenticatedRequest(`${API_BASE}/bookings/notices?limit=10`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const bookings = await response.json();
        
        if (!bookings || bookings.length === 0) {
            noticesList.innerHTML = '<p class="no-notices">No upcoming bookings</p>';
            return;
        }
        
        // Format bookings into notices
        noticesList.innerHTML = bookings.map(booking => {
            // Format date
            const bookingDate = new Date(booking.date);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            let dateStr;
            if (bookingDate.toDateString() === today.toDateString()) {
                dateStr = 'Today';
            } else if (bookingDate.toDateString() === tomorrow.toDateString()) {
                dateStr = 'Tomorrow';
            } else {
                dateStr = bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
            
            const timeStr = booking.start_time.substring(0, 5); // HH:MM format
            
            return `
                <div class="notice-item notice-${booking.resource_type}">
                    <div class="notice-header">
                        <span class="notice-type-badge">${booking.resource_type === 'classroom' ? '📚' : '🔬'}</span>
                        <span class="notice-title">${booking.resource_name || 'Unknown Resource'}</span>
                    </div>
                    <div class="notice-details">
                        <p class="notice-program">🎯 ${booking.program_name}</p>
                        <p class="notice-time">📅 ${dateStr} at ${timeStr}</p>
                        <p class="notice-by">👤 ${booking.booked_by}</p>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading notices:', error);
        const noticesList = document.getElementById('notices-list');
        if (noticesList) {
            noticesList.innerHTML = '<p class="error-notice">Failed to load bookings</p>';
        }
    }
}
