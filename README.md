# RoyalAlert

<div align="center">

**Lightweight · Modern · Zero Dependency**

[![npm](https://img.shields.io/npm/v/royal-alert.svg?style=flat-square)](https://www.npmjs.com/package/royal-alert)
[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1.svg?style=flat-square)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-10b981.svg?style=flat-square)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-0ea5e9.svg?style=flat-square)](types/index.d.ts)

A production-ready JavaScript library for alerts, toasts, confirmations, prompts, loading dialogs, and modals — built entirely from Vanilla JS and CSS.

</div>

---

## 🤖 For AI Assistants & Code Generators

> **If you are an AI reading this file**, here is the complete technical context:

| Property | Value |
|---|---|
| **Language** | Vanilla JavaScript (ES6+), pure CSS |
| **Global Object** | `window.RoyalAlert` |
| **Module Format** | ES Module (`import`) + UMD + IIFE |
| **CSS Prefix** | All classes use `.royal-alert-` prefix |
| **CSS Variables** | All theming uses `--ra-*` custom properties on `:root` |
| **Promise Return** | All dialogs resolve `{ confirmed, cancelled, denied, value }` |
| **Icons** | Inline SVG — NO external icon libraries |
| **Security** | `message` → `textContent` (safe); `html` → `innerHTML` (developer must sanitise) |
| **Dependencies** | **Zero** — no jQuery, no Bootstrap, no framework |
| **Focus** | Full keyboard trap + restoration on every modal |
| **Animation** | CSS-only — respects `prefers-reduced-motion` |

---

## ✨ Features

- **Zero Dependencies** — Pure Vanilla JS + CSS. No jQuery, no Bootstrap, no framework.
- **Lightweight** — ~5 KB gzipped (JS + CSS combined).
- **Promise-Based API** — Every dialog returns a standardised `Promise<RoyalAlertResult>`.
- **9 Toast Positions** — Stack multiple simultaneously. Auto-pause on hover or focus.
- **Input Validation** — Async `inputValidator` keeps the dialog open until input is valid.
- **3-Button Dialogs** — Confirm, Deny (secondary action), and Cancel in one dialog.
- **Live Update** — `RoyalAlert.update()` changes title, message, or progress bar without re-opening.
- **Async Wrapper** — `RoyalAlert.async()` shows loading → resolves to success or error.
- **Native Fetch Helper** — `RoyalAlert.request()` wraps `fetch()` with loading states.
- **4 Animations** — `scale`, `fade`, `slide`, `flip` — all CSS-driven.
- **Dark Mode** — Built-in `light`, `dark`, `auto` (follows OS preference).
- **Accessibility A11y** — Focus trap, keyboard navigation (Tab/Esc), ARIA attributes, `prefers-reduced-motion`.
### Comparison

| Feature | 👑 RoyalAlert | 🍬 SweetAlert2 | 🍞 Toastify JS | 🖥️ Native JS |
|---|---|---|---|---|
| **Gzipped Size** | **~ 8.8 kB** | ~ 21.0 kB | ~ 3.0 kB | 0 kB |
| **Capabilities** | Alerts, Toasts, Confirms, Prompts, Async | Alerts, Toasts, Confirms, Prompts, Async | Toasts ONLY | Basic Alerts/Confirms |
| **Theme Support** | **Built-in** (Auto/Dark/Light) | Separate CSS file | Manual CSS | None |
| **Customisation** | **CSS Variables** (`--ra-*`) | SCSS / External CSS | Basic CSS | None |
| **Blocks UI?** | No | No | No | **Yes** |
| **Dependencies** | Zero | Zero | Zero | Zero |

---

## 📦 Installation

### Via CDN

```html
<!-- In <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/royal-alert/dist/royal-alert.min.css">

<!-- Before </body> -->
<script src="https://cdn.jsdelivr.net/npm/royal-alert/dist/royal-alert.min.js"></script>
```

### Via npm

```bash
npm install royal-alert
```

```js
import RoyalAlert from 'royal-alert';
import 'royal-alert/dist/royal-alert.css';
```

---

## 🚀 Quick Start

