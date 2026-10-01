/**
 * RoyalAlert — TypeScript Declarations
 * @version 1.0.0
 * @author Royal Technologies (https://www.royaltechbd.com/)
 * @license MIT
 */

export type RoyalAlertType =
    | 'success' | 'error' | 'warning' | 'info' | 'question' | 'loading';

export type RoyalAlertAnimation =
    | 'scale' | 'fade' | 'slide' | 'flip' | 'none';

export type RoyalAlertTheme =
    | 'light' | 'dark' | 'auto';

export type RoyalAlertInputType =
    | 'text' | 'email' | 'password' | 'number' | 'url'
    | 'textarea' | 'select' | 'checkbox';

export type RoyalAlertPosition =
    | 'top-left' | 'top-center' | 'top-right'
    | 'middle-left' | 'middle-center' | 'middle-right'
    | 'bottom-left' | 'bottom-center' | 'bottom-right';

export type RoyalAlertButtonType =
    | 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';

/** Result returned by every dialog Promise */
export interface RoyalAlertResult {
    /** True when user clicked the Confirm button */
    confirmed: boolean;
    /** True when user cancelled (Cancel / × / Esc / overlay click) */
    cancelled: boolean;
    /** True when user clicked the Deny button */
    denied: boolean;
    /** Input value (prompts), true (confirm), button ID (custom buttons) */
    value: any;
}

/** Custom button configuration */
export interface RoyalAlertButton {
    id?: string;
    text: string;
    type?: RoyalAlertButtonType;
    disabled?: boolean;
    /** If false, dialog stays open after callback fires */
    closeAfterClick?: boolean;
    callback?: (instance: RoyalAlertInstance) => void;
}

/** Full options object accepted by RoyalAlert.fire() */
export interface RoyalAlertOptions {
    // ─── Type / Icon ────────────────────────────────────────
    type?:     RoyalAlertType;
    icon?:     RoyalAlertType | string;

    // ─── Content ────────────────────────────────────────────
    title?:       string;
    /** Safe plain-text body (textContent). XSS-safe. */
    message?:     string;
    /** Raw HTML body (innerHTML). Sanitise untrusted input yourself. */
    html?:        string;
    footer?:      string;

    // ─── Image ──────────────────────────────────────────────
    imageUrl?:    string;
    imageWidth?:  number | string;
    imageHeight?: number | string;
    imageAlt?:    string;
    imageClass?:  string;

    // ─── Buttons ────────────────────────────────────────────
    showConfirmButton?: boolean;
    showCancelButton?:  boolean;
    showDenyButton?:    boolean;
    confirmText?:       string;
    cancelText?:        string;
    denyText?:          string;
    reverseButtons?:    boolean;
    focusConfirm?:      boolean;
    focusCancel?:       boolean;
    focusDeny?:         boolean;
    closeButton?:       boolean;
    /** Array of fully custom button configs */
    buttons?:           RoyalAlertButton[];

    // ─── Behaviour ──────────────────────────────────────────
    closeOnOverlay?:  boolean;
    closeOnEscape?:   boolean;
    autoClose?:       boolean;
    duration?:        number;
    timerProgressBar?: boolean;

    // ─── Layout ─────────────────────────────────────────────
    position?:    RoyalAlertPosition;
    width?:       number | string;
    maxWidth?:    number | string;
    animation?:   RoyalAlertAnimation;
    theme?:       RoyalAlertTheme;
    backdrop?:    string;
    customClass?: string;

    // ─── Input ──────────────────────────────────────────────
    input?:            boolean;
    inputType?:        RoyalAlertInputType;
    inputPlaceholder?: string;
    inputValue?:       string;
    inputOptions?:     Array<[string, string]>;
    /**
     * Async validation function. Return an error string to block close,
     * return nothing (or null/undefined) to allow the dialog to close.
     */
    inputValidator?: (value: string) => string | null | undefined | Promise<string | null | undefined>;

    // ─── Progress ───────────────────────────────────────────
    progress?: number;

    // ─── Toast-specific ─────────────────────────────────────
    toast?:    boolean;
    onClick?:  (instance: RoyalAlertInstance) => void;

    // ─── Callbacks ──────────────────────────────────────────
    onOpen?:    (instance: RoyalAlertInstance) => void;
    afterOpen?: (instance: RoyalAlertInstance) => void;
    onClose?:   (result: RoyalAlertResult) => void;
    onConfirm?: (value: any) => void;
    onCancel?:  () => void;
    onDeny?:    () => void;
    onResult?:  (result: RoyalAlertResult) => void;
    beforeOpen?: () => void;
}

/** Global configuration (set via RoyalAlert.config()) */
export interface RoyalAlertGlobalConfig {
    theme?:          RoyalAlertTheme;
    animation?:      RoyalAlertAnimation;
    position?:       RoyalAlertPosition;
    duration?:       number;
    closeOnEscape?:  boolean;
    closeOnOverlay?: boolean;
}

/** Async action wrapper options */
export interface RoyalAlertAsyncOptions extends Partial<RoyalAlertOptions> {
    action: () => Promise<any>;
    successMessage?: string;
    errorMessage?:   string;
}

/** Native fetch wrapper options */
export interface RoyalAlertRequestOptions {
    url:             string;
    method?:         'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?:           Record<string, any>;
    headers?:        Record<string, string>;
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?:   string;
}

/** Live instance of an open dialog */
export interface RoyalAlertInstance {
    options: RoyalAlertOptions;
    promise: Promise<RoyalAlertResult>;
    isClosed: boolean;
    update(opts: Partial<RoyalAlertOptions>): void;
    close(result?: Partial<RoyalAlertResult>): void;
}

/** The main RoyalAlert API object */
export interface RoyalAlertStatic {
    fire(options: RoyalAlertOptions | string): Promise<RoyalAlertResult>;
    success(message: string): Promise<RoyalAlertResult>;
    error(message: string): Promise<RoyalAlertResult>;
    warning(message: string): Promise<RoyalAlertResult>;
    info(message: string): Promise<RoyalAlertResult>;
    loading(message?: string): Promise<RoyalAlertResult>;
    toast(options: RoyalAlertOptions | string): Promise<RoyalAlertResult>;
    confirm(options: RoyalAlertOptions | string): Promise<RoyalAlertResult>;
    prompt(options: RoyalAlertOptions): Promise<RoyalAlertResult>;
    modal(options: RoyalAlertOptions): Promise<RoyalAlertResult>;
    progress(options: RoyalAlertOptions): Promise<RoyalAlertResult>;
    async(options: RoyalAlertAsyncOptions): Promise<any>;
    request(options: RoyalAlertRequestOptions): Promise<any>;
    update(options: Partial<RoyalAlertOptions>): void;
    close(): void;
    closeAll(): void;
    isOpen(): boolean;
    getInstance(): RoyalAlertInstance | null;
    config(options: RoyalAlertGlobalConfig): void;
}

declare const RoyalAlert: RoyalAlertStatic;
export default RoyalAlert;

declare global {
    interface Window {
        RoyalAlert: RoyalAlertStatic;
    }
}
