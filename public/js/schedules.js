// Schedules Management Module

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

async function viewSchedule(resourceType, resourceId, resourceName) {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/schedules/${resourceType}/${resourceId}`);
        
        if (!response.ok) throw new Error('Failed to load schedule');
        
        const schedules = await response.json();
        
        // Also fetch approved booking requests for this resource
        const bookingsResponse = await makeAuthenticatedRequest(`${API_BASE}/booking-requests?resource_type=${resourceType}&resource_id=${resourceId}&status=approved`);
        const approvedBookings = bookingsResponse.ok ? await bookingsResponse.json() : [];
        
        // Group schedules by day
        const schedulesByDay = {};
        DAYS_OF_WEEK.forEach(day => {
            schedulesByDay[day] = schedules.filter(s => s.day_of_week === day);
        });

        const html = `
            <div class="modal-overlay" onclick="closeModal(event)">
                <div class="modal-content schedule-modal" onclick="event.stopPropagation()">
                    <div class="schedule-header">
                        <h3>📅 Weekly Schedule - ${resourceName}</h3>
                        <div class="schedule-header-actions">
                            <button onclick="showBookingRequestForm('${resourceType}', ${resourceId}, '${resourceName.replace(/'/g, "\\'")}')" class="booking-request-btn" title="Request Special Program Booking">📝 Request Booking</button>
                            ${currentUser.role === 'admin' ? `
                                <button onclick="showAddScheduleForm('${resourceType}', ${resourceId}, '${resourceName}')" class="add-schedule-btn">➕ Add Class</button>
                                <button onclick="showBookingRequests('${resourceType}', ${resourceId}, '${resourceName.replace(/'/g, "\\'")}')" class="view-requests-btn">📋 View Requests</button>
                            ` : `
                                <button onclick="showMyBookingRequests('${resourceType}', ${resourceId})" class="my-requests-btn">📋 My Requests</button>
                            `}
                        </div>
                    </div>
                    
                    ${approvedBookings.length > 0 ? `
                        <div class="approved-bookings-section">
                            <h4>🎯 Upcoming Special Programs (Approved Bookings)</h4>
                            <div class="approved-bookings-list">
                                ${approvedBookings.map(booking => `
                                    <div class="approved-booking-card">
                                        <div class="booking-icon">📌</div>
                                        <div class="booking-info">
                                            <div class="booking-name">${booking.program_name}</div>
                                            <div class="booking-meta">
                                                📅 ${new Date(booking.date).toLocaleDateString()} | 
                                                ⏰ ${booking.start_time} - ${booking.end_time}
                                                ${booking.participant_count ? ` | 👥 ${booking.participant_count} participants` : ''}
                                            </div>
                                            ${booking.description ? `<div class="booking-desc">${booking.description}</div>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="week-tabs">
                        ${DAYS_OF_WEEK.map((day, index) => `
                            <button class="day-tab ${index === 0 ? 'active' : ''}" onclick="switchDay('${day}', this)">${day.substring(0, 3)}</button>
                        `).join('')}
                    </div>

                    <div class="schedule-content">
                        ${DAYS_OF_WEEK.map((day, index) => `
                            <div class="day-schedule ${index === 0 ? 'active' : ''}" data-day="${day}">
                                <h4>${day}</h4>
                                ${schedulesByDay[day].length === 0 ? 
                                    '<p class="no-classes">No classes scheduled</p>' : 
                                    `<div class="schedule-slots">
                                        ${schedulesByDay[day].sort((a, b) => a.start_time.localeCompare(b.start_time)).map(slot => `
                                            <div class="schedule-slot">
                                                <div class="slot-time">⏰ ${slot.start_time} - ${slot.end_time}</div>
                                                <div class="slot-subject">${slot.subject}</div>
                                                ${slot.course_code ? `<div class="slot-code">📚 ${slot.course_code}</div>` : ''}
                                                ${slot.instructor ? `<div class="slot-instructor">👨‍🏫 ${slot.instructor}</div>` : ''}
                                                ${currentUser.role === 'admin' ? `
                                                    <div class="slot-actions">
                                                        <button onclick="editScheduleSlot(${slot.id}, '${resourceType}', ${resourceId}, '${resourceName}')" class="edit-slot-btn">✏️</button>
                                                        <button onclick="deleteScheduleSlot(${slot.id}, '${resourceType}', ${resourceId}, '${resourceName}')" class="delete-slot-btn">🗑️</button>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `).join('')}
                                    </div>`
                                }
                            </div>
                        `).join('')}
                    </div>

                    <button onclick="closeModal()" class="close-modal-btn">Close</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    } catch (error) {
        alert('Error loading schedule: ' + error.message);
    }
}