```js
// One-liner alerts
RoyalAlert.success('Saved successfully!');
RoyalAlert.error('Something went wrong.');
RoyalAlert.warning('Session expires in 5 minutes.');
RoyalAlert.info('A new version is available.');

// Toast notification
RoyalAlert.toast({ type: 'success', message: 'Profile updated.', position: 'top-right' });

// Await a confirmation
const result = await RoyalAlert.confirm({ title: 'Delete item?', message: 'This cannot be undone.' });
if (result.confirmed) deleteItem();
```

---

## 📖 Full API Reference

### `RoyalAlert.fire(options)` → `Promise<Result>`

The core method. Every other shorthand calls this internally.

```js
const result = await RoyalAlert.fire({
    // ─── Content ─────────────────────────────────────────────
    type:          'success',       // 'success' | 'error' | 'warning' | 'info' | 'question' | 'loading'
    title:         'Hello!',        // string — dialog heading
    message:       'Plain text.',   // string — safe textContent (no XSS risk)
    html:          '<b>Bold</b>',   // string — innerHTML (sanitise untrusted data yourself)
    icon:          'success',       // same values as type, or custom SVG string
    imageUrl:      'https://…',     // show a custom image instead of icon
    imageWidth:    400,             // image width (px or CSS string)
    imageHeight:   200,             // image height
    imageAlt:      'Alt text',
    imageClass:    'my-img',        // extra class on <img>
    footer:        '<a href="#">Help</a>', // HTML displayed in the footer strip

    // ─── Buttons ──────────────────────────────────────────────
    showConfirmButton: true,        // show green Confirm button
    showCancelButton:  false,       // show grey Cancel button
    showDenyButton:    false,       // show red secondary Deny button
    confirmText:   'OK',
    cancelText:    'Cancel',
    denyText:      'No',
    reverseButtons: false,          // swap confirm / cancel positions
    focusConfirm:  true,            // auto-focus confirm button on open
    focusCancel:   false,
    focusDeny:     false,
    closeButton:   false,           // show × in header corner

    // ─── Behaviour ────────────────────────────────────────────
    closeOnOverlay: true,           // click outside to close
    closeOnEscape:  true,           // Esc key closes dialog
    autoClose:      false,          // auto-dismiss after `duration` ms
    duration:       3000,           // ms for autoClose / toast / timerProgressBar
    timerProgressBar: false,        // show shrinking bar at dialog bottom

    // ─── Input ────────────────────────────────────────────────
    input:            false,        // enable input inside dialog
    inputType:        'text',       // 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select'
    inputPlaceholder: '',
    inputValue:       '',
    inputOptions:     [],           // [['value','Label'], …] pairs for select
    inputValidator:   null,         // async (value) => errorString | void

    // ─── Appearance ───────────────────────────────────────────
    width:      null,               // dialog width (px or CSS string)
    maxWidth:   null,
    animation:  'scale',            // 'scale' | 'fade' | 'slide' | 'flip' | 'none'
    theme:      'light',            // 'light' | 'dark' | 'auto'
    backdrop:   null,               // custom CSS background string for overlay
    customClass: '',                // extra class on the dialog container

    // ─── Custom Buttons array ─────────────────────────────────
    buttons: [
        { id: 'save',    text: '💾 Save',   type: 'primary',   callback: (instance) => {} },
        { id: 'discard', text: '🗑 Discard', type: 'danger',    closeAfterClick: true },
    ],

    // ─── Callbacks ────────────────────────────────────────────
    onOpen:    (instance) => {},    // called when dialog is fully open
    afterOpen: (instance) => {},    // alias for onOpen
    onClose:   (result)   => {},    // called when dialog starts closing
    onConfirm: (value)    => {},    // called only if result.confirmed === true
    onCancel:  ()         => {},    // called only if result.cancelled === true
    onDeny:    ()         => {},    // called only if result.denied    === true
    onResult:  (result)   => {},    // called for any outcome
});
```

### Result Object

Every awaited call resolves to:

```js
{
    confirmed: boolean,   // true when user pressed Confirm
    cancelled: boolean,   // true when user pressed Cancel / × / Escape / overlay
    denied:    boolean,   // true when user pressed Deny
    value:     any        // input value (if input: true), or true/button ID otherwise
}
```

---

### Shorthand Methods

