// Bookings Management Module

function showBookingRequestForm(resourceType, resourceId, resourceName) {
    const html = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal-content small-modal" onclick="event.stopPropagation()">
                <h3>📝 Request Special Program Booking</h3>
                <p class="modal-subtitle">For: ${resourceName}</p>
                <form id="bookingRequestForm" onsubmit="submitBookingRequest(event, '${resourceType}', ${resourceId})">
                    <div class="form-group">
                        <label>Program Name: *</label>
                        <input type="text" id="program_name" required placeholder="e.g., Tech Workshop, Seminar, etc.">
                    </div>
                    <div class="form-group">
                        <label>Date: *</label>
                        <input type="date" id="booking_date" required min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label>Start Time: *</label>
                        <input type="time" id="booking_start_time" required>
                    </div>
                    <div class="form-group">
                        <label>End Time: *</label>
                        <input type="time" id="booking_end_time" required>
                    </div>
                    <div class="form-group">
                        <label>Expected Participants:</label>
                        <input type="number" id="participant_count" min="1" placeholder="Number of participants">
                    </div>
                    <div class="form-group">
                        <label>Description:</label>
                        <textarea id="booking_description" rows="3" placeholder="Provide details about the program..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Submit Request</button>
                        <button type="button" onclick="closeModal()" class="btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

async function submitBookingRequest(event, resourceType, resourceId) {
    event.preventDefault();

    const formData = {
        resource_type: resourceType,
        resource_id: resourceId,
        program_name: document.getElementById('program_name').value,
        date: document.getElementById('booking_date').value,
        start_time: document.getElementById('booking_start_time').value,
        end_time: document.getElementById('booking_end_time').value,
        participant_count: document.getElementById('participant_count').value || null,
        description: document.getElementById('booking_description').value || null
    };

    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/booking-requests`, {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to submit booking request');
        }

        alert('✅ Booking request submitted successfully!\nYou will be notified once an admin reviews it.');
        closeModal();
    } catch (error) {
        alert('Error submitting booking request: ' + error.message);
    }
}

async function showMyBookingRequests(resourceType = null, resourceId = null) {
    try {
        let url = `${API_BASE}/booking-requests`;
        if (resourceType && resourceId) {
            url += `?resource_type=${resourceType}`;
        }

        const response = await makeAuthenticatedRequest(url);
        if (!response.ok) throw new Error('Failed to load booking requests');

        const requests = await response.json();
        const filteredRequests = resourceId ? 
            requests.filter(r => r.resource_id === resourceId && r.resource_type === resourceType) : 
            requests;

        const html = `
            <div class="modal-overlay" onclick="closeModal(event)">
                <div class="modal-content booking-requests-modal" onclick="event.stopPropagation()">
                    <h3>📋 My Booking Requests</h3>
                    ${filteredRequests.length === 0 ? 
                        '<p class="no-requests">No booking requests found</p>' :
                        `<div class="requests-list">
                            ${filteredRequests.map(req => `
                                <div class="request-card ${req.status}">
                                    <div class="request-header">
                                        <h4>${req.program_name}</h4>
                                        <span class="status-badge ${req.status}">${req.status.toUpperCase()}</span>
                                    </div>
                                    <div class="request-details">
                                        <p><strong>Resource:</strong> ${req.resource_name} (${req.resource_type})</p>
                                        <p><strong>Date:</strong> ${new Date(req.date).toLocaleDateString()}</p>
                                        <p><strong>Time:</strong> ${req.start_time} - ${req.end_time}</p>
                                        ${req.participant_count ? `<p><strong>Participants:</strong> ${req.participant_count}</p>` : ''}
                                        ${req.description ? `<p><strong>Description:</strong> ${req.description}</p>` : ''}
                                        ${req.admin_notes ? `<p class="admin-notes"><strong>Admin Notes:</strong> ${req.admin_notes}</p>` : ''}
                                        <p class="request-date"><small>Requested on: ${new Date(req.created_at).toLocaleString()}</small></p>
                                    </div>
                                    ${req.status === 'pending' ? `
                                        <div class="request-actions">
                                            <button onclick="deleteBookingRequest(${req.id})" class="btn-danger">🗑️ Cancel</button>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>`
                    }
                    <button onclick="closeModal()" class="close-modal-btn">Close</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    } catch (error) {
        alert('Error loading booking requests: ' + error.message);
    }
}

async function showBookingRequests(resourceType = null, resourceId = null, resourceName = '') {
    try {
        let url = `${API_BASE}/booking-requests`;
        if (resourceType && resourceId) {
            url += `?resource_type=${resourceType}`;
        }

        const response = await makeAuthenticatedRequest(url);
        if (!response.ok) throw new Error('Failed to load booking requests');

        const requests = await response.json();
        const filteredRequests = resourceId ? 
            requests.filter(r => r.resource_id === resourceId && r.resource_type === resourceType) : 
            requests;

        const html = `
            <div class="modal-overlay" onclick="closeModal(event)">
                <div class="modal-content booking-requests-modal" onclick="event.stopPropagation()">
                    <h3>📋 Booking Requests ${resourceName ? `- ${resourceName}` : ''}</h3>
                    <div class="filter-tabs">
                        <button class="filter-tab active" onclick="filterBookingRequests('all', this)">All</button>
                        <button class="filter-tab" onclick="filterBookingRequests('pending', this)">Pending</button>
                        <button class="filter-tab" onclick="filterBookingRequests('approved', this)">Approved</button>
                        <button class="filter-tab" onclick="filterBookingRequests('rejected', this)">Rejected</button>
                    </div>
                    ${filteredRequests.length === 0 ? 
                        '<p class="no-requests">No booking requests found</p>' :
                        `<div class="requests-list">
                            ${filteredRequests.map(req => `
                                <div class="request-card ${req.status}" data-status="${req.status}">
                                    <div class="request-header">
                                        <div>
                                            <h4>${req.program_name}</h4>
                                            <p class="requester-info">By: ${req.requester_name} (${req.requester_student_id})</p>
                                        </div>
                                        <span class="status-badge ${req.status}">${req.status.toUpperCase()}</span>
                                    </div>
                                    <div class="request-details">
                                        <p><strong>Resource:</strong> ${req.resource_name} (${req.resource_type})</p>
                                        <p><strong>Date:</strong> ${new Date(req.date).toLocaleDateString()}</p>
                                        <p><strong>Time:</strong> ${req.start_time} - ${req.end_time}</p>
                                        ${req.participant_count ? `<p><strong>Participants:</strong> ${req.participant_count}</p>` : ''}
                                        ${req.description ? `<p><strong>Description:</strong> ${req.description}</p>` : ''}
                                        ${req.admin_notes ? `<p class="admin-notes"><strong>Admin Notes:</strong> ${req.admin_notes}</p>` : ''}
                                        <p class="request-date"><small>Requested on: ${new Date(req.created_at).toLocaleString()}</small></p>
                                    </div>
                                    ${req.status === 'pending' ? `
                                        <div class="request-actions">
                                            <button onclick="approveBookingRequest(${req.id})" class="btn-success">✅ Approve</button>
                                            <button onclick="rejectBookingRequest(${req.id})" class="btn-danger">❌ Reject</button>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>`
                    }
                    <button onclick="closeModal()" class="close-modal-btn">Close</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    } catch (error) {
        alert('Error loading booking requests: ' + error.message);
    }
}

function filterBookingRequests(status, button) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    button.classList.add('active');

    // Show/hide requests based on status
    document.querySelectorAll('.request-card').forEach(card => {
        if (status === 'all' || card.dataset.status === status) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

async function approveBookingRequest(requestId) {
    const adminNotes = prompt('Add any notes (optional):');

    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/booking-requests/${requestId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({
                status: 'approved',
                admin_notes: adminNotes || null
            })
        });

        if (!response.ok) throw new Error('Failed to approve booking request');

        alert('✅ Booking request approved!');
        closeModal();
    } catch (error) {
        alert('Error approving booking request: ' + error.message);
    }
}

async function rejectBookingRequest(requestId) {
    const adminNotes = prompt('Reason for rejection (optional):');

    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/booking-requests/${requestId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({
                status: 'rejected',
                admin_notes: adminNotes || null
            })
        });

        if (!response.ok) throw new Error('Failed to reject booking request');

        alert('❌ Booking request rejected');
        closeModal();
    } catch (error) {
        alert('Error rejecting booking request: ' + error.message);
    }
}

async function deleteBookingRequest(requestId) {
    if (!confirm('Are you sure you want to cancel this booking request?')) return;

    try {
        const response = await makeAuthenticatedRequest(`${API_BASE}/booking-requests/${requestId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete booking request');

        alert('✅ Booking request cancelled');
        closeModal();
    } catch (error) {
        alert('Error cancelling booking request: ' + error.message);
    }
}