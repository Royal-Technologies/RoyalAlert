/**
 * RoyalAlert — Core Instance
 * Builds and manages the lifecycle of a single modal/dialog.
 */

import { globalConfig, defaultOptions } from './config.js';
import {
    createElement, removeElement,
    lockBodyScroll, unlockBodyScroll,
    addClass, removeClass
} from '../utils/dom.js';
import { trapFocus, saveActiveElement, restoreActiveElement } from '../utils/a11y.js';
import { getIcon } from '../icons/svg.js';
import { createToast } from '../components/toast.js';

let activeInstances = [];

export class RoyalAlertInstance {

    constructor(options) {
        this.options = { ...defaultOptions, ...globalConfig, ...options };
        this.overlay           = null;
        this.container         = null;
        this.modal             = null;
        this.confirmBtn        = null;
        this.cancelBtn         = null;
        this.denyBtn           = null;
        this.inputElement      = null;
        this.progressBar       = null;
        this.validationMsg     = null;
        this.isClosed          = false;
        this._escHandler       = null;
        this._focusTrapCleanup = null;

        this.promise = new Promise((resolve) => { this._resolve = resolve; });
        this._init();
    }

    /* ─────────────────────────────────────────────────────── */
    /*  Bootstrap                                              */
    /* ─────────────────────────────────────────────────────── */

    _init() {
        if (this.options.toast) {
            createToast(this);
            return;
        }

        saveActiveElement();
        lockBodyScroll();

        // Overlay
        this.overlay = createElement('div', 'royal-alert-overlay');
        this.overlay.setAttribute('aria-hidden', 'true');

        const theme = this.options.theme || globalConfig.theme;
        if (theme && theme !== 'light') {
            this.overlay.setAttribute('data-theme', theme);
        }

        if (this.options.backdrop) {
            this.overlay.style.background = this.options.backdrop;
        }

        // Container (accessible dialog wrapper)
        this.container = createElement('div', 'royal-alert-container');
        this.container.setAttribute('role', 'dialog');
        this.container.setAttribute('aria-modal', 'true');
        this.container.setAttribute('tabindex', '-1');

        if (this.options.customClass) {
            addClass(this.container, this.options.customClass);
        }

        // Modal card
        this.modal = createElement('div', 'royal-alert-modal');

        const anim = this.options.animation || globalConfig.animation || 'scale';
        addClass(this.modal, `royal-alert-anim-${anim}`);

        if (this.options.width)    this.modal.style.width    = _px(this.options.width);
        if (this.options.maxWidth) this.modal.style.maxWidth = _px(this.options.maxWidth);

        this._buildHeader();
        this._buildBody();
        this._buildActions();
        this._buildFooter();

        this.container.appendChild(this.modal);
        this.overlay.appendChild(this.container);
        document.body.appendChild(this.overlay);

        this._bindEvents();
        this._focusTrapCleanup = trapFocus(this.container);

        // Trigger entrance animation in next paint
        requestAnimationFrame(() => {
            addClass(this.overlay, 'royal-alert-show');
            addClass(this.modal,   'royal-alert-show');
            this._setFocus();

            if (typeof this.options.afterOpen === 'function') this.options.afterOpen(this);
            if (typeof this.options.onOpen    === 'function') this.options.onOpen(this);
        });

        // Auto-close timer
        if (this.options.autoClose && this.options.duration > 0) {
            this._closeTimer = setTimeout(() => this.close(), this.options.duration);
        }

        activeInstances.push(this);
    }

    /* ─────────────────────────────────────────────────────── */
    /*  Build helpers                                          */
    /* ─────────────────────────────────────────────────────── */

