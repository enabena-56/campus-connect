// Configuration and State Management

// API Configuration
const API_BASE = '/api';

// Authentication State
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Filter State
let currentDeptFilter = 'all';
let currentLabFilter = 'all';
let currentBusTimeFilter = 'all';
let currentCategoryFilter = 'all';
let currentAvailabilityFilter = 'all';

// Cache State
let currentClassrooms = [];
let currentLabs = [];
let currentBuses = [];
let currentMenuItems = [];
let currentCafeteriaInfo = {};
