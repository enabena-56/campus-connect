// Renderers Module

function renderClassrooms(classrooms) {
    currentClassrooms = classrooms;
    const contentArea = document.getElementById('content-area');
    
    // Group classrooms by floor
    const floorGroups = {};
    classrooms.forEach(room => {
        if (!floorGroups[room.floor]) {
            floorGroups[room.floor] = [];
        }
        floorGroups[room.floor].push(room);
    });

    const departments = [...new Set(classrooms.map(room => room.dept))];

    const html = `
        <div id="classrooms" class="content-section active">
            <div class="search-box">
                <input type="text" id="classroomSearch" placeholder="Search by room number, department, or floor..." onkeyup="searchClassrooms()">
            </div>

            <div class="filter-buttons">
                <button class="filter-btn active" data-dept="all" onclick="filterDept('all', this)">All Departments</button>
                ${departments.map(dept => `<button class="filter-btn" data-dept="${dept}" onclick="filterDept('${dept}', this)">${dept}</button>`).join('')}
            </div>

            <div class="admin-controls" ${currentUser.role !== 'admin' ? 'style="display: none;"' : ''}>
                <button onclick="showAddClassroomForm()" class="admin-btn">➕ Add Classroom</button>
                <button onclick="refreshClassrooms()" class="refresh-btn">🔄 Refresh</button>
            </div>

            <div id="classroomList">
                ${Object.keys(floorGroups).map(floor => `
                    <div class="floor-section">
                        <div class="floor-header">🏢 ${floor}</div>
                        <div class="room-grid">
                            ${floorGroups[floor].map(room => `
                                <div class="room-card" data-dept="${room.dept}" data-id="${room.id}">
                                    <div class="room-header">
                                        <div class="room-number">Room ${room.room}</div>
                                        <button onclick="viewSchedule('classroom', ${room.id}, 'Room ${room.room}')" class="schedule-icon-btn" title="View Schedule">📅</button>
                                    </div>
                                    <div class="room-dept">${getDeptFullName(room.dept)}</div>
                                    <div class="room-capacity">Capacity: ${room.capacity} students</div>
                                    <div class="room-actions" ${currentUser.role !== 'admin' ? 'style="display: none;"' : ''}>
                                        <button onclick="editClassroom(${room.id})" class="edit-btn">✏️</button>
                                        <button onclick="deleteClassroom(${room.id})" class="delete-btn">🗑️</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    contentArea.innerHTML = html;
}

function renderLabs(labs) {
    currentLabs = labs;
    const contentArea = document.getElementById('content-area');
    
    const html = `
        <div id="labs" class="content-section active">
            <div class="search-box">
                <input type="text" id="labSearch" placeholder="Search labs by name or department..." onkeyup="searchLabs()">
            </div>

            <div class="filter-buttons">
                <button class="filter-btn active" data-status="all" onclick="filterLabStatus('all', this)">All Labs</button>
                <button class="filter-btn" data-status="open" onclick="filterLabStatus('open', this)">Open Only</button>
                <button class="filter-btn" data-status="closed" onclick="filterLabStatus('closed', this)">Closed Only</button>
            </div>

            <div class="admin-controls">
                <button onclick="refreshLabs()" class="refresh-btn">🔄 Refresh</button>
            </div>

            <div id="labList">
                ${labs.map(lab => `
                    <div class="lab-card" data-id="${lab.id}">
                        <div class="lab-header">
                            <div class="lab-name">${lab.name}</div>
                            <button onclick="viewSchedule('lab', ${lab.id}, '${lab.name.replace(/'/g, "\\'")}')" class="schedule-icon-btn" title="View Schedule">📅</button>
                        </div>
                        <div class="lab-info">📍 Location: ${lab.location}</div>
                        <div class="lab-info">💻 ${lab.computers} Computers | 📽️ Projector: ${lab.projector || 'No'}</div>
                        ${lab.instruments && lab.instruments !== 'None' ? `<div class="lab-info">🔧 Instruments: ${lab.instruments}</div>` : ''}
                        <div class="lab-info">🕒 ${lab.hours}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    contentArea.innerHTML = html;
}

function renderBuses(buses) {
    currentBuses = buses;
    const contentArea = document.getElementById('content-area');
    
    const html = `
        <div id="buses" class="content-section active">
            <div class="search-box">
                <input type="text" id="busSearch" placeholder="Search by bus number or destination..." onkeyup="searchBuses()">
            </div>

            <div class="filter-buttons">
                <button class="filter-btn active" data-time="all" onclick="filterBusTime('all', this)">All Times</button>
                <button class="filter-btn" data-time="morning" onclick="filterBusTime('morning', this)">Morning (6AM-12PM)</button>
                <button class="filter-btn" data-time="afternoon" onclick="filterBusTime('afternoon', this)">Afternoon (12PM-6PM)</button>
                <button class="filter-btn" data-time="evening" onclick="filterBusTime('evening', this)">Evening (6PM-12AM)</button>
            </div>

            <div class="admin-controls" ${currentUser.role !== 'admin' ? 'style="display: none;"' : ''}>
                <button onclick="showAddBusForm()" class="admin-btn">➕ Add Bus Route</button>
                <button onclick="refreshBuses()" class="refresh-btn">🔄 Refresh</button>
            </div>

            <div id="busList">
                ${buses.map(bus => `
                    <div class="bus-card" data-id="${bus.id}">
                        <div class="bus-header">
                            <div class="bus-number">🚌 Bus ${bus.number}</div>
                            <div class="bus-time">${bus.time}</div>
                            <div class="bus-actions" ${currentUser.role !== 'admin' ? 'style="display: none;"' : ''}>
                                <button onclick="editBus(${bus.id})" class="edit-btn">✏️</button>
                                <button onclick="deleteBus(${bus.id})" class="delete-btn">🗑️</button>
                            </div>
                        </div>
                        <div class="bus-route">📍 ${bus.route}</div>
                        <div class="bus-stops">
                            ${bus.stops.map(stop => `<div class="bus-stop">${stop}</div>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    contentArea.innerHTML = html;
}

function renderCafeteria(menuItems, cafeteriaInfo) {
    currentMenuItems = menuItems;
    currentCafeteriaInfo = cafeteriaInfo;
    const contentArea = document.getElementById('content-area');
    
    const categories = ['food', 'snacks', 'drinks'];
    
    const html = `
        <div id="cafeteria" class="content-section active">
            <div class="cafeteria-header">
                <div class="header-left">
                    <h2>🍽️ Campus Cafeteria</h2>
                    <div class="admin-controls" ${currentUser.role !== 'admin' ? 'style="display: none;"' : ''}>
                        <button onclick="showAddMenuItemForm()" class="admin-btn">➕ Add Menu Item</button>
                        <button onclick="refreshCafeteria()" class="refresh-btn">🔄 Refresh</button>
                    </div>
                </div>
                <div class="header-right">
                    <div class="cafeteria-info">
                        <div class="info-item">📍 <strong>Location:</strong> ${cafeteriaInfo.location}</div>
                        <div class="info-item"> <strong>Hours:</strong> ${cafeteriaInfo.hours}</div>
                    </div>
                </div>
            </div>

            <div class="filter-section">
                <div style="display: flex; gap: 60px; align-items: flex-start;">
                    <div class="filter-group">
                        <label>Category:</label>
                        <div class="filter-buttons">
                            <button class="filter-btn active" data-category="all" onclick="filterCategory('all', this)">All Categories</button>
                            ${categories.map(category => `
                                <button class="filter-btn" data-category="${category}" onclick="filterCategory('${category}', this)">
                                    ${getCategoryIcon(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="filter-group">
                        <label>Availability:</label>
                        <div class="filter-buttons">
                            <button class="filter-btn active" data-availability="all" onclick="filterAvailability('all', this)">All Items</button>
                            <button class="filter-btn" data-availability="available" onclick="filterAvailability('available', this)">✅ Available</button>
                            <button class="filter-btn" data-availability="limited" onclick="filterAvailability('limited', this)">⚠️ Limited</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="menuList">
                <div class="menu-grid">
                    ${menuItems.map(item => `
                        <div class="menu-card ${item.availability}" data-category="${item.category}" data-availability="${item.availability}" data-id="${item.id}">
                            <div class="menu-header">
                                <div class="item-name">
                                    ${getCategoryIcon(item.category)} ${item.name}
                                </div>
                                <div class="item-price">৳${item.price}</div>
                                <div class="item-actions" ${currentUser.role !== 'admin' ? 'style="display: none;"' : ''}>
                                    <button onclick="editMenuItem(${item.id})" class="edit-btn">✏️</button>
                                    <button onclick="deleteMenuItem(${item.id})" class="delete-btn">🗑️</button>
                                </div>
                            </div>
                            <div class="item-description">${item.description}</div>
                            <div class="item-details">
                                <div class="availability-badge ${item.availability}">
                                    ${getAvailabilityBadge(item.availability)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${menuItems.length === 0 ? '<div class="no-results">No menu items found matching your criteria.</div>' : ''}
            </div>
        </div>
    `;
    
    contentArea.innerHTML = html;
}

// Helper function for category icons
function getCategoryIcon(category) {
    const icons = {
        'food': '🍽️',
        'snacks': '🍿',
        'drinks': '🥤'
    };
    return icons[category] || '🍴';
}

// Helper function for availability badges
function getAvailabilityBadge(availability) {
    return availability === 'available' ? '✅ Available' : '⚠️ Limited';
}

// Helper function for department full names
function getDeptFullName(dept) {
    const deptNames = {
        'CSE': 'Computer Science & Engineering',
        'EEE': 'Electrical & Electronics',
        'BBA': 'Business Administration',
        'Civil': 'Civil Engineering',
        'Physics': 'Physics',
        'Chemistry': 'Chemistry'
    };
    return deptNames[dept] || dept;
}
