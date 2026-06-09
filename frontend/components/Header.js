import { expect } from "@playwright/test";

export class Header{
    constructor(page) {
        this.page = page;
        this.dashboard = page.getByRole('link', { name: 'Dashboard' });
        this.books = page.getByRole('link', { name: 'Livros' });
        this.favourites = page.getByRole('link', { name: 'Favoritos' });
        this.rents = page.getByRole('link', { name: 'Meus Arrendamentos' });
        this.booksAvailableForPurchase = page.getByRole('link', { name: 'Compras', exact: true });
        this.personalPurchases = page.getByRole('link', { name: 'Minhas Compras' });
        this.approvals = page.getByRole('link', { name: 'Aprovações' });
        this.adminPurchases = page.getByRole('link', { name: 'Compras Admin' });
        this.users = page.getByRole('link', { name: 'Usuários (Admin)' });
        this.logout = page.getByRole('button', { name: 'Sair' });
        this.loggedInUser = (username) => page.locator('span', { hasText: `${username}` });

    }

    async expectUsernameOnHeader(username) {
        await expect(this.loggedInUser(`${username}`)).toBeVisible();
    }

    async assertVisibility({ visible = [], hidden = [] }) {
        for (const item of visible) {
            await expect(item).toBeVisible();
        }

        for (const item of hidden) {
            await expect(item).not.toBeVisible();
        }
    }

    async expectStudentMenuItemsToBeVisible() {
        await this.assertVisibility({
            visible: [
                this.dashboard,
                this.books,
                this.favourites,
                this.rents,
                this.booksAvailableForPurchase,
                this.personalPurchases,
            ],

            hidden: [
                this.approvals,
                this.adminPurchases,
                this.users,
            ]
        });
    }

    async expectAdminMenuItemsToBeVisible() {
        await this.assertVisibility({
            visible: [
                this.dashboard,
                this.books,
                this.favourites,
                this.rents,
                this.approvals,
                this.adminPurchases,
                this.users,
            ],
            hidden: [
                this.booksAvailableForPurchase,
                this.personalPurchases,
            ]
        });
    }
    
    async openDashboard() {
        await this.dashboard.click();
    }

    async openBooks() {
        await this.books.click();
    }

    async openFavourites() {
        await this.favourites.click();
    }

    async openRents() {
        await this.rents.click();
    }

    async openApprovals() {
        await this.approvals.click();
    }

    async openPurchases() {
        await this.booksAvailableForPurchase.click();
    }

    async openPersonalPurchases() {
        await this.personalPurchases.click();
    }

    async openAdminPurchases() {
        await this.adminPurchases.click();
    }

    async openUsers() {
        await this.users.click();
    }

    async logoutFromSystem() {
        await this.logout.click();
    }
}