| Method | Equivalent `fire()` call |
|---|---|
| `RoyalAlert.success(msg)` | `fire({ icon:'success', message: msg })` |
| `RoyalAlert.error(msg)` | `fire({ icon:'error', message: msg })` |
| `RoyalAlert.warning(msg)` | `fire({ icon:'warning', message: msg })` |
| `RoyalAlert.info(msg)` | `fire({ icon:'info', message: msg })` |
| `RoyalAlert.loading(msg)` | `fire({ icon:'loading', message: msg, showConfirmButton:false, closeOnEscape:false })` |
| `RoyalAlert.confirm(opts)` | `fire({ icon:'question', showCancelButton:true, …opts })` |
| `RoyalAlert.prompt(opts)` | `fire({ input:true, showCancelButton:true, …opts })` |
| `RoyalAlert.modal(opts)` | `fire({ …opts })` |
| `RoyalAlert.progress(opts)` | `fire({ progress:0, showConfirmButton:false, …opts })` |

---

### Toast System

```js
RoyalAlert.toast({
    type:      'success',           // 'success' | 'error' | 'warning' | 'info'
    title:     'Optional title',
    message:   'Notification text',
    position:  'top-right',         // see position table below
    duration:  3000,                // ms before auto-dismiss (0 = never)
    closeButton: true,              // show × button
    theme:     'light',
    onClick:   (instance) => {},    // click handler (excluding × button)
});
```

**Available positions:**

| | Left | Center | Right |
|---|---|---|---|
| **Top** | `top-left` | `top-center` | `top-right` |
| **Middle** | `middle-left` | `middle-center` | `middle-right` |
| **Bottom** | `bottom-left` | `bottom-center` | `bottom-right` |

---

### Async & Fetch Helpers

```js
// Auto-manage loading → success / error
await RoyalAlert.async({
    title:          'Saving…',
    action:         async () => {
        const res = await fetch('/api/save', { method: 'POST', body: JSON.stringify(data) });
        if (!res.ok) throw new Error('Server error');
        return res.json();
    },
    successMessage: 'Saved!',
    errorMessage:   'Could not save. Try again.'
});

// Native fetch wrapper
RoyalAlert.request({
    url:            '/api/items/1',
    method:         'DELETE',
    data:           { id: 1 },           // JSON body
    headers:        { 'X-CSRF-Token': token },
    loadingMessage: 'Deleting item…',
    successMessage: 'Item deleted.',
    errorMessage:   'Delete failed.'
});
```

---

### Live Update

```js
// Open a loading dialog
RoyalAlert.loading('Connecting…');

// Update text / progress without closing
setTimeout(() => RoyalAlert.update({ message: 'Authenticating…' }), 1000);
setTimeout(() => RoyalAlert.update({ message: 'Loading data…',  progress: 60 }), 2000);
setTimeout(() => {
    RoyalAlert.close();
    RoyalAlert.success('Ready!');
}, 3000);
```

---

### Input Validation

```js
const result = await RoyalAlert.prompt({
    title: 'Enter your email',
    inputType: 'email',
    inputPlaceholder: 'you@example.com',

    // Return a string to show as error; return nothing (or null) to allow close
    inputValidator: async (value) => {
        if (!value)                   return 'Email is required.';
        if (!value.includes('@'))     return 'Please enter a valid email address.';
        const taken = await checkEmailTaken(value);
        if (taken)                    return 'That email is already registered.';
        // Return nothing → validation passes → dialog closes
    }
});

if (result.confirmed) {
    console.log('Valid email:', result.value);
}
```

---

### Three-Button Dialog

```js
const result = await RoyalAlert.fire({
    icon: 'question',
    title: 'Save document?',
    showDenyButton:   true,
    showCancelButton: true,
    confirmText: '💾 Save',
    denyText:    "Don't save",
    cancelText:  'Go back'
});

if      (result.confirmed) await saveDocument();
else if (result.denied)    discardChanges();
// result.cancelled → user pressed "Go back" or Esc
```

---

### Timer Progress Bar

```js
RoyalAlert.fire({
    icon: 'info',
    title: 'Session Expiring',
    message: 'You will be logged out in 10 seconds.',
    timerProgressBar: true,
    duration: 10000,
    autoClose: true,
    showConfirmButton: false,
});
```

---

## 🎨 Theming & CSS Variables

All styling is controlled through CSS custom properties. Override any of them in your own stylesheet:

