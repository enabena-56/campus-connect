// Authentication Module

// Check authentication status
async function checkAuthStatus() {
            // Temporary bypass for debugging
            console.log('Checking auth status...');
            console.log('Current token:', authToken);
            
            if (!authToken) {
                console.log('No token found, loading home page');
                document.querySelector('.nav-tabs').style.display = 'flex';
                document.getElementById('content-area').style.display = 'block';
                document.getElementById('auth-section').style.display = 'none';
                loadHome();
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                console.log('Auth response status:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    currentUser = data.user;
                    console.log('Auth successful, user:', currentUser);
                    showMainApp();
                } else {
                    // Token is invalid
                    console.log('Token invalid, clearing storage');
                    localStorage.removeItem('authToken');
                    authToken = null;
                    document.querySelector('.nav-tabs').style.display = 'flex';
                    document.getElementById('content-area').style.display = 'block';
                    document.getElementById('auth-section').style.display = 'none';
                    loadHome();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                document.querySelector('.nav-tabs').style.display = 'flex';
                document.getElementById('content-area').style.display = 'block';
                document.getElementById('auth-section').style.display = 'none';
                loadHome();
            }
        }

        // Show authentication forms
        function showAuthForms() {
            document.getElementById('auth-section').innerHTML = `
                <div class="auth-container">
                    <button onclick="showSigninForm()" class="auth-toggle-btn active" id="signin-tab">Sign In</button>
                    <button onclick="showSignupForm()" class="auth-toggle-btn" id="signup-tab">Sign Up</button>
                    
                    <div id="signin-form" class="auth-form">
                        <h3>Sign In</h3>
                        <input type="text" id="signin-student-id" placeholder="Student ID (or 'admin' for admin access)" required>
                        <input type="password" id="signin-password" placeholder="Password" required>
                        <button onclick="signin()">Sign In</button>
                    </div>
                    
                    <div id="signup-form" class="auth-form" style="display: none;">
                        <h3>Student Sign Up</h3>
                        <input type="text" id="signup-student-id" placeholder="Student ID" required>
                        <input type="text" id="signup-name" placeholder="Full Name" required>
                        <input type="password" id="signup-password" placeholder="Password (min 6 characters)" required>
                        <button onclick="signup()">Sign Up</button>
                    </div>
                </div>
            `;
            
            // Hide main content
            document.querySelector('.nav-tabs').style.display = 'none';
            document.getElementById('content-area').style.display = 'none';
        }

        // Show main application
        function showMainApp() {
            document.getElementById('auth-section').style.display = 'flex';
            document.getElementById('auth-section').innerHTML = `
                <div class="user-info">
                    <span class="welcome-message">Welcome, ${currentUser.name}</span>
                    <span class="user-role">(${currentUser.role})</span>
                    <button onclick="signout()" class="signout-btn">Sign Out</button>
                </div>
            `;
            
            // Show main content
            document.querySelector('.nav-tabs').style.display = 'flex';
            document.getElementById('content-area').style.display = 'block';
            
            // Load default tab (home)
            const defaultButton = document.querySelector('.tab-btn.active');
            if (defaultButton) {
                loadTab('home', defaultButton); 
            }
        }

        // Authentication form functions
        function showSigninForm() {
            document.getElementById('signin-form').style.display = 'block';
            document.getElementById('signup-form').style.display = 'none';
            document.getElementById('signin-tab').classList.add('active');
            document.getElementById('signup-tab').classList.remove('active');
        }

        function showSignupForm() {
            document.getElementById('signin-form').style.display = 'none';
            document.getElementById('signup-form').style.display = 'block';
            document.getElementById('signin-tab').classList.remove('active');
            document.getElementById('signup-tab').classList.add('active');
        }

        // Home page auth form toggles
        function showSigninFormHome() {
            const signinForm = document.getElementById('signin-form-home');
            const signupForm = document.getElementById('signup-form-home');
            if (signinForm && signupForm) {
                signinForm.style.display = 'block';
                signupForm.style.display = 'none';
                document.getElementById('signin-tab-home').classList.add('active');
                document.getElementById('signup-tab-home').classList.remove('active');
            }
        }

        function showSignupFormHome() {
            const signinForm = document.getElementById('signin-form-home');
            const signupForm = document.getElementById('signup-form-home');
            if (signinForm && signupForm) {
                signinForm.style.display = 'none';
                signupForm.style.display = 'block';
                document.getElementById('signin-tab-home').classList.remove('active');
                document.getElementById('signup-tab-home').classList.add('active');
            }
        }

        // Sign in function
        async function signin() {
            const student_id = document.getElementById('signin-student-id').value;
            const password = document.getElementById('signin-password').value;

            if (!student_id || !password) {
                alert('Please fill in all fields');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/auth/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ student_id, password })
                });

                const data = await response.json();

                if (response.ok) {
                    authToken = data.token;
                    localStorage.setItem('authToken', authToken);
                    currentUser = data.user;
                    showMainApp();
                } else {
                    alert(data.error || 'Sign in failed');
                }
            } catch (error) {
                console.error('Sign in error:', error);
                alert('Sign in failed. Please try again.');
            }
        }

        // Sign up function
        async function signup() {
            const student_id = document.getElementById('signup-student-id').value;
            const name = document.getElementById('signup-name').value;
            const password = document.getElementById('signup-password').value;

            if (!student_id || !name || !password) {
                alert('Please fill in all fields');
                return;
            }

            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ student_id, name, password })
                });

                const data = await response.json();

                if (response.ok) {
                    authToken = data.token;
                    localStorage.setItem('authToken', authToken);
                    currentUser = data.user;
                    showMainApp();
                } else {
                    alert(data.error || 'Sign up failed');
                }
            } catch (error) {
                console.error('Sign up error:', error);
                alert('Sign up failed. Please try again.');
            }
        }

        // Home page sign in function
        async function signinHome() {
            const student_id = document.getElementById('signin-student-id-home').value;
            const password = document.getElementById('signin-password-home').value;

            if (!student_id || !password) {
                alert('Please fill in all fields');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/auth/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ student_id, password })
                });

                const data = await response.json();

                if (response.ok) {
                    authToken = data.token;
                    localStorage.setItem('authToken', authToken);
                    currentUser = data.user;
                    showMainApp();
                } else {
                    alert(data.error || 'Sign in failed');
                }
            } catch (error) {
                console.error('Sign in error:', error);
                alert('Sign in failed. Please try again.');
            }
        }

        // Home page sign up function
        async function signupHome() {
            const student_id = document.getElementById('signup-student-id-home').value;
            const name = document.getElementById('signup-name-home').value;
            const password = document.getElementById('signup-password-home').value;

            if (!student_id || !name || !password) {
                alert('Please fill in all fields');
                return;
            }

            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ student_id, name, password })
                });

                const data = await response.json();

                if (response.ok) {
                    authToken = data.token;
                    localStorage.setItem('authToken', authToken);
                    currentUser = data.user;
                    showMainApp();
                } else {
                    alert(data.error || 'Sign up failed');
                }
            } catch (error) {
                console.error('Sign up error:', error);
                alert('Sign up failed. Please try again.');
            }
        }

        // Sign out function
        async function signout() {
            try {
                await fetch(`${API_BASE}/auth/signout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
            } catch (error) {
                console.error('Sign out error:', error);
            }

            // Clear local storage and reset state
            localStorage.removeItem('authToken');
            authToken = null;
            currentUser = null;
            document.querySelector('.nav-tabs').style.display = 'flex';
            document.getElementById('content-area').style.display = 'block';
            document.getElementById('auth-section').style.display = 'none';
            loadHome();
        }
