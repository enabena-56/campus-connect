# 🎓 Campus Navigator - University Information System

A comprehensive web-based campus management system built with Node.js, Express, and SQLite. This system provides students and administrators with easy access to campus resources, schedules, and facilities information.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Test Credentials](#test-credentials)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [User Roles](#user-roles)
- [Contributing](#contributing)

---

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration & Login** - Students can create accounts with student ID
- **Role-Based Access Control (RBAC)** - Separate permissions for admins and students
- **JWT Authentication** - Secure token-based authentication with 24-hour expiration
- **Password Security** - Bcrypt hashing with salt rounds (10)
- **Protected Routes** - All endpoints require authentication
- **Input Validation** - Comprehensive server-side validation

### 🏫 Classroom Management
- View all classrooms with filtering by department
- Search functionality for quick access
- Display classroom capacity and location details
- **Admin Only:** Add, edit, and delete classrooms

### 🔬 Laboratory Management
- Browse all computer labs and specialized labs
- View lab equipment and instruments
- Check projector availability and computer counts
- Operating hours display

### 🚌 Bus Routes & Transportation
- Complete bus route information
- Stop-by-stop route details
- Departure times and schedules
- Search for specific routes or stops
- **Admin Only:** Manage bus routes and stops

### 🍽️ Cafeteria Information
- Browse complete menu with categories (Food, Snacks, Drinks)
- View prices and availability status
- Filter by category and availability
- Cafeteria contact information and hours
- **Admin Only:** Update menu items and cafeteria info

### 📅 Weekly Schedule System
- **View weekly class schedules** for each classroom and lab
- Tab-based navigation (Monday - Sunday)
- Display subject, course code, instructor, and time slots
- Schedule icon (📅) on each classroom/lab card
- Modal popup with organized weekly view
- **Admin Only:** Add, edit, and delete schedule entries

### 📝 Booking Request System (NEW!)
- **Request special program bookings** for classrooms and labs
- Submit booking requests with:
  - Program name
  - Date and time range
  - Expected participant count
  - Detailed description
- **View approved bookings** - All users can see approved special programs
- Prevents double-booking by showing upcoming reserved dates
- **Student Features:**
  - Submit booking requests
  - View own request status (pending/approved/rejected)
  - Cancel pending requests
  - See admin notes on decisions
- **Admin Features:**
  - Review all booking requests with filters (pending/approved/rejected)
  - Approve or reject requests with notes
  - Manage special program bookings

### 🎨 Modern UI/UX
- Mint gradient background design
- Responsive layout that works on all devices
- Smooth animations and transitions
- Purple-themed schedule modals
- Blue-themed bus information cards
- Color-coded status badges
- Intuitive navigation with tab system

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** (v5.1.0) - Web application framework
- **SQLite3** (v5.1.7) - Embedded database
- **bcryptjs** (v2.4.3) - Password hashing
- **jsonwebtoken** (v9.0.2) - JWT authentication
- **cors** - Cross-origin resource sharing

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **HTML5 & CSS3** - Modern web standards
- **Fetch API** - Asynchronous HTTP requests

### Database
- **SQLite** - Lightweight, file-based relational database
- Zero configuration required
- Perfect for small to medium-sized applications

---

## 📥 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git (for cloning the repository)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd campus-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will install:
   - express (5.1.0)
   - sqlite3 (5.1.7)
   - bcryptjs (2.4.3)
   - jsonwebtoken (9.0.2)
   - cors (2.8.5)

3. **Database Setup**
   - Database auto-creates on first run
   - Sample data (classrooms, labs, buses, cafeteria) automatically inserted
   - Default admin account created

4. **Start the server**
   ```bash
   npm start
   ```
   Or:
   ```bash
   node server.js
   ```

5. **Access the application**
   ```
   Open your browser and navigate to: http://localhost:3000
   ```

The database file (`campus_info.db`) will be created automatically in the project root directory.

---

## 🔑 Test Credentials

### Admin Account
```
Student ID: admin
Password: admin123
```

### Test Student Account
You can create your own student account through the Sign Up page, or use these test accounts if pre-loaded:

```
Student ID: 2021001
Password: password123

Student ID: 2021002
Password: password123
```

⚠️ **Important:** Change the default admin password after first login in a production environment!

---

## 📁 Project Structure

```
campus-connect/
├── public/                      # Frontend files
│   ├── index.html              # Main HTML file
│   ├── buses.html              # Bus routes page
│   ├── cafeteria.html          # Cafeteria menu page
│   ├── classrooms.html         # Classrooms listing page
│   ├── labs.html               # Labs listing page
│   ├── styles.css              # Global styles (2382 lines)
│   ├── images/                 # Image assets
│   └── js/                     # Modular JavaScript files
│       ├── config.js           # API config, auth state
│       ├── api.js              # API request handlers
│       ├── auth.js             # Authentication logic
│       ├── navigation.js       # Navigation handlers
│       ├── home.js             # Homepage logic
│       ├── loaders.js          # Data loading functions
│       ├── renderers.js        # UI rendering functions
│       ├── utils.js            # Utility functions
│       ├── filters.js          # Search & filter logic
│       ├── admin.js            # Admin CRUD operations
│       ├── schedules.js        # Schedule management
│       ├── bookings.js         # Booking request system
│       ├── modals.js           # Modal utilities
│       └── app.js              # App initialization
│
├── auth.js                     # JWT authentication middleware
├── database.js                 # Database class (999 lines)
├── server.js                   # Express server (653 lines)
├── package.json                # Project dependencies
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
└── campus_info.db             # SQLite database (auto-generated)
```

### Code Organization

The frontend JavaScript is modularized into 14 files for better maintainability:

1. **config.js** - Configuration constants
2. **api.js** - Centralized API communication
3. **auth.js** - Login/signup/logout logic
4. **navigation.js** - Tab and page navigation
5. **home.js** - Homepage specific functions
6. **loaders.js** - Data fetching for all resources
7. **renderers.js** - UI rendering functions
8. **utils.js** - Helper utilities
9. **filters.js** - Search and filter functionality
10. **admin.js** - Admin CRUD operations (275 lines)
11. **schedules.js** - Schedule viewing and management (250 lines)
12. **bookings.js** - Booking request workflow (270 lines)
13. **modals.js** - Modal dialog utilities
14. **app.js** - Application initialization

All files maintain global scope for inline `onclick` handler compatibility.

---
```
Student ID: admin
Password: admin123
```
⚠️ **Important:** Change the default admin password after first login!

---

## 🚀 Usage

### For Students

1. **Register an Account**
   - Click "Sign Up" on the login page
   - Enter your student ID, name, and password
   - Login with your credentials

2. **Browse Campus Resources**
   - View classrooms, labs, bus routes, and cafeteria menu
   - Use search and filter options to find specific resources

3. **Check Schedules**
   - Click the 📅 icon on any classroom or lab card
   - View weekly class schedules organized by day
   - See approved special program bookings

4. **Request Bookings**
   - Open a classroom/lab schedule
   - Click "📝 Request Booking"
   - Fill in program details and submit
   - Track your request status in "📋 My Requests"

### For Administrators

All student features, plus:

1. **Manage Resources**
   - Add, edit, or delete classrooms, labs, and bus routes
   - Update cafeteria menu and information

2. **Manage Schedules**
   - Add class schedules to the weekly routine
   - Edit or delete existing schedule entries
   - Organize schedules by day of the week

3. **Review Booking Requests**
   - View all booking requests from students
   - Filter by status (pending/approved/rejected)
   - Approve or reject requests with admin notes
   - Manage special program bookings

---

## 🗄️ Database Schema

### Tables

#### `users`
- **id** - Primary key
- **student_id** - Unique identifier (username)
- **name** - Full name
- **password** - Hashed password
- **role** - 'admin' or 'student'
- **created_at**, **updated_at** - Timestamps

#### `classrooms`
- **id** - Primary key
- **room** - Room number (unique)
- **dept** - Department name
- **floor** - Floor location
- **capacity** - Seating capacity
- **created_at**, **updated_at** - Timestamps

#### `labs`
- **id** - Primary key
- **name** - Lab name
- **dept** - Department
- **location** - Physical location
- **computers** - Number of computers
- **projector** - 'Yes' or 'No'
- **instruments** - Available equipment
- **status** - 'open' or 'closed' (kept in DB, removed from UI)
- **hours** - Operating hours
- **created_at**, **updated_at** - Timestamps

#### `buses`
- **id** - Primary key
- **number** - Bus number (unique)
- **time** - Departure time
- **route** - Route description
- **created_at**, **updated_at** - Timestamps

#### `bus_stops`
- **id** - Primary key
- **bus_id** - Foreign key to buses
- **stop_name** - Stop name
- **stop_order** - Order in route

#### `cafeteria_menu`
- **id** - Primary key
- **name** - Item name
- **description** - Item description
- **price** - Price (decimal)
- **category** - 'food', 'snacks', or 'drinks'
- **availability** - 'available' or 'limited'
- **created_at**, **updated_at** - Timestamps

#### `cafeteria_info`
- **id** - Primary key
- **location** - Cafeteria location
- **contact** - Contact number
- **hours** - Operating hours
- **created_at**, **updated_at** - Timestamps

#### `schedules`
- **id** - Primary key
- **resource_type** - 'classroom' or 'lab'
- **resource_id** - ID of classroom/lab
- **day_of_week** - 'Monday' to 'Sunday'
- **start_time** - Class start time
- **end_time** - Class end time
- **subject** - Subject/course name
- **instructor** - Teacher name (optional)
- **course_code** - Course code (optional)
- **created_at**, **updated_at** - Timestamps

#### `booking_requests`
- **id** - Primary key
- **user_id** - Foreign key to users
- **resource_type** - 'classroom' or 'lab'
- **resource_id** - ID of classroom/lab
- **program_name** - Name of special program
- **date** - Booking date
- **start_time** - Start time
- **end_time** - End time
- **participant_count** - Expected participants (optional)
- **description** - Program description (optional)
- **status** - 'pending', 'approved', or 'rejected'
- **admin_notes** - Admin's decision notes (optional)
- **created_at**, **updated_at** - Timestamps

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new student account
- `POST /api/auth/signin` - Login (admin/student)
- `POST /api/auth/signout` - Logout
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/users` - Get all users (admin only)

### Classrooms
- `GET /api/classrooms` - Get all classrooms (with filters)
- `GET /api/classrooms/:id` - Get specific classroom
- `POST /api/classrooms` - Add classroom (admin only)
- `PUT /api/classrooms/:id` - Update classroom (admin only)
- `DELETE /api/classrooms/:id` - Delete classroom (admin only)

### Labs
- `GET /api/labs` - Get all labs (with filters)
- `PATCH /api/labs/:id/status` - Update lab status (admin only)

### Buses
- `GET /api/buses` - Get all bus routes (with stops)
- `POST /api/buses` - Add bus route (admin only)
- `PUT /api/buses/:id` - Update bus route (admin only)
- `DELETE /api/buses/:id` - Delete bus route (admin only)

### Cafeteria
- `GET /api/cafeteria/menu` - Get menu items (with filters)
- `GET /api/cafeteria/menu/:id` - Get specific menu item
- `POST /api/cafeteria/menu` - Add menu item (admin only)
- `PUT /api/cafeteria/menu/:id` - Update menu item (admin only)
- `DELETE /api/cafeteria/menu/:id` - Delete menu item (admin only)
- `GET /api/cafeteria/info` - Get cafeteria info
- `PUT /api/cafeteria/info` - Update cafeteria info (admin only)

### Schedules
- `GET /api/schedules/:type/:id` - Get schedules for resource
- `POST /api/schedules` - Create schedule entry (admin only)
- `PUT /api/schedules/:id` - Update schedule entry (admin only)
- `DELETE /api/schedules/:id` - Delete schedule entry (admin only)

### Booking Requests
- `POST /api/booking-requests` - Create booking request (all users)
- `GET /api/booking-requests` - Get booking requests (filtered by role)
- `GET /api/booking-requests/:id` - Get specific booking request
- `PUT /api/booking-requests/:id` - Update request status (admin only)
- `DELETE /api/booking-requests/:id` - Delete booking request

---

## 👥 User Roles

### Student Role
- ✅ View all campus resources
- ✅ Search and filter information
- ✅ View weekly schedules
- ✅ See approved special program bookings
- ✅ Submit booking requests
- ✅ Track own booking request status
- ✅ Cancel pending requests
- ❌ Cannot modify resources or schedules
- ❌ Cannot approve/reject booking requests

### Admin Role
- ✅ All student permissions
- ✅ Add, edit, delete classrooms and labs
- ✅ Manage bus routes and stops
- ✅ Update cafeteria menu and info
- ✅ Create and manage weekly schedules
- ✅ Review all booking requests
- ✅ Approve/reject booking requests with notes
- ✅ View all users

---

## � Security Features

This project implements multiple layers of security following industry best practices:

### Input Validation
- **Server-side validation** for all API endpoints
- Required field validation (prevents incomplete requests)
- Password strength requirements (minimum 6 characters)
- Status transition validation (only valid state changes allowed)
- SQL injection prevention using parameterized queries

### Authentication & Authorization
- **JWT (JSON Web Token)** authentication with 24-hour expiration
- **Bcrypt password hashing** with salt rounds (10)
- Constant-time password comparison (prevents timing attacks)
- Token-based session management (stateless authentication)
- Role-based access control (RBAC) for admin endpoints

### Data Protection
- Passwords stored as hashed values (never plain text)
- Generic error messages to prevent user enumeration
- Audit trail for booking approvals (reviewed_by, reviewed_at)
- Ownership verification for student actions

### Best Practices Applied
- OWASP Input Validation Cheat Sheet
- OWASP Authentication Cheat Sheet
- OWASP Authorization Cheat Sheet
- NIST SP 800-63B Digital Identity Guidelines
- Principle of Least Privilege
- Defense in Depth strategy

**Note:** Comprehensive validation comments are included in the source code for educational purposes, demonstrating understanding of security principles.

---

## 🎓 Academic Context

This project is a **university course assignment** demonstrating:
- Full-stack web development skills
- RESTful API design and implementation
- Database design and normalization
- Authentication and authorization patterns
- Security best practices
- Code organization and modularization
- Modern JavaScript ES6+ features

### Learning Outcomes Demonstrated
- ✅ Backend development with Node.js and Express
- ✅ Database management with SQLite
- ✅ JWT authentication implementation
- ✅ Password security with bcrypt
- ✅ RESTful API design
- ✅ Frontend development with vanilla JavaScript
- ✅ Responsive UI design
- ✅ Code modularization (14 JS modules)
- ✅ Input validation and security
- ✅ Version control with Git

---

## 🤝 Contributing

This is an academic project. For collaboration:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is created for educational purposes as part of a university course assignment.

---

## 👨‍💻 Author

**Your Name**  
University Course Assignment - Web Development  
Year: 2025

---

## 📧 Support

For questions or issues, please contact:
- Email: your.email@university.edu
- GitHub Issues: [Create an issue](https://github.com/yourusername/campus-connect/issues)

---

## 🙏 Acknowledgments

- Course Instructor: [Instructor Name]
- University: [University Name]
- Department: Computer Science
- Course: Web Application Development

---

**⭐ If you found this project helpful, please consider giving it a star!**
- Admins can approve/reject requests with notes
- **Public visibility of approved bookings:**
  - All users see approved special programs when viewing schedules
  - Prevents double-booking
  - Displays upcoming reserved dates prominently
- Filter system for request management (pending/approved/rejected)
- Color-coded status badges
- **Status:** Fully functional and integrated

### Design Improvements
- ✅ Fullscreen layout with proper spacing
- ✅ Mint gradient background (#a3d6ea to #8bc6ee)
- ✅ Dark filter buttons for better contrast
- ✅ Blue bus information cards
- ✅ Purple-themed schedule modals
- ✅ Transparent calendar icon buttons
- ✅ Cleaner lab cards without status clutter
- ✅ Blue gradient section for approved bookings display

#### ✅ Homepage Landing Page (Active - New Addition)
- Professional landing page with hero section
- Feature showcase with icons and descriptions
- Campus statistics display
- Student vs Admin role comparison
- Call-to-action buttons for Sign In/Sign Up
- Responsive design with animations
- Floating icon backgrounds
- Complete footer with links
- **Status:** Fully functional - Now displays at root URL (http://localhost:3000)

---

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file for custom configuration:
```env
PORT=3000
JWT_SECRET=your-secret-key-here
DB_PATH=./campus_info.db
```

### Default Configuration
- **Port:** 3000
- **Database:** SQLite (campus_info.db)
- **JWT Expiry:** 7 days
- **CORS:** Enabled for all origins

---

## 🐛 Troubleshooting

### Database Locked Error
If you see `SQLITE_BUSY: database is locked`:
- Close any DB browser applications
- Stop the Node.js server
- Run the cleanup script: `node cleanup-database.js`
- Restart the server

### Server Won't Start
- Check if port 3000 is already in use
- Verify Node.js installation: `node --version`
- Ensure all dependencies are installed: `npm install`

### Authentication Issues
- Clear browser cache and cookies
- Check JWT token in localStorage
- Verify user credentials
- Ensure server is running

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Kaniz Fatema**
- GitHub: [@kaniz504](https://github.com/kaniz504)

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for ease of use and accessibility
- Focused on campus community needs

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact the development team
- Submit a pull request

---

**Last Updated:** November 6, 2025
