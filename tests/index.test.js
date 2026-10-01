import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import RoyalAlert from '../src/index.js';

describe('RoyalAlert', () => {
    beforeEach(() => {
        // Clear DOM
        document.body.innerHTML = '';
        RoyalAlert.closeAll();
    });

    it('should open a basic alert', async () => {
        RoyalAlert.fire({ title: 'Test', message: 'Hello' });
        
        // Wait for DOM
        await new Promise(r => setTimeout(r, 100));
        
        expect(document.querySelector('.royal-alert-overlay')).toBeTruthy();
        expect(document.querySelector('.royal-alert-title').textContent).toBe('Test');
        expect(document.querySelector('.royal-alert-message').textContent).toBe('Hello');
    });

    it('should handle success alias', async () => {
        RoyalAlert.success('Success message');
        
        await new Promise(r => setTimeout(r, 100));
        
        expect(document.querySelector('.royal-alert-icon-success')).toBeTruthy();
        expect(document.querySelector('.royal-alert-message').textContent).toBe('Success message');
    });

    it('should close when confirm button is clicked', async () => {
        const promise = RoyalAlert.confirm('Are you sure?');
        
        await new Promise(r => setTimeout(r, 100));
        
        const confirmBtn = document.querySelector('.royal-alert-btn-confirm');
        confirmBtn.click();
        
        const result = await promise;
        expect(result.confirmed).toBe(true);
        expect(result.cancelled).toBe(false);
    });

    it('should render a toast', async () => {
        RoyalAlert.toast({ message: 'Toast message' });
        
        await new Promise(r => setTimeout(r, 100));
        
        expect(document.querySelector('.royal-alert-toast')).toBeTruthy();
        expect(document.querySelector('.royal-alert-toast-message').textContent).toBe('Toast message');
    });

    it('should prompt for input', async () => {
        const promise = RoyalAlert.prompt({ title: 'Name', inputValue: 'John' });
        
        await new Promise(r => setTimeout(r, 100));
        
        const input = document.querySelector('.royal-alert-input');
        expect(input).toBeTruthy();
        expect(input.value).toBe('John');
        
        input.value = 'Jane';
        const confirmBtn = document.querySelector('.royal-alert-btn-confirm');
        confirmBtn.click();
        
        const result = await promise;
        expect(result.confirmed).toBe(true);
        expect(result.value).toBe('Jane');
    });
});
