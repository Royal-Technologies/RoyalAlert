export const defaultGlobalConfig = {
    position: 'bottom-left',
    duration: 3000,
    closeOnEscape: true,
    closeOnOverlay: true,
    theme: 'light',
    animation: 'scale'
};

export const defaultOptions = {
    type: 'info',
    title: '',
    message: '',
    html: '',
    icon: '',
    imageUrl: null,
    imageWidth: null,
    imageHeight: null,
    imageAlt: 'Custom image',
    imageClass: '',
    footer: null,
    showConfirmButton: true,
    showCancelButton: false,
    showDenyButton: false,
    confirmText: 'OK',
    cancelText: 'Cancel',
    denyText: 'No',
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
    inputType: 'text',
    inputPlaceholder: '',
    inputValue: '',
    inputOptions: [],
    inputValidator: null,
    loading: false,
    progress: null,
    customClass: '',
    onOpen: null,
    onClose: null,
    onConfirm: null,
    onCancel: null,
    onDeny: null,
    onResult: null,
    beforeOpen: null,
    afterOpen: null
};

export let globalConfig = { ...defaultGlobalConfig };

export function setGlobalConfig(config) {
    globalConfig = { ...globalConfig, ...config };
}
