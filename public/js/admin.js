// Admin CRUD Operations Module

async function refreshClassrooms() {
    await loadClassrooms();
}

async function refreshLabs() {
    await loadLabs();
}

async function refreshBuses() {
    await loadBuses();
}

async function refreshCafeteria() {
    await loadCafeteria();
}

async function toggleLabStatus(labId) {
    try {
        const lab = currentLabs.find(l => l.id === labId);
        const newStatus = lab.status === 'open' ? 'closed' : 'open';
        
        const response = await makeAuthenticatedRequest(`${API_BASE}/labs/${labId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) throw new Error('Failed to update lab status');
        
        await refreshLabs();
    } catch (error) {
        alert('Error updating lab status: ' + error.message);
    }
}

async function deleteClassroom(classroomId) {
    if (!confirm('Are you sure you want to delete this classroom?')) return;
    
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/classrooms/${classroomId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete classroom');
        
        await refreshClassrooms();
    } catch (error) {
        alert('Error deleting classroom: ' + error.message);
    }
}

async function deleteBus(busId) {
    if (!confirm('Are you sure you want to delete this bus route?')) return;
    
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/buses/${busId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete bus route');
        
        await refreshBuses();
    } catch (error) {
        alert('Error deleting bus route: ' + error.message);
    }
}

function showAddClassroomForm() {
    const room = prompt('Enter room number (e.g., G-104):');
    const dept = prompt('Enter department (CSE, EEE, BBA, Civil):');
    const floor = prompt('Enter floor (e.g., Ground Floor, 1st Floor):');
    const capacity = prompt('Enter capacity:');
    
    if (room && dept && floor && capacity) {
        addClassroom({ room, dept, floor, capacity: parseInt(capacity) });
    }
}

function showAddBusForm() {
    const number = prompt('Enter bus number (e.g., D1):');
    const time = prompt('Enter departure time (e.g., 10:00 AM):');
    const route = prompt('Enter route description:');
    const stopsStr = prompt('Enter stops separated by commas:');
    
    if (number && time && route && stopsStr) {
        const stops = stopsStr.split(',').map(stop => stop.trim());
        addBus({ number, time, route, stops });
    }
}

async function addClassroom(classroomData) {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/classrooms`, {
            method: 'POST',
            body: JSON.stringify(classroomData)
        });
        
        if (!response.ok) throw new Error('Failed to add classroom');
        
        await refreshClassrooms();
    } catch (error) {
        alert('Error adding classroom: ' + error.message);
    }
}

async function addBus(busData) {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/buses`, {
            method: 'POST',
            body: JSON.stringify(busData)
        });
        
        if (!response.ok) throw new Error('Failed to add bus route');
        
        await refreshBuses();
    } catch (error) {
        alert('Error adding bus route: ' + error.message);
    }
}

async function editClassroom(classroomId) {
    const classroom = currentClassrooms.find(c => c.id === classroomId);
    if (!classroom) return;
    
    const room = prompt('Enter room number:', classroom.room);
    const dept = prompt('Enter department:', classroom.dept);
    const floor = prompt('Enter floor:', classroom.floor);
    const capacity = prompt('Enter capacity:', classroom.capacity);
    
    if (room && dept && floor && capacity) {
        try {
            const response = await makeAuthenticatedRequest(`${API_BASE}/classrooms/${classroomId}`, {
                method: 'PUT',
                body: JSON.stringify({ 
                    room, dept, floor, capacity: parseInt(capacity) 
                })
            });
            
            if (!response.ok) throw new Error('Failed to update classroom');
            
            await refreshClassrooms();
        } catch (error) {
            alert('Error updating classroom: ' + error.message);
        }
    }
}

async function editBus(busId) {
    const bus = currentBuses.find(b => b.id === busId);
    if (!bus) return;
    
    const number = prompt('Enter bus number:', bus.number);
    const time = prompt('Enter departure time:', bus.time);
    const route = prompt('Enter route description:', bus.route);
    const stopsStr = prompt('Enter stops separated by commas:', bus.stops.join(', '));
    
    if (number && time && route && stopsStr) {
        const stops = stopsStr.split(',').map(stop => stop.trim());
        
        try {
            const response = await makeAuthenticatedRequest(`${API_BASE}/buses/${busId}`, {
                method: 'PUT',
                body: JSON.stringify({ number, time, route, stops })
            });
            
            if (!response.ok) throw new Error('Failed to update bus route');
            
            await refreshBuses();
        } catch (error) {
            alert('Error updating bus route: ' + error.message);
        }
    }
}

// Cafeteria Admin Functions
async function deleteMenuItem(itemId) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/cafeteria/menu/${itemId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete menu item');
        
        await refreshCafeteria();
    } catch (error) {
        alert('Error deleting menu item: ' + error.message);
    }
}

function showAddMenuItemForm() {
    const name = prompt('Enter item name:');
    const description = prompt('Enter item description:');
    const price = prompt('Enter price (in BDT):');
    const category = prompt('Enter category (food, snacks, drinks):');
    const availability = prompt('Enter availability (available, limited):');
    
    if (name && description && price && category && availability) {
        if (!['food', 'snacks', 'drinks'].includes(category)) {
            alert('Category must be: food, snacks, or drinks');
            return;
        }
        if (!['available', 'limited'].includes(availability)) {
            alert('Availability must be: available or limited');
            return;
        }
        
        addMenuItem({ 
            name, 
            description, 
            price: parseFloat(price), 
            category, 
            availability 
        });
    }
}

async function addMenuItem(itemData) {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/cafeteria/menu`, {
            method: 'POST',
            body: JSON.stringify(itemData)
        });
        
        if (!response.ok) throw new Error('Failed to add menu item');
        
        await refreshCafeteria();
    } catch (error) {
        alert('Error adding menu item: ' + error.message);
    }
}

async function editMenuItem(itemId) {
    const item = currentMenuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const name = prompt('Enter item name:', item.name);
    const description = prompt('Enter item description:', item.description);
    const price = prompt('Enter price (in BDT):', item.price);
    const category = prompt('Enter category (food, snacks, drinks):', item.category);
    const availability = prompt('Enter availability (available, limited):', item.availability);
    
    if (name && description && price && category && availability) {
        if (!['food', 'snacks', 'drinks'].includes(category)) {
            alert('Category must be: food, snacks, or drinks');
            return;
        }
        if (!['available', 'limited'].includes(availability)) {
            alert('Availability must be: available or limited');
            return;
        }
        
        try {
            const response = await makeAuthenticatedRequest(`${API_BASE}/cafeteria/menu/${itemId}`, {
                method: 'PUT',
                body: JSON.stringify({ 
                    name, 
                    description, 
                    price: parseFloat(price), 
                    category, 
                    availability 
                })
            });
            
            if (!response.ok) throw new Error('Failed to update menu item');
            
            await refreshCafeteria();
        } catch (error) {
            alert('Error updating menu item: ' + error.message);
        }
    }
}