function switchDay(day, button) {
    // Update active tab
    document.querySelectorAll('.day-tab').forEach(tab => tab.classList.remove('active'));
    button.classList.add('active');

    // Show selected day schedule
    document.querySelectorAll('.day-schedule').forEach(schedule => {
        schedule.classList.remove('active');
        if (schedule.dataset.day === day) {
            schedule.classList.add('active');
        }
    });
}

function showAddScheduleForm(resourceType, resourceId, resourceName) {
    const html = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal-content small-modal" onclick="event.stopPropagation()">
                <h3>➕ Add Class Schedule</h3>
                <form id="addScheduleForm" onsubmit="submitSchedule(event, '${resourceType}', ${resourceId}, '${resourceName}')">
                    <div class="form-group">
                        <label>Day of Week:</label>
                        <select id="day_of_week" required>
                            ${DAYS_OF_WEEK.map(day => `<option value="${day}">${day}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Start Time:</label>
                        <input type="time" id="start_time" required>
                    </div>
                    <div class="form-group">
                        <label>End Time:</label>
                        <input type="time" id="end_time" required>
                    </div>
                    <div class="form-group">
                        <label>Subject:</label>
                        <input type="text" id="subject" required placeholder="e.g., Introduction to Programming">
                    </div>
                    <div class="form-group">
                        <label>Course Code (optional):</label>
                        <input type="text" id="course_code" placeholder="e.g., CSE 101">
                    </div>
                    <div class="form-group">
                        <label>Instructor (optional):</label>
                        <input type="text" id="instructor" placeholder="e.g., Dr. Smith">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="submit-btn">Add to Schedule</button>
                        <button type="button" onclick="closeModal()" class="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

async function submitSchedule(event, resourceType, resourceId, resourceName) {
    event.preventDefault();

    const formData = {
        resource_type: resourceType,
        resource_id: resourceId,
        day_of_week: document.getElementById('day_of_week').value,
        start_time: document.getElementById('start_time').value,
        end_time: document.getElementById('end_time').value,
        subject: document.getElementById('subject').value,
        course_code: document.getElementById('course_code').value || null,
        instructor: document.getElementById('instructor').value || null
    };

    if (formData.start_time >= formData.end_time) {
        alert('End time must be after start time');
        return;
    }

    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/schedules`, {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to add schedule');

        alert('✅ Schedule added successfully!');
        closeModal();
        viewSchedule(resourceType, resourceId, resourceName);
    } catch (error) {
        alert('Error adding schedule: ' + error.message);
    }
}

async function editScheduleSlot(slotId, resourceType, resourceId, resourceName) {
    // For simplicity, we'll use prompts - you can make this a proper form later
    const subject = prompt('Enter subject:');
    const courseCode = prompt('Enter course code (optional):');
    const instructor = prompt('Enter instructor name (optional):');
    const startTime = prompt('Enter start time (HH:MM):');
    const endTime = prompt('Enter end time (HH:MM):');

    if (!subject || !startTime || !endTime) {
        alert('Subject, start time, and end time are required');
        return;
    }

    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/schedules/${slotId}`, {
            method: 'PUT',
            body: JSON.stringify({
                subject,
                course_code: courseCode || null,
                instructor: instructor || null,
                start_time: startTime,
                end_time: endTime
            })
        });

        if (!response.ok) throw new Error('Failed to update schedule');

        alert('✅ Schedule updated successfully!');
        closeModal();
        viewSchedule(resourceType, resourceId, resourceName);
    } catch (error) {
        alert('Error updating schedule: ' + error.message);
    }
}

async function deleteScheduleSlot(slotId, resourceType, resourceId, resourceName) {
    if (!confirm('Are you sure you want to delete this class from the schedule?')) return;

    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/schedules/${slotId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete schedule');

        alert('✅ Schedule deleted successfully!');
        closeModal();
        viewSchedule(resourceType, resourceId, resourceName);
    } catch (error) {
        alert('Error deleting schedule: ' + error.message);
    }
}