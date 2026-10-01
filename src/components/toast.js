/**
 * RoyalAlert — Toast Component
 * Creates and manages non-blocking toast notifications.
 */

import { createElement, removeElement, addClass, removeClass } from '../utils/dom.js';
import { getIcon } from '../icons/svg.js';

/** Map of position key → container element */
const _containers = {};

function _getContainer(position) {
    if (!_containers[position]) {
        const el = createElement('div',
            `royal-alert-toast-container royal-alert-toast-${position}`);
        document.body.appendChild(el);
        _containers[position] = el;
    }
    return _containers[position];
}

/**
 * Create and display a toast.
 * Called by RoyalAlertInstance when `options.toast === true`.
 * @param {import('../core/instance.js').RoyalAlertInstance} instance
 */
export function createToast(instance) {
    const { options } = instance;
    const position = options.position || 'top-right';
    const container = _getContainer(position);

    // ── Build toast element ───────────────────────────────
    const toast = createElement('div', 'royal-alert-toast');
    toast.setAttribute('role', options.type === 'error' ? 'alert' : 'status');
    toast.setAttribute('aria-live', options.type === 'error' ? 'assertive' : 'polite');
    toast.setAttribute('aria-atomic', 'true');

    if (options.type)  toast.setAttribute('data-type', options.type);
    if (options.theme && options.theme !== 'light') toast.setAttribute('data-theme', options.theme);
    if (options.customClass) addClass(toast, options.customClass);

    // Icon
    if (options.icon || options.type) {
        const iconKey = options.icon || options.type;
        const svg = getIcon(iconKey);
        if (svg) {
            const iconEl = createElement('div', 'royal-alert-toast-icon');
            iconEl.innerHTML = svg;
            toast.appendChild(iconEl);
        }
    }

    // Content
    const content = createElement('div', 'royal-alert-toast-content');
    if (options.title) {
        const titleEl = createElement('div', 'royal-alert-toast-title');
        titleEl.textContent = options.title;
        content.appendChild(titleEl);
    }
    if (options.html) {
        const msgEl = createElement('div', 'royal-alert-toast-message');
        msgEl.innerHTML = options.html;
        content.appendChild(msgEl);
    } else if (options.message) {
        const msgEl = createElement('div', 'royal-alert-toast-message');
        msgEl.textContent = options.message;
        content.appendChild(msgEl);
    }
    toast.appendChild(content);

    // Close button
    if (options.closeButton !== false) {
        const closeBtn = createElement('button', 'royal-alert-toast-close');
        closeBtn.setAttribute('aria-label', 'Dismiss notification');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => instance.close());
        toast.appendChild(closeBtn);
    }

    // Progress timer bar
    const duration = options.duration;
    if (duration > 0) {
        const wrap = createElement('div', 'royal-alert-toast-progress-wrap');
        const bar  = createElement('div', 'royal-alert-toast-progress-bar');
        bar.style.animationName           = 'ra-toast-progress';
        bar.style.animationDuration       = `${duration}ms`;
        bar.style.animationTimingFunction = 'linear';
        bar.style.animationFillMode       = 'forwards';
        wrap.appendChild(bar);
        toast.appendChild(wrap);
        instance._progressBar = bar;
    }

    // Append to the right container
    if (position.startsWith('bottom')) {
        container.prepend(toast);
    } else {
        container.appendChild(toast);
    }

    // Hand the element back to instance so close() can find it
    instance.container = toast;

    // ── Auto-dismiss with pause-on-hover ─────────────────
    if (duration > 0) {
        let remaining = duration;
        let startedAt = Date.now();

        const _start = () => {
            instance._closeTimer = setTimeout(() => instance.close(), remaining);
            if (instance._progressBar) {
                instance._progressBar.style.animationPlayState = 'running';
            }
        };

        const _pause = () => {
            clearTimeout(instance._closeTimer);
            remaining -= Date.now() - startedAt;
            remaining = Math.max(0, remaining);
            if (instance._progressBar) {
                instance._progressBar.style.animationPlayState = 'paused';
            }
        };

        const _resume = () => {
            startedAt = Date.now();
            _start();
        };

        toast.addEventListener('mouseenter', _pause);
        toast.addEventListener('mouseleave', _resume);
        toast.addEventListener('focusin',    _pause);
        toast.addEventListener('focusout',   _resume);

        _start();
    }

    // Click callback
    if (typeof options.onClick === 'function') {
        toast.style.cursor = 'pointer';
        toast.addEventListener('click', (e) => {
            if (e.target.closest('.royal-alert-toast-close')) return;
            options.onClick(instance);
        });
    }

    // ── Trigger entrance animation (next paint) ───────────
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            addClass(toast, 'royal-alert-toast-show');
        });
    });

    return instance;
}
