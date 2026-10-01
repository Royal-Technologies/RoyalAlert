/**
 * RoyalAlert — DOM Utilities
 * Zero-dependency helpers for building and tearing down alert elements.
 */

/**
 * Create an element with a class and optional attributes / content.
 * @param {string} tag
 * @param {string} [className]
 * @param {Object} [attrs]  - key/value pairs; 'html' sets innerHTML, 'text' sets textContent
 * @returns {HTMLElement}
 */
export function createElement(tag, className = '', attrs = {}) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    for (const [key, value] of Object.entries(attrs)) {
        if (key === 'html')       el.innerHTML   = value;
        else if (key === 'text')  el.textContent = value;
        else                      el.setAttribute(key, value);
    }
    return el;
}

/** Safely remove an element from the DOM. */
export function removeElement(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

/** Add one or more space-separated class names. */
export function addClass(el, className) {
    if (el && className) {
        className.split(' ').filter(Boolean).forEach(c => el.classList.add(c));
    }
}

/** Remove one or more space-separated class names. */
export function removeClass(el, className) {
    if (el && className) {
        className.split(' ').filter(Boolean).forEach(c => el.classList.remove(c));
    }
}

/** Returns the width of the scrollbar (to avoid layout shift when locking). */
function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}

/** Prevent body from scrolling while a modal is open. */
export function lockBodyScroll() {
    if (!document.body.hasAttribute('data-ra-locked')) {
        const w = getScrollbarWidth();
        document.body.style.setProperty('--ra-scrollbar-w', `${w}px`);
        document.body.setAttribute('data-ra-locked', 'true');
    }
}

/** Re-enable body scrolling (only when the last modal has closed). */
export function unlockBodyScroll() {
    const remaining = document.querySelectorAll('.royal-alert-overlay').length;
    if (remaining === 0) {
        document.body.removeAttribute('data-ra-locked');
        document.body.style.removeProperty('--ra-scrollbar-w');
    }
}
