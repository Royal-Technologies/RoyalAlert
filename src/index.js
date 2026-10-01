import { RoyalAlertInstance, closeAll, getActiveInstances } from './core/instance.js';
import { setGlobalConfig } from './core/config.js';

const RoyalAlert = {
    fire(options) {
        if (typeof options === 'string') {
            options = { message: options };
        }
        const instance = new RoyalAlertInstance(options);
        return instance.promise;
    },

    success(message) {
        return this.fire({ type: 'success', icon: 'success', message });
    },

    error(message) {
        return this.fire({ type: 'error', icon: 'error', message });
    },

    warning(message) {
        return this.fire({ type: 'warning', icon: 'warning', message });
    },

    info(message) {
        return this.fire({ type: 'info', icon: 'info', message });
    },

    loading(message = 'Loading...') {
        return this.fire({ 
            type: 'loading', 
            icon: 'loading', 
            message,
            showConfirmButton: false,
            closeOnEscape: false,
            closeOnOverlay: false
        });
    },

    toast(options) {
        if (typeof options === 'string') {
            options = { message: options };
        }
        return this.fire({
            toast: true,
            duration: 3000,
            showConfirmButton: false,
            closeButton: true,
            ...options
        });
    },

    confirm(options) {
        if (typeof options === 'string') {
            options = { title: options };
        }
        return this.fire({
            type: 'question',
            icon: 'question',
            showCancelButton: true,
            ...options
        });
    },

    prompt(options) {
        return this.fire({
            input: true,
            showCancelButton: true,
            ...options
        });
    },

    modal(options) {
        return this.fire({
            ...options
        });
    },

    progress(options) {
        return this.fire({
            progress: 0,
            showConfirmButton: false,
            closeOnEscape: false,
            closeOnOverlay: false,
            ...options
        });
    },

    async async(options) {
        const { action, successMessage, errorMessage, title, ...rest } = options;
        const self = this;

        const instance = new RoyalAlertInstance({
            type: 'loading',
            icon: 'loading',
            title: title || 'Please wait…',
            showConfirmButton: false,
            closeOnEscape: false,
            closeOnOverlay: false,
            ...rest
        });

        try {
            const result = await Promise.resolve(action());
            instance.close({ confirmed: false, cancelled: true, denied: false, value: null });
            setTimeout(() => self.success(successMessage || 'Operation completed!'), 350);
            return result;
        } catch (error) {
            instance.close({ confirmed: false, cancelled: true, denied: false, value: null });
            setTimeout(() => self.error(errorMessage || error.message || 'An error occurred.'), 350);
            throw error;
        }
    },

    request(options) {
        const { url, method = 'GET', data, loadingMessage, successMessage, errorMessage, headers = {} } = options;
        
        return this.async({
            title: loadingMessage || 'Loading...',
            action: async () => {
                const fetchOptions = {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers
                    }
                };
                if (data && method !== 'GET') {
                    fetchOptions.body = JSON.stringify(data);
                }
                const response = await fetch(url, fetchOptions);
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                return await response.json();
            },
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

if (typeof window !== 'undefined') {
    window.RoyalAlert = RoyalAlert;
}

export default RoyalAlert;
