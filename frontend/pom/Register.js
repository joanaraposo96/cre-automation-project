import { expect } from '@playwright/test';

export class Register {
    constructor(page) {
        this.page = page;
        this.header = page.getByRole('heading', { name: 'Criar Conta' });
        this.name = page.getByRole('textbox', {name: 'Nome' });
        this.email = page.getByRole('textbox', {name: 'Email'});
        this.password = page.locator('input[id="senha"]');
        this.confirmPassword = page.locator('input[id="confirmarSenha"]');
        this.registerButton = page.locator('button[type="submit"]');

    }

    async navigateToPage() {
        await this.page.goto('/registro.html');
    }

    async expectPageLoaded() {
        await expect(this.header).toBeVisible();        
    }

    async registerAccount(name, email, password, confirmPassword) {
        await this.name.fill(name);
        await this.email.fill(email);
        await this.password.fill(password);
        await this.confirmPassword.fill(confirmPassword);
    }

    async expectSuccessDialog() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Cadastro realizado com sucesso! Faça login.');
            await dialog.accept();
        });
    };

    async expectNonMatchingPasswordDialog() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('As senhas não conferem.');
            await dialog.accept();
        });
    }

    async clickToRegister() {
        await this.registerButton.click();
    }

    async expectFormToBeEmpty() {
        const fields = [
            this.name,
            this.email,
            this.password,
            this.confirmPassword
        ];

        for (this.field of fields) {
            expect(this.field).toHaveValue('');
        }
    }

}