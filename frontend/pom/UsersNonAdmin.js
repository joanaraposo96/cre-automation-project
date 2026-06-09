import { expect } from "@playwright/test";

export class UsersNonAdmin {
    constructor(page) {
        this.page = page;
        this.message = page.getByText('Somente administradores podem');
    }

    async navigateToPage() {
        await this.page.goto('/admin-usuarios.html');
    }

    async expectPageOnlyAccessibleToAdministratorsMessage() {
        await expect(this.message).toBeVisible();
    }
}