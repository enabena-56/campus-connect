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
    openFormModal({
        title: 'Add Classroom',
        submitText: 'Add Classroom',
        fields: [
            { name: 'room', label: 'Room Number', required: true, placeholder: 'G-104' },
            { name: 'dept', label: 'Department', required: true, placeholder: 'CSE, EEE, BBA, etc.' },
            { name: 'floor', label: 'Floor', required: true, placeholder: '1st Floor' },
            { name: 'capacity', label: 'Capacity', type: 'number', required: true, placeholder: '60' }
        ],
        onSubmit: async (data) => {
            await addClassroom({
                room: data.room,
                dept: data.dept,
                floor: data.floor,
                capacity: Number(data.capacity)
            });
        }
    });
}

function showAddLabForm() {
    openFormModal({
        title: 'Add Lab',
        submitText: 'Add Lab',
        fields: [
            { name: 'name', label: 'Lab Name', required: true, placeholder: 'Network & Security Lab' },
            { name: 'dept', label: 'Department', required: true, placeholder: 'CSE, EEE, BBA, etc.' },
            { name: 'location', label: 'Location', required: true, placeholder: '3rd Floor, Room 3-308' },
            { name: 'computers', label: 'Number of Computers', type: 'number', required: true, placeholder: '40' },
            { name: 'projector', label: 'Projector', type: 'select', options: ['Yes', 'No'], required: true, value: 'Yes' },
            { name: 'instruments', label: 'Instruments', type: 'textarea', placeholder: 'Routers, Switches, Whiteboard' },
            { name: 'status', label: 'Status', type: 'select', options: ['open', 'closed'], required: true, value: 'open' },
            { name: 'hours', label: 'Hours', required: true, placeholder: '8:00 AM - 6:00 PM' }
        ],
        onSubmit: async (data) => {
            await addLab({
                name: data.name,
                dept: data.dept,
                location: data.location,
                computers: Number(data.computers),
                projector: data.projector,
                instruments: data.instruments,
                status: data.status,
                hours: data.hours
            });
        }
    });
}

function showAddBusForm() {
    openFormModal({
        title: 'Add Bus Route',
        submitText: 'Add Bus',
        fields: [
            { name: 'number', label: 'Bus Number', required: true, placeholder: 'D1' },
            { name: 'time', label: 'Departure Time', required: true, placeholder: '10:00 AM' },
            { name: 'route', label: 'Route Description', required: true, placeholder: 'Campus → City Center → Station' },
            { name: 'stops', label: 'Stops (comma separated)', type: 'textarea', required: true, placeholder: 'Campus Gate, City Center, Station' }
        ],
        onSubmit: async (data) => {
            const stops = data.stops
                .split(',')
                .map(stop => stop.trim())
                .filter(Boolean);
            await addBus({
                number: data.number,
                time: data.time,
                route: data.route,
                stops
            });
        }
    });
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

async function addLab(labData) {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/labs`, {
            method: 'POST',
            body: JSON.stringify(labData)
        });

        if (!response.ok) throw new Error('Failed to add lab');

        await refreshLabs();
    } catch (error) {
        alert('Error adding lab: ' + error.message);
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

    openFormModal({
        title: 'Edit Classroom',
        submitText: 'Update Classroom',
        fields: [
            { name: 'room', label: 'Room Number', required: true, placeholder: 'G-104', value: classroom.room },
            { name: 'dept', label: 'Department', required: true, placeholder: 'CSE, EEE, BBA, etc.', value: classroom.dept },
            { name: 'floor', label: 'Floor', required: true, placeholder: '1st Floor', value: classroom.floor },
            { name: 'capacity', label: 'Capacity', type: 'number', required: true, placeholder: '60', value: classroom.capacity }
        ],
        onSubmit: async (data) => {
            const response = await makeAuthenticatedRequest(`${API_BASE}/classrooms/${classroomId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    room: data.room,
                    dept: data.dept,
                    floor: data.floor,
                    capacity: Number(data.capacity)
                })
            });

            if (!response.ok) throw new Error('Failed to update classroom');
            await refreshClassrooms();
        }
    });
}

async function editBus(busId) {
    const bus = currentBuses.find(b => b.id === busId);
    if (!bus) return;

    openFormModal({
        title: 'Edit Bus Route',
        submitText: 'Update Bus',
        fields: [
            { name: 'number', label: 'Bus Number', required: true, placeholder: 'D1', value: bus.number },
            { name: 'time', label: 'Departure Time', required: true, placeholder: '10:00 AM', value: bus.time },
            { name: 'route', label: 'Route Description', required: true, placeholder: 'Campus → City Center → Station', value: bus.route },
            { name: 'stops', label: 'Stops (comma separated)', type: 'textarea', required: true, placeholder: 'Campus Gate, City Center, Station', value: bus.stops.join(', ') }
        ],
        onSubmit: async (data) => {
            const stops = data.stops
                .split(',')
                .map(stop => stop.trim())
                .filter(Boolean);

            const response = await makeAuthenticatedRequest(`${API_BASE}/buses/${busId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    number: data.number,
                    time: data.time,
                    route: data.route,
                    stops
                })
            });

            if (!response.ok) throw new Error('Failed to update bus route');
            await refreshBuses();
        }
    });
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

    openFormModal({
        title: 'Edit Menu Item',
        submitText: 'Update Item',
        fields: [
            { name: 'name', label: 'Item Name', required: true, placeholder: 'Chicken Biriyani', value: item.name },
            { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Delicious rice dish', value: item.description },
            { name: 'price', label: 'Price (BDT)', type: 'number', required: true, placeholder: '180', value: item.price },
            { name: 'category', label: 'Category', type: 'select', required: true, options: ['food', 'snacks', 'drinks'], value: item.category },
            { name: 'availability', label: 'Availability', type: 'select', required: true, options: ['available', 'limited'], value: item.availability }
        ],
        onSubmit: async (data) => {
            const response = await makeAuthenticatedRequest(`${API_BASE}/cafeteria/menu/${itemId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                    price: Number(data.price),
                    category: data.category,
                    availability: data.availability
                })
            });

            if (!response.ok) throw new Error('Failed to update menu item');
            await refreshCafeteria();
        }
    });
}