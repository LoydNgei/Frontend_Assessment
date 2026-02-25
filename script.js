/**
 * FrontFund Management — Main Script
 *
 * Features:
 *  1. Mobile navigation menu toggle
 *  2. Membership description toggle (Foundation & Economy)
 *  3. Join modal — membership label population
 *  4. Join modal — form validation
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initMembershipToggles();
    initJoinModal();
    initFormValidation();
});

/* ============================================================
   1. MOBILE MENU TOGGLE
   ============================================================ */
function initMobileMenu() {
    const menuBtn = document.getElementById('menuToggleBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        const isOpen = !mobileMenu.hidden;
        mobileMenu.hidden = isOpen;
        menuBtn.setAttribute('aria-expanded', String(!isOpen));

        // Swap icon between list (hamburger) and X
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.className = isOpen ? 'bi bi-list' : 'bi bi-x-lg';
        }
    });

    // Close menu when a link inside it is clicked
    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            mobileMenu.hidden = true;
            menuBtn.setAttribute('aria-expanded', 'false');
            const icon = menuBtn.querySelector('i');
            if (icon) icon.className = 'bi bi-list';
        });
    });
}

/* ============================================================
   2. MEMBERSHIP DESCRIPTION TOGGLE
   ============================================================ */
function initMembershipToggles() {
    const toggleConfigs = [
        { btnId: 'foundationToggleBtn', descId: 'foundation-description' },
        { btnId: 'economyToggleBtn', descId: 'economy-description' },
    ];

    toggleConfigs.forEach(({ btnId, descId }) => {
        const btn = document.getElementById(btnId);
        const desc = document.getElementById(descId);

        if (!btn || !desc) return;

        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            // Toggle aria attribute
            btn.setAttribute('aria-expanded', String(!isExpanded));

            // Animate max-height for smooth reveal
            if (isExpanded) {
                desc.style.maxHeight = '0';
                desc.classList.remove('membership-card__description--open');
            } else {
                // Set maxHeight to scrollHeight so the transition plays correctly
                desc.style.maxHeight = desc.scrollHeight + 'px';
                desc.classList.add('membership-card__description--open');
            }

            // Rotate chevron icon
            const chevron = btn.querySelector('.membership-card__chevron');
            if (chevron) {
                chevron.classList.toggle('membership-card__chevron--up', !isExpanded);
            }
        });
    });
}

/* ============================================================
   3. JOIN MODAL — POPULATE MEMBERSHIP LABEL
   ============================================================ */
function initJoinModal() {
    const joinModal = document.getElementById('joinModal');
    const subtitle = document.getElementById('joinModalSubtitle');
    const modalTitle = document.getElementById('joinModalLabel');

    if (!joinModal) return;

    joinModal.addEventListener('show.bs.modal', (event) => {
        // The button that triggered the modal
        const trigger = event.relatedTarget;
        const membershipType = trigger?.dataset?.membership;

        if (membershipType && subtitle) {
            subtitle.textContent = `You're signing up for the ${membershipType} Membership. Start your financial adventure today!`;
        }
        if (membershipType && modalTitle) {
            modalTitle.textContent = `Join ${membershipType} Membership`;
        }
    });

    // Reset form when modal closes
    joinModal.addEventListener('hidden.bs.modal', () => {
        const form = document.getElementById('joinForm');
        if (form) {
            form.reset();
            clearFormErrors();
        }
        if (subtitle) subtitle.textContent = 'Start your financial adventure today.';
        if (modalTitle) modalTitle.textContent = 'Join the Club';
    });
}

/* ============================================================
   4. FORM VALIDATION
   ============================================================ */
function initFormValidation() {
    const form = document.getElementById('joinForm');
    const nameInput = document.getElementById('joinName');
    const emailInput = document.getElementById('joinEmail');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const feedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('joinSubmitBtn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearFormErrors();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        let isValid = true;

        // Validate name
        if (!name) {
            showError(nameInput, nameError, 'Please enter your full name.');
            isValid = false;
        } else if (name.length < 2) {
            showError(nameInput, nameError, 'Name must be at least 2 characters.');
            isValid = false;
        }

        // Validate email
        if (!email) {
            showError(emailInput, emailError, 'Please enter your email address.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError(emailInput, emailError, 'Please enter a valid email address.');
            isValid = false;
        }

        if (!isValid) return;

        // Simulate successful submission
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing…';

        setTimeout(() => {
            showFeedback(feedback, 'success', `🎉 Welcome, ${name}! You're now on the waitlist. Check your inbox at ${email}.`);
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Join Now';
            form.reset();
        }, 1500);
    });

    // Live validation: clear error on input
    [nameInput, emailInput].forEach((input) => {
        input.addEventListener('input', () => {
            input.classList.remove('join-modal__input--error');
            const errEl = document.getElementById(input.id === 'joinName' ? 'nameError' : 'emailError');
            if (errEl) errEl.textContent = '';
        });
    });
}

/* --- Helpers --- */

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, errorEl, message) {
    input.classList.add('join-modal__input--error');
    if (errorEl) errorEl.textContent = message;
}

function clearFormErrors() {
    ['joinName', 'joinEmail'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('join-modal__input--error');
    });
    ['nameError', 'emailError'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });
    const feedback = document.getElementById('formFeedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'join-modal__feedback';
    }
}

function showFeedback(el, type, message) {
    if (!el) return;
    el.textContent = message;
    el.className = `join-modal__feedback join-modal__feedback--${type}`;
}
