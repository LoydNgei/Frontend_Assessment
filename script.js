'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initMembershipToggles();
    initJoinModal();
    initFormValidation();
});

// ── 1. MOBILE MENU TOGGLE ──────────────────────────────────────
function initMobileMenu() {
    const btn = document.getElementById('menuToggleBtn');
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('menuIcon');

    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        const isOpen = !menu.hidden;
        menu.hidden = isOpen;
        btn.setAttribute('aria-expanded', String(!isOpen));
        if (icon) icon.className = isOpen ? 'bi bi-list' : 'bi bi-x-lg';
    });

    // Close when any link inside the menu is clicked
    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            menu.hidden = true;
            btn.setAttribute('aria-expanded', 'false');
            if (icon) icon.className = 'bi bi-list';
        });
    });
}

// ── 2. MEMBERSHIP ACCORDION TOGGLES ────────────────────────────
function initMembershipToggles() {
    const toggles = [
        { btnId: 'foundationToggleBtn', descId: 'foundation-description' },
        { btnId: 'economyToggleBtn', descId: 'economy-description' },
    ];

    toggles.forEach(({ btnId, descId }) => {
        const btn = document.getElementById(btnId);
        const desc = document.getElementById(descId);

        if (!btn || !desc) return;

        // Open by default
        btn.setAttribute('aria-expanded', 'true');
        desc.style.maxHeight = desc.scrollHeight + 'px';
        const chevron = btn.querySelector('.membership-card__chevron');
        if (chevron) chevron.classList.add('membership-card__chevron--up');

        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!isExpanded));

            if (isExpanded) {
                desc.style.maxHeight = desc.scrollHeight + 'px';
                desc.offsetHeight;
                desc.style.maxHeight = '0';
            } else {
                desc.style.maxHeight = desc.scrollHeight + 'px';
            }

            if (chevron) chevron.classList.toggle('membership-card__chevron--up', !isExpanded);
        });
    });
}

// ── 3. JOIN MODAL — reset state when closed ────────────────────
function initJoinModal() {
    const modal = document.getElementById('joinModal');
    if (!modal) return;

    modal.addEventListener('hidden.bs.modal', () => {
        const form = document.getElementById('joinForm');
        if (form) form.reset();
        clearFormErrors();

        const subtitle = document.getElementById('joinModalSubtitle');
        if (subtitle) subtitle.textContent = 'Start your financial adventure today.';
    });
}

// ── 4. FORM VALIDATION ─────────────────────────────────────────
function initFormValidation() {
    const form = document.getElementById('joinForm');
    const nameIn = document.getElementById('joinName');
    const emailIn = document.getElementById('joinEmail');
    const nameErr = document.getElementById('nameError');
    const emailErr = document.getElementById('emailError');
    const feedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('joinSubmitBtn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearFormErrors();

        const name = nameIn.value.trim();
        const email = emailIn.value.trim();
        let valid = true;

        // Name check
        if (!name) {
            showError(nameIn, nameErr, 'Please enter your full name.');
            valid = false;
        } else if (name.length < 2) {
            showError(nameIn, nameErr, 'Name must be at least 2 characters.');
            valid = false;
        }

        // Email check
        if (!email) {
            showError(emailIn, emailErr, 'Please enter your email address.');
            valid = false;
        } else if (!isValidEmail(email)) {
            showError(emailIn, emailErr, 'Please enter a valid email address.');
            valid = false;
        }

        if (!valid) return;

        // Simulate async submission
        submitBtn.disabled = true;
        submitBtn.innerHTML =
            '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Processing…';

        setTimeout(() => {
            showFeedback(
                feedback,
                'success',
                `Welcome, ${name}! Check ${email} for a confirmation.`
            );
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Join Now';
            form.reset();
        }, 1500);
    });

    // Clear error as user types
    [nameIn, emailIn].forEach((input) => {
        input.addEventListener('input', () => {
            input.classList.remove('join-modal__input--error');
            const errEl = input.id === 'joinName' ? nameErr : emailErr;
            if (errEl) errEl.textContent = '';
        });
    });
}

// ── Helpers ─────────────────────────────────────────────────────
function showError(input, errEl, msg) {
    input.classList.add('join-modal__input--error');
    if (errEl) errEl.textContent = msg;
}

function clearFormErrors() {
    document.querySelectorAll('.join-modal__input--error').forEach((el) =>
        el.classList.remove('join-modal__input--error')
    );
    document.querySelectorAll('.join-modal__error').forEach((el) => (el.textContent = ''));
    const fb = document.getElementById('formFeedback');
    if (fb) fb.innerHTML = '';
}

function showFeedback(el, type, msg) {
    if (!el) return;
    el.innerHTML = `<div class="alert alert-${type === 'success' ? 'success' : 'danger'} py-2 mt-2 mb-0" role="alert">${msg}</div>`;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
