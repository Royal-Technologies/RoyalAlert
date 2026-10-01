/**
 * RoyalAlert — Accessibility Utilities
 * Focus trapping + restoration for ARIA-compliant modal dialogs.
 */

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([type="hidden"]):not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
].join(',');

/**
 * Trap keyboard focus inside `element`.
 * Returns the cleanup function to remove the event listener.
 * @param {HTMLElement} element
 * @returns {() => void}
 */
export function trapFocus(element) {
    const handler = (e) => {
        if (e.key !== 'Tab') return;
        const nodes = [...element.querySelectorAll(FOCUSABLE)].filter(n => !n.closest('[disabled]'));
        if (!nodes.length) { e.preventDefault(); return; }

        const first = nodes[0];
        const last  = nodes[nodes.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            last.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
            first.focus();
            e.preventDefault();
        }
    };

    element.addEventListener('keydown', handler);
    return () => element.removeEventListener('keydown', handler);
}

let _previousFocus = null;

/** Remember what was focused before opening a modal. */
export function saveActiveElement() {
    _previousFocus = document.activeElement;
}

/** Restore focus to the element that was active before the modal opened. */
export function restoreActiveElement() {
    try {
        if (_previousFocus && typeof _previousFocus.focus === 'function') {
            _previousFocus.focus({ preventScroll: true });
        }
    } catch (_) {}
}
