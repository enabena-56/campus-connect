// Modal Utilities Module

function closeModal(event) {
    if (event && event.target.classList.contains('modal-content')) return;
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

function openFormModal({ title, fields = [], submitText = 'Save', onSubmit }) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const formFields = fields.map(field => {
        const label = `<label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>`;
        const commonAttrs = `id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}`;

        if (field.type === 'select') {
            const options = field.options.map(opt => {
                const value = typeof opt === 'string' ? opt : opt.value;
                const text = typeof opt === 'string' ? opt : opt.label;
                const selected = field.value && field.value === value ? 'selected' : '';
                return `<option value="${value}" ${selected}>${text}</option>`;
            }).join('');
            return `<div class="form-row">${label}<select ${commonAttrs}>${options}</select></div>`;
        }

        if (field.type === 'textarea') {
            return `<div class="form-row">${label}<textarea ${commonAttrs} rows="3" placeholder="${field.placeholder || ''}">${field.value || ''}</textarea></div>`;
        }

        const inputType = field.type || 'text';
        const valueAttr = field.value ? `value="${field.value}"` : '';
        const placeholder = field.placeholder ? `placeholder="${field.placeholder}"` : '';
        return `<div class="form-row">${label}<input type="${inputType}" ${commonAttrs} ${placeholder} ${valueAttr} /></div>`;
    }).join('');

    overlay.innerHTML = `
        <div class="modal-content small-modal form-modal" onclick="event.stopPropagation()">
            <div class="modal-header">
                <h3>${title}</h3>
            </div>
            <form class="form-grid">
                ${formFields}
                <div class="form-actions">
                    <button type="button" class="secondary-btn" id="cancelFormBtn">Cancel</button>
                    <button type="submit" class="primary-btn">${submitText}</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.querySelector('#cancelFormBtn').addEventListener('click', close);

    const form = overlay.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!onSubmit) return;

        const data = {};
        fields.forEach(field => {
            const el = form.elements[field.name];
            let value = el.value;
            if (field.type === 'number') value = Number(value);
            if (field.type === 'textarea' && field.trim !== false) value = value.trim();
            data[field.name] = value;
        });

        const submitBtn = form.querySelector('.primary-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            await onSubmit(data, close);
            close();
        } catch (error) {
            alert(error.message || 'Failed to submit form');
            submitBtn.disabled = false;
            submitBtn.textContent = submitText;
        }
    });
}
