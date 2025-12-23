// Navigation and Routing Module

// Function to load dynamic content with API integration
async function loadTab(tabType, button) {
    const contentArea = document.getElementById('content-area');
    
    // 1. Update active tab button style
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // 2. Show loading state
    contentArea.innerHTML = '<div class="loading">Loading...</div>';

    // 3. Load content based on tab type
    try {
        if (tabType === 'home') {
            loadHome();
        } else if (tabType === 'classrooms') {
            await loadClassrooms();
        } else if (tabType === 'labs') {
            await loadLabs();
        } else if (tabType === 'buses') {
            await loadBuses();
        } else if (tabType === 'cafeteria') {
            await loadCafeteria();
        }
    } catch (error) {
        contentArea.innerHTML = `<div class="error">Error loading content: ${error.message}</div>`;
        console.error("Error loading tab content:", error);
    }
}
