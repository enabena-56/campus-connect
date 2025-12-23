// Resource Loaders Module

async function loadClassrooms() {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/classrooms`);
        if (!response.ok) throw new Error('Failed to load classrooms');
        const classrooms = await response.json();
        
        currentDeptFilter = 'all';
        renderClassrooms(classrooms);
    } catch (error) {
        console.error('Error loading classrooms:', error);
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `<div class="error">Error loading classrooms: ${error.message}</div>`;
    }
}

// Function to load labs from API
async function loadLabs() {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/labs`);
        if (!response.ok) throw new Error('Failed to load labs');
        const labs = await response.json();
        
        currentLabFilter = 'all';
        renderLabs(labs);
    } catch (error) {
        console.error('Error loading labs:', error);
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `<div class="error">Error loading labs: ${error.message}</div>`;
    }
}

// Function to load buses from API
async function loadBuses() {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/buses`);
        if (!response.ok) throw new Error('Failed to load buses');
        const buses = await response.json();
        
        currentBusTimeFilter = 'all';
        renderBuses(buses);
    } catch (error) {
        console.error('Error loading buses:', error);
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `<div class="error">Error loading buses: ${error.message}</div>`;
    }
}

// Function to load cafeteria from API
async function loadCafeteria() {
    try {
        const [menuResponse, infoResponse] = await Promise.all([
            makeAuthenticatedRequest(`${API_BASE}/cafeteria/menu`),
            makeAuthenticatedRequest(`${API_BASE}/cafeteria/info`)
        ]);
        
        if (!menuResponse.ok) throw new Error('Failed to load menu');
        if (!infoResponse.ok) throw new Error('Failed to load cafeteria info');
        
        const menuItems = await menuResponse.json();
        const cafeteriaInfo = await infoResponse.json();
        
        currentCategoryFilter = 'all';
        currentAvailabilityFilter = 'all';
        renderCafeteria(menuItems, cafeteriaInfo);
    } catch (error) {
        console.error('Error loading cafeteria:', error);
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `<div class="error">Error loading cafeteria: ${error.message}</div>`;
    }
}