    _buildHeader() {
        const { title, icon, imageUrl, closeButton } = this.options;
        if (!title && !icon && !imageUrl && !closeButton) return;

        const hdr = createElement('div', 'royal-alert-header');

        // Custom image
        if (imageUrl) {
            const img = createElement('img', 'royal-alert-image');
            img.src   = imageUrl;
            img.alt   = this.options.imageAlt || '';
            if (this.options.imageWidth)  img.style.width  = _px(this.options.imageWidth);
            if (this.options.imageHeight) img.style.height = _px(this.options.imageHeight);
            if (this.options.imageClass)  addClass(img, this.options.imageClass);
            hdr.appendChild(img);
        }
        // Icon circle
        else if (icon) {
            const wrap = createElement('div', `royal-alert-icon royal-alert-icon-${icon}-wrap`);
            wrap.innerHTML = getIcon(icon) || '';
            hdr.appendChild(wrap);
        }

        // Title
        if (title) {
            const h = createElement('h2', 'royal-alert-title');
            h.textContent = title;
            h.id = `ra-title-${Date.now()}`;
            this.container.setAttribute('aria-labelledby', h.id);
            hdr.appendChild(h);
        }

        // × close button
        if (closeButton) {
            const btn = createElement('button', 'royal-alert-close');
            btn.setAttribute('aria-label', 'Close dialog');
            btn.innerHTML = '&times;';
            btn.addEventListener('click', () => this.close({ cancelled: true, confirmed: false, denied: false, value: null }));
            hdr.appendChild(btn);
        }

        this.modal.appendChild(hdr);
    }

    _buildBody() {
        const { message, html, input, progress, timerProgressBar, duration } = this.options;
        const hasBody = message || html || input || (progress !== null && progress !== undefined) || timerProgressBar;
        if (!hasBody) return;

        const body = createElement('div', 'royal-alert-body');

        // HTML content (developer opt-in; warn about XSS)
        if (html) {
            const d = createElement('div', 'royal-alert-html');
            d.innerHTML = html;
            body.appendChild(d);
        }
        // Plain text (safe — uses textContent)
        else if (message) {
            const p = createElement('p', 'royal-alert-message');
            p.textContent = message;
            p.id = `ra-msg-${Date.now()}`;
            this.container.setAttribute('aria-describedby', p.id);
            body.appendChild(p);
        }

        // Input
        if (input) {
            const wrap = createElement('div', 'royal-alert-input-wrap');
            let el;

            if (this.options.inputType === 'textarea') {
                el = createElement('textarea', 'royal-alert-input');
            } else if (this.options.inputType === 'select') {
                el = createElement('select', 'royal-alert-input');
                if (Array.isArray(this.options.inputOptions)) {
                    this.options.inputOptions.forEach(([val, label]) => {
                        const opt = createElement('option');
                        opt.value       = val;
                        opt.textContent = label;
                        el.appendChild(opt);
                    });
                }
            } else {
                el = createElement('input', 'royal-alert-input');
                el.type = this.options.inputType || 'text';
            }

            if (this.options.inputPlaceholder) el.placeholder = this.options.inputPlaceholder;
            if (this.options.inputValue)       el.value       = this.options.inputValue;

            this.inputElement = el;
            wrap.appendChild(el);

            // Validation message container
            this.validationMsg = createElement('div', 'royal-alert-validation-message');
            this.validationMsg.setAttribute('aria-live', 'polite');
            wrap.appendChild(this.validationMsg);

            body.appendChild(wrap);
        }

        // Determinate progress bar
        if (progress !== null && progress !== undefined) {
            const wrap = createElement('div', 'royal-alert-progress-wrap');
            this.progressBar = createElement('div', 'royal-alert-progress-bar');
            this.progressBar.style.width = `${progress}%`;
            wrap.appendChild(this.progressBar);
            body.appendChild(wrap);
        }

        // Timer shrink bar
        if (timerProgressBar && duration > 0) {
            const wrap = createElement('div', 'royal-alert-timer-wrap');
            const bar  = createElement('div', 'royal-alert-timer-bar');
            bar.style.animationName     = 'ra-timer-shrink';
            bar.style.animationDuration = `${duration}ms`;
            bar.style.animationTimingFunction = 'linear';
            bar.style.animationFillMode       = 'forwards';
            wrap.appendChild(bar);
            body.appendChild(wrap);
        }

        this.modal.appendChild(body);
    }