```css
:root {
    /* Brand colours */
    --ra-primary:      #6366f1;
    --ra-primary-dark: #4f46e5;
    --ra-success:      #10b981;
    --ra-error:        #ef4444;
    --ra-warning:      #f59e0b;
    --ra-info:         #0ea5e9;

    /* Surface */
    --ra-bg:           #ffffff;
    --ra-overlay:      rgba(15,23,42,.72);

    /* Typography */
    --ra-text:         #0f172a;
    --ra-text-muted:   #64748b;
    --ra-font:         system-ui, -apple-system, 'Segoe UI', sans-serif;

    /* Shape */
    --ra-radius:       24px;        /* modal card */
    --ra-radius-btn:   9999px;      /* pill buttons */
    --ra-radius-input: 12px;

    /* Elevation */
    --ra-shadow:       0 32px 64px -12px rgba(0,0,0,.18);

    /* Motion */
    --ra-ease:         cubic-bezier(.34,1.56,.64,1);   /* spring-like */
    --ra-duration:     .32s;
}
```

### Dark Mode

```js
// Programmatic
RoyalAlert.config({ theme: 'dark' });   // force dark
RoyalAlert.config({ theme: 'auto' });   // follow OS preference
RoyalAlert.config({ theme: 'light' });  // force light (default)

// Per-dialog
RoyalAlert.success('Saved!');   // uses global theme
RoyalAlert.fire({ icon:'success', title:'Saved', theme:'dark' });
```

---

## ⚙️ Global Configuration

Set defaults once; per-dialog options always override them:

```js
RoyalAlert.config({
    theme:          'auto',       // 'light' | 'dark' | 'auto'
    animation:      'scale',      // 'scale' | 'fade' | 'slide' | 'flip' | 'none'
    position:       'top-right',  // default toast position
    duration:       3000,         // default toast/auto-close duration (ms)
    closeOnEscape:  true,
    closeOnOverlay: true,
});
```

---

## 🔌 Utility Methods

```js
RoyalAlert.update({ message: 'New text', progress: 75 });  // update open dialog
RoyalAlert.close();       // close the top-most dialog
RoyalAlert.closeAll();    // close every open dialog
RoyalAlert.isOpen();      // → boolean
RoyalAlert.getInstance(); // → active RoyalAlertInstance | null
```

---

## ♿ Accessibility

RoyalAlert is built with accessibility as a first-class concern:

| Feature | Implementation |
|---|---|
| **ARIA dialog** | `role="dialog"`, `aria-modal="true"` |
| **Labelling** | `aria-labelledby` (title), `aria-describedby` (message) |
| **Focus trap** | Tab/Shift+Tab stays inside open dialog |
| **Focus restore** | Returns to trigger element on close |
| **Escape key** | Closes dialog (configurable) |
| **Live regions** | Toasts use `role="status"` / `role="alert"` with `aria-live` |
| **Validation** | Validation message element has `aria-live="polite"` |
| **Reduced motion** | All animations disabled when `prefers-reduced-motion: reduce` |

---

## 🖥 Browser Support

| Browser | Minimum |
|---|---|
| Chrome / Edge | 88+ |
| Firefox | 85+ |
| Safari | 14+ |
| Mobile Safari (iOS) | 14+ |

No polyfills required.

---

## 🔷 TypeScript

Full typings ship out of the box:

```ts
import RoyalAlert from 'royal-alert';
import type { RoyalAlertOptions, RoyalAlertResult } from 'royal-alert';

const result: RoyalAlertResult = await RoyalAlert.confirm({
    title: 'Delete?',
    confirmText: 'Yes',
} satisfies RoyalAlertOptions);

if (result.confirmed) { /* ... */ }
```

---

## 🌐 WordPress Integration

RoyalAlert has **zero conflict** with WordPress admin styles, Elementor, or jQuery-based plugins.

**Step 1 — Enqueue files:**

