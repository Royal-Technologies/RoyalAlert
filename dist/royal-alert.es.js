var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const defaultGlobalConfig = {
  position: "bottom-left",
  duration: 3e3,
  closeOnEscape: true,
  closeOnOverlay: true,
  theme: "light",
  animation: "scale"
};
const defaultOptions = {
  type: "info",
  title: "",
  message: "",
  html: "",
  icon: "",
  imageUrl: null,
  imageWidth: null,
  imageHeight: null,
  imageAlt: "Custom image",
  imageClass: "",
  footer: null,
  showConfirmButton: true,
  showCancelButton: false,
  showDenyButton: false,
  confirmText: "OK",
  cancelText: "Cancel",
  denyText: "No",
  reverseButtons: false,
  focusConfirm: true,
  focusCancel: false,
  focusDeny: false,
  closeButton: false,
  closeOnOverlay: null,
  closeOnEscape: null,
  autoClose: false,
  duration: null,
  timerProgressBar: false,
  position: null,
  width: null,
  maxWidth: null,
  animation: null,
  theme: null,
  backdrop: null,
  buttons: [],
  input: false,
  inputType: "text",
  inputPlaceholder: "",
  inputValue: "",
  inputOptions: [],
  inputValidator: null,
  loading: false,
  progress: null,
  customClass: "",
  onOpen: null,
  onClose: null,
  onConfirm: null,
  onCancel: null,
  onDeny: null,
  onResult: null,
  beforeOpen: null,
  afterOpen: null
};
let globalConfig = __spreadValues({}, defaultGlobalConfig);
function setGlobalConfig(config) {
  globalConfig = __spreadValues(__spreadValues({}, globalConfig), config);
}
function createElement(tag, className = "", attrs = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "html") el.innerHTML = value;
    else if (key === "text") el.textContent = value;
    else el.setAttribute(key, value);
  }
  return el;
}
function removeElement(el) {
  if (el && el.parentNode) el.parentNode.removeChild(el);
}
function addClass(el, className) {
  if (el && className) {
    className.split(" ").filter(Boolean).forEach((c) => el.classList.add(c));
  }
}
function removeClass(el, className) {
  if (el && className) {
    className.split(" ").filter(Boolean).forEach((c) => el.classList.remove(c));
  }
}
function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}
function lockBodyScroll() {
  if (!document.body.hasAttribute("data-ra-locked")) {
    const w = getScrollbarWidth();
    document.body.style.setProperty("--ra-scrollbar-w", `${w}px`);
    document.body.setAttribute("data-ra-locked", "true");
  }
}
function unlockBodyScroll() {
  const remaining = document.querySelectorAll(".royal-alert-overlay").length;
  if (remaining === 0) {
    document.body.removeAttribute("data-ra-locked");
    document.body.style.removeProperty("--ra-scrollbar-w");
  }
}
const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  'input:not([type="hidden"]):not([disabled])',
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function trapFocus(element) {
  const handler = (e) => {
    if (e.key !== "Tab") return;
    const nodes = [...element.querySelectorAll(FOCUSABLE)].filter((n) => !n.closest("[disabled]"));
    if (!nodes.length) {
      e.preventDefault();
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  };
  element.addEventListener("keydown", handler);
  return () => element.removeEventListener("keydown", handler);
}
let _previousFocus = null;
function saveActiveElement() {
  _previousFocus = document.activeElement;
}
function restoreActiveElement() {
  try {
    if (_previousFocus && typeof _previousFocus.focus === "function") {
      _previousFocus.focus({ preventScroll: true });
    }
  } catch (_) {
  }
}
const SVG = (path) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="royal-alert-icon-svg" aria-hidden="true">${path}</svg>`;
const icons = {
  success: SVG(`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`),
  error: SVG(`<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>`),
  warning: SVG(`<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`),
  info: SVG(`<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`),
  question: SVG(`<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>`),
  loading: SVG(`<line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>`)
};
function getIcon(type) {
  return icons[type] || "";
}
const _containers = {};
function _getContainer(position) {
  if (!_containers[position]) {
    const el = createElement(
      "div",
      `royal-alert-toast-container royal-alert-toast-${position}`
    );
    document.body.appendChild(el);
    _containers[position] = el;
  }
  return _containers[position];
}
function createToast(instance) {
  const { options } = instance;
  const position = options.position || "top-right";
  const container = _getContainer(position);
  const toast = createElement("div", "royal-alert-toast");
  toast.setAttribute("role", options.type === "error" ? "alert" : "status");
  toast.setAttribute("aria-live", options.type === "error" ? "assertive" : "polite");
  toast.setAttribute("aria-atomic", "true");
  if (options.type) toast.setAttribute("data-type", options.type);
  if (options.theme && options.theme !== "light") toast.setAttribute("data-theme", options.theme);
  if (options.customClass) addClass(toast, options.customClass);
  if (options.icon || options.type) {
    const iconKey = options.icon || options.type;
    const svg = getIcon(iconKey);
    if (svg) {
      const iconEl = createElement("div", "royal-alert-toast-icon");
      iconEl.innerHTML = svg;
      toast.appendChild(iconEl);
    }
  }
  const content = createElement("div", "royal-alert-toast-content");
  if (options.title) {
    const titleEl = createElement("div", "royal-alert-toast-title");
    titleEl.textContent = options.title;
    content.appendChild(titleEl);
  }
  if (options.html) {
    const msgEl = createElement("div", "royal-alert-toast-message");
    msgEl.innerHTML = options.html;
    content.appendChild(msgEl);
  } else if (options.message) {
    const msgEl = createElement("div", "royal-alert-toast-message");
    msgEl.textContent = options.message;
    content.appendChild(msgEl);
  }
  toast.appendChild(content);
  if (options.closeButton !== false) {
    const closeBtn = createElement("button", "royal-alert-toast-close");
    closeBtn.setAttribute("aria-label", "Dismiss notification");
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", () => instance.close());
    toast.appendChild(closeBtn);
  }
  const duration = options.duration;
  if (duration > 0) {
    const wrap = createElement("div", "royal-alert-toast-progress-wrap");
    const bar = createElement("div", "royal-alert-toast-progress-bar");
    bar.style.animationName = "ra-toast-progress";
    bar.style.animationDuration = `${duration}ms`;
    bar.style.animationTimingFunction = "linear";
    bar.style.animationFillMode = "forwards";
    wrap.appendChild(bar);
    toast.appendChild(wrap);
    instance._progressBar = bar;
  }
  if (position.startsWith("bottom")) {
    container.prepend(toast);
  } else {
    container.appendChild(toast);
  }
  instance.container = toast;
  if (duration > 0) {
    let remaining = duration;
    let startedAt = Date.now();
    const _start = () => {
      instance._closeTimer = setTimeout(() => instance.close(), remaining);
      if (instance._progressBar) {
        instance._progressBar.style.animationPlayState = "running";
      }
    };
    const _pause = () => {
      clearTimeout(instance._closeTimer);
      remaining -= Date.now() - startedAt;
      remaining = Math.max(0, remaining);
      if (instance._progressBar) {
        instance._progressBar.style.animationPlayState = "paused";
      }
    };
    const _resume = () => {
      startedAt = Date.now();
      _start();
    };
    toast.addEventListener("mouseenter", _pause);
    toast.addEventListener("mouseleave", _resume);
    toast.addEventListener("focusin", _pause);
    toast.addEventListener("focusout", _resume);
    _start();
  }
  if (typeof options.onClick === "function") {
    toast.style.cursor = "pointer";
    toast.addEventListener("click", (e) => {
      if (e.target.closest(".royal-alert-toast-close")) return;
      options.onClick(instance);
    });
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      addClass(toast, "royal-alert-toast-show");
    });
  });
  return instance;
}
let activeInstances = [];
class RoyalAlertInstance {
  constructor(options) {
    this.options = __spreadValues(__spreadValues(__spreadValues({}, defaultOptions), globalConfig), options);
    this.overlay = null;
    this.container = null;
    this.modal = null;
    this.confirmBtn = null;
    this.cancelBtn = null;
    this.denyBtn = null;
    this.inputElement = null;
    this.progressBar = null;
    this.validationMsg = null;
    this.isClosed = false;
    this._escHandler = null;
    this._focusTrapCleanup = null;
    this.promise = new Promise((resolve) => {
      this._resolve = resolve;
    });
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
    this.overlay = createElement("div", "royal-alert-overlay");
    this.overlay.setAttribute("aria-hidden", "true");
    const theme = this.options.theme || globalConfig.theme;
    if (theme && theme !== "light") {
      this.overlay.setAttribute("data-theme", theme);
    }
    if (this.options.backdrop) {
      this.overlay.style.background = this.options.backdrop;
    }
    this.container = createElement("div", "royal-alert-container");
    this.container.setAttribute("role", "dialog");
    this.container.setAttribute("aria-modal", "true");
    this.container.setAttribute("tabindex", "-1");
    if (this.options.customClass) {
      addClass(this.container, this.options.customClass);
    }
    this.modal = createElement("div", "royal-alert-modal");
    const anim = this.options.animation || globalConfig.animation || "scale";
    addClass(this.modal, `royal-alert-anim-${anim}`);
    if (this.options.width) this.modal.style.width = _px(this.options.width);
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
    requestAnimationFrame(() => {
      addClass(this.overlay, "royal-alert-show");
      addClass(this.modal, "royal-alert-show");
      this._setFocus();
      if (typeof this.options.afterOpen === "function") this.options.afterOpen(this);
      if (typeof this.options.onOpen === "function") this.options.onOpen(this);
    });
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
    const hdr = createElement("div", "royal-alert-header");
    if (imageUrl) {
      const img = createElement("img", "royal-alert-image");
      img.src = imageUrl;
      img.alt = this.options.imageAlt || "";
      if (this.options.imageWidth) img.style.width = _px(this.options.imageWidth);
      if (this.options.imageHeight) img.style.height = _px(this.options.imageHeight);
      if (this.options.imageClass) addClass(img, this.options.imageClass);
      hdr.appendChild(img);
    } else if (icon) {
      const wrap = createElement("div", `royal-alert-icon royal-alert-icon-${icon}-wrap`);
      wrap.innerHTML = getIcon(icon) || "";
      hdr.appendChild(wrap);
    }
    if (title) {
      const h = createElement("h2", "royal-alert-title");
      h.textContent = title;
      h.id = `ra-title-${Date.now()}`;
      this.container.setAttribute("aria-labelledby", h.id);
      hdr.appendChild(h);
    }
    if (closeButton) {
      const btn = createElement("button", "royal-alert-close");
      btn.setAttribute("aria-label", "Close dialog");
      btn.innerHTML = "&times;";
      btn.addEventListener("click", () => this.close({ cancelled: true, confirmed: false, denied: false, value: null }));
      hdr.appendChild(btn);
    }
    this.modal.appendChild(hdr);
  }
  _buildBody() {
    const { message, html, input, progress, timerProgressBar, duration } = this.options;
    const hasBody = message || html || input || progress !== null && progress !== void 0 || timerProgressBar;
    if (!hasBody) return;
    const body = createElement("div", "royal-alert-body");
    if (html) {
      const d = createElement("div", "royal-alert-html");
      d.innerHTML = html;
      body.appendChild(d);
    } else if (message) {
      const p = createElement("p", "royal-alert-message");
      p.textContent = message;
      p.id = `ra-msg-${Date.now()}`;
      this.container.setAttribute("aria-describedby", p.id);
      body.appendChild(p);
    }
    if (input) {
      const wrap = createElement("div", "royal-alert-input-wrap");
      let el;
      if (this.options.inputType === "textarea") {
        el = createElement("textarea", "royal-alert-input");
      } else if (this.options.inputType === "select") {
        el = createElement("select", "royal-alert-input");
        if (Array.isArray(this.options.inputOptions)) {
          this.options.inputOptions.forEach(([val, label]) => {
            const opt = createElement("option");
            opt.value = val;
            opt.textContent = label;
            el.appendChild(opt);
          });
        }
      } else {
        el = createElement("input", "royal-alert-input");
        el.type = this.options.inputType || "text";
      }
      if (this.options.inputPlaceholder) el.placeholder = this.options.inputPlaceholder;
      if (this.options.inputValue) el.value = this.options.inputValue;
      this.inputElement = el;
      wrap.appendChild(el);
      this.validationMsg = createElement("div", "royal-alert-validation-message");
      this.validationMsg.setAttribute("aria-live", "polite");
      wrap.appendChild(this.validationMsg);
      body.appendChild(wrap);
    }
    if (progress !== null && progress !== void 0) {
      const wrap = createElement("div", "royal-alert-progress-wrap");
      this.progressBar = createElement("div", "royal-alert-progress-bar");
      this.progressBar.style.width = `${progress}%`;
      wrap.appendChild(this.progressBar);
      body.appendChild(wrap);
    }
    if (timerProgressBar && duration > 0) {
      const wrap = createElement("div", "royal-alert-timer-wrap");
      const bar = createElement("div", "royal-alert-timer-bar");
      bar.style.animationName = "ra-timer-shrink";
      bar.style.animationDuration = `${duration}ms`;
      bar.style.animationTimingFunction = "linear";
      bar.style.animationFillMode = "forwards";
      wrap.appendChild(bar);
      body.appendChild(wrap);
    }
    this.modal.appendChild(body);
  }
  _buildActions() {
    const { buttons, showConfirmButton, showCancelButton, showDenyButton, reverseButtons } = this.options;
    const hasCustom = buttons && buttons.length > 0;
    if (!showConfirmButton && !showCancelButton && !showDenyButton && !hasCustom) return;
    const row = createElement("div", "royal-alert-actions");
    if (reverseButtons) row.style.flexDirection = "row-reverse";
    if (hasCustom) {
      buttons.forEach((cfg) => {
        const btn = createElement("button", `royal-alert-btn royal-alert-btn-${cfg.type || "primary"}`);
        btn.textContent = cfg.text;
        if (cfg.id) btn.id = cfg.id;
        if (cfg.disabled) btn.disabled = true;
        btn.addEventListener("click", () => {
          if (typeof cfg.callback === "function") cfg.callback(this);
          if (cfg.closeAfterClick !== false) {
            this.close({ confirmed: false, cancelled: false, denied: false, value: cfg.id || cfg.text });
          }
        });
        row.appendChild(btn);
      });
    } else {
      if (showCancelButton) {
        this.cancelBtn = createElement("button", "royal-alert-btn royal-alert-btn-cancel");
        this.cancelBtn.textContent = this.options.cancelText;
        this.cancelBtn.addEventListener("click", () => this.close({ confirmed: false, cancelled: true, denied: false, value: null }));
        row.appendChild(this.cancelBtn);
      }
      if (showDenyButton) {
        this.denyBtn = createElement("button", "royal-alert-btn royal-alert-btn-danger");
        this.denyBtn.textContent = this.options.denyText;
        this.denyBtn.addEventListener("click", () => this.close({ confirmed: false, cancelled: false, denied: true, value: null }));
        row.appendChild(this.denyBtn);
      }
      if (showConfirmButton) {
        this.confirmBtn = createElement("button", "royal-alert-btn royal-alert-btn-confirm");
        this.confirmBtn.textContent = this.options.confirmText;
        this.confirmBtn.addEventListener("click", () => __async(this, null, function* () {
          const val = this.inputElement ? this.inputElement.value : true;
          if (typeof this.options.inputValidator === "function") {
            this.confirmBtn.disabled = true;
            addClass(this.confirmBtn, "royal-alert-btn-loading");
            try {
              const err = yield this.options.inputValidator(val);
              if (err) {
                this._showValidationError(err);
                this.confirmBtn.disabled = false;
                removeClass(this.confirmBtn, "royal-alert-btn-loading");
                return;
              }
            } catch (e) {
              this.confirmBtn.disabled = false;
              removeClass(this.confirmBtn, "royal-alert-btn-loading");
              return;
            }
          }
          this.close({ confirmed: true, cancelled: false, denied: false, value: val });
        }));
        row.appendChild(this.confirmBtn);
      }
    }
    this.modal.appendChild(row);
  }
  _buildFooter() {
    if (!this.options.footer) return;
    const footer = createElement("div", "royal-alert-footer");
    footer.innerHTML = this.options.footer;
    this.modal.appendChild(footer);
  }
  /* ─────────────────────────────────────────────────────── */
  /*  Event binding                                          */
  /* ─────────────────────────────────────────────────────── */
  _bindEvents() {
    this._escHandler = (e) => {
      if (e.key === "Escape" && this.options.closeOnEscape !== false) {
        this.close({ confirmed: false, cancelled: true, denied: false, value: null });
      }
    };
    document.addEventListener("keydown", this._escHandler);
    if (this.options.closeOnOverlay !== false) {
      this.overlay.addEventListener("click", (e) => {
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
    const firstInput = this.modal.querySelector("input, textarea, select");
    if (firstInput) {
      firstInput.focus();
      return;
    }
    if (this.options.focusCancel && this.cancelBtn) {
      this.cancelBtn.focus();
      return;
    }
    if (this.options.focusDeny && this.denyBtn) {
      this.denyBtn.focus();
      return;
    }
    if (this.options.focusConfirm !== false && this.confirmBtn) {
      this.confirmBtn.focus();
      return;
    }
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
    if ("title" in opts) {
      const el = this.modal.querySelector(".royal-alert-title");
      if (el) el.textContent = opts.title;
    }
    if ("message" in opts) {
      const el = this.modal.querySelector(".royal-alert-message");
      if (el) el.textContent = opts.message;
    }
    if ("html" in opts) {
      const el = this.modal.querySelector(".royal-alert-html");
      if (el) el.innerHTML = opts.html;
    }
    if ("progress" in opts && this.progressBar) {
      this.progressBar.style.width = `${opts.progress}%`;
    }
    if ("confirmText" in opts && this.confirmBtn) {
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
    result = __spreadValues({
      confirmed: false,
      cancelled: false,
      denied: false,
      value: null
    }, result);
    clearTimeout(this._closeTimer);
    try {
      document.removeEventListener("keydown", this._escHandler);
    } catch (_) {
    }
    try {
      if (this._focusTrapCleanup) this._focusTrapCleanup();
    } catch (_) {
    }
    if (this.options.toast) {
      const el = this.container;
      if (!el) {
        this._cleanup(result);
        return;
      }
      removeClass(el, "royal-alert-toast-show");
      addClass(el, "royal-alert-toast-hide");
      setTimeout(() => {
        removeElement(el);
        this._cleanup(result);
      }, 350);
      return;
    }
    if (!this.overlay) {
      this._cleanup(result);
      return;
    }
    this.overlay.style.pointerEvents = "none";
    removeClass(this.overlay, "royal-alert-show");
    removeClass(this.modal, "royal-alert-show");
    addClass(this.overlay, "royal-alert-hide");
    addClass(this.modal, "royal-alert-hide");
    setTimeout(() => {
      removeElement(this.overlay);
      unlockBodyScroll();
      restoreActiveElement();
      this._cleanup(result);
    }, 320);
  }
  _cleanup(result) {
    activeInstances = activeInstances.filter((i) => i !== this);
    this._focusTrapCleanup = null;
    try {
      if (typeof this.options.onClose === "function") this.options.onClose(result);
      if (typeof this.options.onResult === "function") this.options.onResult(result);
      if (result.confirmed && typeof this.options.onConfirm === "function") this.options.onConfirm(result.value);
      if (result.cancelled && typeof this.options.onCancel === "function") this.options.onCancel();
      if (result.denied && typeof this.options.onDeny === "function") this.options.onDeny();
    } catch (e) {
      console.warn("[RoyalAlert] Callback error:", e);
    }
    if (this._resolve) this._resolve(result);
  }
  _showValidationError(msg) {
    if (!this.validationMsg) return;
    this.validationMsg.textContent = msg;
    this.validationMsg.style.display = "block";
    if (this.inputElement) {
      addClass(this.inputElement, "royal-alert-input-error");
      setTimeout(() => removeClass(this.inputElement, "royal-alert-input-error"), 600);
      this.inputElement.focus();
    }
  }
}
function getActiveInstances() {
  return activeInstances;
}
function closeAll() {
  [...activeInstances].forEach((i) => i.close({ confirmed: false, cancelled: true, denied: false, value: null }));
}
function _px(v) {
  return typeof v === "number" ? `${v}px` : v;
}
const RoyalAlert = {
  fire(options) {
    if (typeof options === "string") {
      options = { message: options };
    }
    const instance = new RoyalAlertInstance(options);
    return instance.promise;
  },
  success(message) {
    return this.fire({ type: "success", icon: "success", message });
  },
  error(message) {
    return this.fire({ type: "error", icon: "error", message });
  },
  warning(message) {
    return this.fire({ type: "warning", icon: "warning", message });
  },
  info(message) {
    return this.fire({ type: "info", icon: "info", message });
  },
  loading(message = "Loading...") {
    return this.fire({
      type: "loading",
      icon: "loading",
      message,
      showConfirmButton: false,
      closeOnEscape: false,
      closeOnOverlay: false
    });
  },
  toast(options) {
    if (typeof options === "string") {
      options = { message: options };
    }
    return this.fire(__spreadValues({
      toast: true,
      duration: 3e3,
      showConfirmButton: false,
      closeButton: true
    }, options));
  },
  confirm(options) {
    if (typeof options === "string") {
      options = { title: options };
    }
    return this.fire(__spreadValues({
      type: "question",
      icon: "question",
      showCancelButton: true
    }, options));
  },
  prompt(options) {
    return this.fire(__spreadValues({
      input: true,
      showCancelButton: true
    }, options));
  },
  modal(options) {
    return this.fire(__spreadValues({}, options));
  },
  progress(options) {
    return this.fire(__spreadValues({
      progress: 0,
      showConfirmButton: false,
      closeOnEscape: false,
      closeOnOverlay: false
    }, options));
  },
  async(options) {
    return __async(this, null, function* () {
      const _a = options, { action, successMessage, errorMessage, title } = _a, rest = __objRest(_a, ["action", "successMessage", "errorMessage", "title"]);
      const self = this;
      const instance = new RoyalAlertInstance(__spreadValues({
        type: "loading",
        icon: "loading",
        title: title || "Please wait…",
        showConfirmButton: false,
        closeOnEscape: false,
        closeOnOverlay: false
      }, rest));
      try {
        const result = yield Promise.resolve(action());
        instance.close({ confirmed: false, cancelled: true, denied: false, value: null });
        setTimeout(() => self.success(successMessage || "Operation completed!"), 350);
        return result;
      } catch (error) {
        instance.close({ confirmed: false, cancelled: true, denied: false, value: null });
        setTimeout(() => self.error(errorMessage || error.message || "An error occurred."), 350);
        throw error;
      }
    });
  },
  request(options) {
    const { url, method = "GET", data, loadingMessage, successMessage, errorMessage, headers = {} } = options;
    return this.async({
      title: loadingMessage || "Loading...",
      action: () => __async(this, null, function* () {
        const fetchOptions = {
          method,
          headers: __spreadValues({
            "Content-Type": "application/json"
          }, headers)
        };
        if (data && method !== "GET") {
          fetchOptions.body = JSON.stringify(data);
        }
        const response = yield fetch(url, fetchOptions);
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        return yield response.json();
      }),
      successMessage,
      errorMessage
    });
  },
  update(options) {
    const instances = getActiveInstances();
    if (instances.length > 0) {
      instances[instances.length - 1].update(options);
    }
  },
  close() {
    const instances = getActiveInstances();
    if (instances.length > 0) {
      instances[instances.length - 1].close();
    }
  },
  closeAll() {
    closeAll();
  },
  isOpen() {
    return getActiveInstances().length > 0;
  },
  getInstance() {
    const instances = getActiveInstances();
    return instances.length > 0 ? instances[instances.length - 1] : null;
  },
  config(options) {
    setGlobalConfig(options);
  }
};
if (typeof window !== "undefined") {
  window.RoyalAlert = RoyalAlert;
}
export {
  RoyalAlert as default
};