    _buildActions() {
        const { buttons, showConfirmButton, showCancelButton, showDenyButton, reverseButtons } = this.options;
        const hasCustom = buttons && buttons.length > 0;
        if (!showConfirmButton && !showCancelButton && !showDenyButton && !hasCustom) return;

        const row = createElement('div', 'royal-alert-actions');
        if (reverseButtons) row.style.flexDirection = 'row-reverse';

        if (hasCustom) {
            buttons.forEach(cfg => {
                const btn = createElement('button', `royal-alert-btn royal-alert-btn-${cfg.type || 'primary'}`);
                btn.textContent = cfg.text;
                if (cfg.id)       btn.id       = cfg.id;
                if (cfg.disabled) btn.disabled = true;
                btn.addEventListener('click', () => {
                    if (typeof cfg.callback === 'function') cfg.callback(this);
                    if (cfg.closeAfterClick !== false) {
                        this.close({ confirmed: false, cancelled: false, denied: false, value: cfg.id || cfg.text });
                    }
                });
                row.appendChild(btn);
            });
        } else {
            // Cancel
            if (showCancelButton) {
                this.cancelBtn = createElement('button', 'royal-alert-btn royal-alert-btn-cancel');
                this.cancelBtn.textContent = this.options.cancelText;
                this.cancelBtn.addEventListener('click', () =>
                    this.close({ confirmed: false, cancelled: true, denied: false, value: null }));
                row.appendChild(this.cancelBtn);
            }

            // Deny
            if (showDenyButton) {
                this.denyBtn = createElement('button', 'royal-alert-btn royal-alert-btn-danger');
                this.denyBtn.textContent = this.options.denyText;
                this.denyBtn.addEventListener('click', () =>
                    this.close({ confirmed: false, cancelled: false, denied: true, value: null }));
                row.appendChild(this.denyBtn);
            }

            // Confirm
            if (showConfirmButton) {
                this.confirmBtn = createElement('button', 'royal-alert-btn royal-alert-btn-confirm');
                this.confirmBtn.textContent = this.options.confirmText;
                this.confirmBtn.addEventListener('click', async () => {
                    const val = this.inputElement ? this.inputElement.value : true;

                    // Run async validator if provided
                    if (typeof this.options.inputValidator === 'function') {
                        this.confirmBtn.disabled = true;
                        addClass(this.confirmBtn, 'royal-alert-btn-loading');
                        try {
                            const err = await this.options.inputValidator(val);
                            if (err) {
                                this._showValidationError(err);
                                this.confirmBtn.disabled = false;
                                removeClass(this.confirmBtn, 'royal-alert-btn-loading');
                                return;
                            }
                        } catch (e) {
                            this.confirmBtn.disabled = false;
                            removeClass(this.confirmBtn, 'royal-alert-btn-loading');
                            return;
                        }
                    }

                    this.close({ confirmed: true, cancelled: false, denied: false, value: val });
                });
                row.appendChild(this.confirmBtn);
            }
        }

        this.modal.appendChild(row);
    }

    _buildFooter() {
        if (!this.options.footer) return;
        const footer = createElement('div', 'royal-alert-footer');
        footer.innerHTML = this.options.footer;
        this.modal.appendChild(footer);
    }

    /* ─────────────────────────────────────────────────────── */
    /*  Event binding                                          */
    /* ─────────────────────────────────────────────────────── */