```php
function my_plugin_scripts() {
    wp_enqueue_style(
        'royal-alert',
        'https://cdn.jsdelivr.net/npm/royal-alert/dist/royal-alert.min.css',
        [],
        '1.0.0'
    );
    wp_enqueue_script(
        'royal-alert',
        'https://cdn.jsdelivr.net/npm/royal-alert/dist/royal-alert.min.js',
        [],        // no dependencies — NOT jQuery
        '1.0.0',
        true       // load in footer
    );
    wp_enqueue_script(
        'my-plugin',
        plugin_dir_url(__FILE__) . 'assets/js/my-plugin.js',
        ['royal-alert'],
        '1.0.0',
        true
    );

    // Pass AJAX URL + nonce to JS
    wp_localize_script('my-plugin', 'myPlugin', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('my_plugin_nonce'),
    ]);
}
add_action('wp_enqueue_scripts', 'my_plugin_scripts');
```

**Step 2 — Use in your plugin JS:**

```js
document.querySelector('#delete-btn').addEventListener('click', async () => {
    const result = await RoyalAlert.confirm({
        title:       'Delete this post?',
        message:     'This action cannot be undone.',
        confirmText: 'Delete',
    });

    if (!result.confirmed) return;

    RoyalAlert.loading('Deleting…');

    const formData = new FormData();
    formData.append('action', 'my_delete_post');
    formData.append('nonce',  myPlugin.nonce);
    formData.append('id',     postId);

    const res  = await fetch(myPlugin.ajaxUrl, { method: 'POST', body: formData });
    const json = await res.json();

    RoyalAlert.close();

    if (json.success) {
        RoyalAlert.toast({ type: 'success', message: 'Post deleted!', position: 'top-right', duration: 3000 });
    } else {
        RoyalAlert.error(json.data || 'An error occurred.');
    }
});
```

---

## 🛠 Development

```bash
# Install dev dependencies (Vite + Vitest)
npm install

# Start live dev server (opens demo page)
npm run dev

# Build distribution files → dist/
npm run build

# Run test suite
npm test
```

---

## 📁 Project Structure

```
royal-alert/
├── src/
│   ├── core/
│   │   ├── config.js       ← Global defaults & option schema
│   │   └── instance.js     ← Core dialog class (build, show, close, update)
│   ├── components/
│   │   └── toast.js        ← Toast rendering & timer logic
│   ├── utils/
│   │   ├── dom.js          ← createElement, addClass, body scroll lock
│   │   └── a11y.js         ← Focus trap, save/restore active element
│   ├── icons/
│   │   └── svg.js          ← Inline SVG icon map (no external dependency)
│   └── index.js            ← Public API surface (RoyalAlert object)
│
├── styles/
│   ├── variables.css       ← All --ra-* CSS custom properties
│   ├── base.css            ← Overlay, body lock
│   ├── modal.css           ← Dialog card, icon, input, progress, footer
│   ├── toast.css           ← Toast containers, directional slide-in
│   ├── buttons.css         ← Gradient buttons, hover lift
│   ├── animations.css      ← scale/fade/slide/flip keyframes, reduced-motion
│   └── themes.css          ← Dark & auto theme variable overrides
│
├── demo/
│   ├── index.html          ← Live demo page
│   └── demo.js             ← All demo button handlers
│
├── types/
│   └── index.d.ts          ← TypeScript declarations
│
├── tests/
│   └── index.test.js       ← Vitest test suite
│
├── dist/                   ← Generated by `npm run build`
│   ├── royal-alert.mjs     ← ES Module
│   ├── royal-alert.umd.js  ← UMD / CommonJS
│   ├── royal-alert.min.js  ← IIFE browser build (minified)
│   └── royal-alert.min.css ← Minified CSS
│
├── package.json
├── vite.config.js
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
└── LICENSE
```

---

## 🔒 Security

| Scenario | Behaviour |
|---|---|
| `message` option | Written via `element.textContent` — **XSS-safe** |
| `html` option | Written via `element.innerHTML` — **developer is responsible for sanitisation** |
| `inputValidator` | Runs inside a `try/catch`; errors prevent dialog close but do not crash the page |
| `eval()` / `new Function()` | **Never used** |
| External requests | **None at runtime** — all assets are self-contained |

---

## 📜 License

MIT License — see [LICENSE](LICENSE).

---

<div align="center">

**Developed & maintained by**

[**Royal Technologies**](https://www.royaltechbd.com/)

Royal House, D-408, Housing Estate, Kushtia, Bangladesh

[+8801552333272](tel:+8801552333272) · [info@royaltechbd.com](mailto:info@royaltechbd.com) · [www.royaltechbd.com](https://www.royaltechbd.com/)

</div>
