// Search and Filter Module

async function searchClassrooms() {
    const searchTerm = document.getElementById('classroomSearch')?.value || '';
    
    try {
        const params = new URLSearchParams();
        if (currentDeptFilter !== 'all') {
            params.append('dept', currentDeptFilter);
        }
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        
        const response = await makeAuthenticatedRequest(`${API_BASE}/classrooms?${params}`);
        if (!response.ok) throw new Error('Failed to search classrooms');
        const classrooms = await response.json();
        
        renderClassrooms(classrooms);
    } catch (error) {
        console.error('Error searching classrooms:', error);
    }
}

function filterDept(dept, button) {
    currentDeptFilter = dept;

    // Update button states
    const buttons = document.querySelectorAll('#classrooms .filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    searchClassrooms();
}

async function searchLabs() {
    const searchTerm = document.getElementById('labSearch')?.value || '';
    
    try {
        const params = new URLSearchParams();
        if (currentLabFilter !== 'all') {
            params.append('status', currentLabFilter);
        }
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        
        const response = await makeAuthenticatedRequest(`${API_BASE}/labs?${params}`);
        if (!response.ok) throw new Error('Failed to search labs');
        const labs = await response.json();
        
        renderLabs(labs);
    } catch (error) {
        console.error('Error searching labs:', error);
    }
}

function filterLabStatus(status, button) {
    currentLabFilter = status;

    // Update button states
    const buttons = document.querySelectorAll('#labs .filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    searchLabs();
}

function filterBusTime(timeFilter, button) {
    currentBusTimeFilter = timeFilter;

    // Update button states
    const buttons = document.querySelectorAll('#buses .filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    searchBuses();
}

async function searchMenu() {
    const searchTerm = document.getElementById('menuSearch')?.value || '';
    
    try {
        const params = new URLSearchParams();
        if (currentCategoryFilter !== 'all') {
            params.append('category', currentCategoryFilter);
        }
        if (currentAvailabilityFilter !== 'all') {
            params.append('availability', currentAvailabilityFilter);
        }
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        
        const [menuResponse, infoResponse] = await Promise.all([
            makeAuthenticatedRequest(`${API_BASE}/cafeteria/menu?${params}`),
            makeAuthenticatedRequest(`${API_BASE}/cafeteria/info`)
        ]);
        
        if (!menuResponse.ok) throw new Error('Failed to search menu');
        if (!infoResponse.ok) throw new Error('Failed to load cafeteria info');
        
        const menuItems = await menuResponse.json();
        const cafeteriaInfo = await infoResponse.json();
        
        renderCafeteria(menuItems, cafeteriaInfo);
    } catch (error) {
        console.error('Error searching menu:', error);
    }
}

function filterCategory(category, button) {
    currentCategoryFilter = category;

    // Update button states
    const buttons = document.querySelectorAll('#cafeteria .filter-buttons[data-category] .filter-btn, #cafeteria .filter-group:first-child .filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    searchMenu();
}

function filterAvailability(availability, button) {
    currentAvailabilityFilter = availability;

    // Update button states
    const buttons = document.querySelectorAll('#cafeteria .filter-group:last-child .filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    searchMenu();
}

async function searchBuses() {
    const searchTerm = document.getElementById('busSearch')?.value || '';
    
    try {
        const params = new URLSearchParams();
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        
        const response = await makeAuthenticatedRequest(`${API_BASE}/buses?${params}`);
        if (!response.ok) throw new Error('Failed to search buses');
        let buses = await response.json();
        
        // Apply time filter if not 'all'
        if (currentBusTimeFilter !== 'all') {
            buses = buses.filter(bus => {
                const time = bus.time.toLowerCase();
                
                if (currentBusTimeFilter === 'morning') {
                    // 6AM-12PM
                    return time.includes('6:') || time.includes('7:') || time.includes('8:') || 
                           time.includes('9:') || time.includes('10:') || time.includes('11:') || 
                           (time.includes('12:') && time.includes('pm')) ||
                           (time.includes('am') && !time.includes('12:'));
                } else if (currentBusTimeFilter === 'afternoon') {
                    // 12PM-6PM
                    return (time.includes('12:') && time.includes('pm')) ||
                           time.includes('1:') && time.includes('pm') ||
                           time.includes('2:') && time.includes('pm') ||
                           time.includes('3:') && time.includes('pm') ||
                           time.includes('4:') && time.includes('pm') ||
                           time.includes('5:') && time.includes('pm') ||
                           time.includes('6:') && time.includes('pm');
                } else if (currentBusTimeFilter === 'evening') {
                    // 6PM-12AM
                    return (time.includes('6:') && time.includes('pm')) ||
                           time.includes('7:') && time.includes('pm') ||
                           time.includes('8:') && time.includes('pm') ||
                           time.includes('9:') && time.includes('pm') ||
                           time.includes('10:') && time.includes('pm') ||
                           time.includes('11:') && time.includes('pm') ||
                           (time.includes('12:') && time.includes('am'));
                }
                return true;
            });
        }
        
        renderBuses(buses);
    } catch (error) {
        console.error('Error searching buses:', error);
    }
}