    _bindEvents() {
        this._escHandler = (e) => {
            if (e.key === 'Escape' && this.options.closeOnEscape !== false) {
                this.close({ confirmed: false, cancelled: true, denied: false, value: null });
            }
        };
        document.addEventListener('keydown', this._escHandler);

        if (this.options.closeOnOverlay !== false) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close({ confirmed: false, cancelled: true, denied: false, value: null });
                }
            });
        }
    }

    /* ─────────────────────────────────────────────────────── */
    /*  Focus management                                       */
    /* ─────────────────────────────────────────────────────── */

    _setFocus() {
        const firstInput = this.modal.querySelector('input, textarea, select');
        if (firstInput)                                    { firstInput.focus();       return; }
        if (this.options.focusCancel  && this.cancelBtn)  { this.cancelBtn.focus();   return; }
        if (this.options.focusDeny    && this.denyBtn)    { this.denyBtn.focus();     return; }
        if (this.options.focusConfirm !== false && this.confirmBtn) { this.confirmBtn.focus(); return; }
        this.container.focus();
    }

    /* ─────────────────────────────────────────────────────── */
    /*  Public API                                             */
    /* ─────────────────────────────────────────────────────── */

    /**
     * Live-update title, message, or progress without closing the dialog.
     * @param {Object} opts
     */
    update(opts) {
        if (this.isClosed) return;
        Object.assign(this.options, opts);

        if ('title' in opts) {
            const el = this.modal.querySelector('.royal-alert-title');
            if (el) el.textContent = opts.title;
        }
        if ('message' in opts) {
            const el = this.modal.querySelector('.royal-alert-message');
            if (el) el.textContent = opts.message;
        }
        if ('html' in opts) {
            const el = this.modal.querySelector('.royal-alert-html');
            if (el) el.innerHTML = opts.html;
        }
        if ('progress' in opts && this.progressBar) {
            this.progressBar.style.width = `${opts.progress}%`;
        }
        if ('confirmText' in opts && this.confirmBtn) {
            this.confirmBtn.textContent = opts.confirmText;
        }
    }

    /**
     * Close the dialog and resolve the promise.
     * @param {{ confirmed, cancelled, denied, value }} result
     */
    close(result = { confirmed: false, cancelled: true, denied: false, value: null }) {
        if (this.isClosed) return;
        this.isClosed = true;

        // Normalise result object
        result = {
            confirmed: false,
            cancelled: false,
            denied:    false,
            value:     null,
            ...result
        };

        clearTimeout(this._closeTimer);

        try { document.removeEventListener('keydown', this._escHandler); } catch (_) {}
        try { if (this._focusTrapCleanup) this._focusTrapCleanup(); } catch (_) {}

        // ── Toast close path ─────────────────────────────────
        if (this.options.toast) {
            const el = this.container; // toast sets this.container to the toast element
            if (!el) { this._cleanup(result); return; }
            removeClass(el, 'royal-alert-toast-show');
            addClass(el, 'royal-alert-toast-hide');
            setTimeout(() => { removeElement(el); this._cleanup(result); }, 350);
            return;
        }

        // ── Modal close path ─────────────────────────────────
        if (!this.overlay) { this._cleanup(result); return; }

        this.overlay.style.pointerEvents = 'none';
        removeClass(this.overlay, 'royal-alert-show');
        removeClass(this.modal,   'royal-alert-show');
        addClass(this.overlay,    'royal-alert-hide');
        addClass(this.modal,      'royal-alert-hide');

        setTimeout(() => {
            removeElement(this.overlay);
            unlockBodyScroll();
            restoreActiveElement();
            this._cleanup(result);
        }, 320);
    }

    _cleanup(result) {
        activeInstances = activeInstances.filter(i => i !== this);
        this._focusTrapCleanup = null;

        try {
            if (typeof this.options.onClose   === 'function') this.options.onClose(result);
            if (typeof this.options.onResult  === 'function') this.options.onResult(result);
            if (result.confirmed && typeof this.options.onConfirm === 'function') this.options.onConfirm(result.value);
            if (result.cancelled && typeof this.options.onCancel  === 'function') this.options.onCancel();
            if (result.denied    && typeof this.options.onDeny    === 'function') this.options.onDeny();
        } catch (e) {
            console.warn('[RoyalAlert] Callback error:', e);
        }

        if (this._resolve) this._resolve(result);
    }

    _showValidationError(msg) {
        if (!this.validationMsg) return;
        this.validationMsg.textContent = msg;
        this.validationMsg.style.display = 'block';
        if (this.inputElement) {
            addClass(this.inputElement, 'royal-alert-input-error');
            // Remove error class after shake
            setTimeout(() => removeClass(this.inputElement, 'royal-alert-input-error'), 600);
            this.inputElement.focus();
        }
    }
}

/* ─── Module-level helpers ─────────────────────────────────── */

export function getActiveInstances() { return activeInstances; }

export function closeAll() {
    [...activeInstances].forEach(i => i.close({ confirmed: false, cancelled: true, denied: false, value: null }));
}

/* private */
function _px(v) { return typeof v === 'number' ? `${v}px` : v; }
