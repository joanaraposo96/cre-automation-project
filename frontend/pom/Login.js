import { expect } from '@playwright/test';

export class Login {
    constructor(page) {
        this.page = page;
        this.header = page.getByRole('heading', { name: 'Login' });
        this.email = page.locator('input[id="email"]');
        this.password = page.locator('input[id="senha"]');
        this.login = page.locator('button[type="submit"]');
        this.register = page.getByRole('link', { name: 'Registre-se' });
    }

    async navigateToPage() {
        await this.page.goto('/login.html');
    }

    async expectPageLoaded() {
        await expect(this.header).toBeVisible();        
    }

    async clickToRegister() {
        await this.register.click();
    }

    async loginWithCredentials(email, password) {
        await this.email.fill(email);
        await this.password.fill(password);
    };

    async expectLoginSuccessfulDialog() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBeTruthy();
            await dialog.accept();
        });
    }

    async expectLoginUnsuccessfulDialog() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBeTruthy();
            await dialog.accept();
        });
    }

    async clickToLogin() {
        await this.login.click();
    }

    async clearLocalStorage() {
        await this.page.evaluate(() => localStorage.clear());
    }

    async expectLocalStorageToBeCleared() {
        const usuario = await this.page.evaluate(() => localStorage.getItem('usuario'));
        expect(usuario).toBeNull();
    }
}