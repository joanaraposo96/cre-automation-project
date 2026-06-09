import { expect } from "@playwright/test";

export class PurchaseHistory {
    constructor(page) {
        this.page = page;
        this.bookCard = page.locator('.book-card');
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/minhas-compras.html');
    }

   async expectPendingStatus (livroId) {
        await expect(
            this.bookCard
                .filter({ hasText: `Livro Id: ${livroId}`})
                .filter({ hasText: 'PENDENTE' })
                .last()
        ).toBeVisible();
    }
}