// Modal Utilities Module

function closeModal(event) {
    if (event && event.target.classList.contains('modal-content')) return;
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}
