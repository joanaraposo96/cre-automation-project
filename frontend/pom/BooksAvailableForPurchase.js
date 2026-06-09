import { expect } from "@playwright/test";

export class BooksAvailableForPurchase {
    constructor(page) {
        this.page = page;
        this.bookCard = page.locator('.book-card');
        this.purchaseButton = (id) => page.locator(`button[onclick="comprarLivro(${id})"]`);
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/compras.html');
    }

    async adjustBookQuantity(id, quantity) {
        const spinner = this.bookCard.locator(`#qtd-${id}`);

        await spinner.clear();
        await spinner.fill(String(quantity));
    }

    async clickToPurchase(id) {
        await this.purchaseButton(id).click();
    }

    async expectSuccessDialog() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Compra registrada com sucesso! Aguarde aprovação.');
            await dialog.accept();
        });
    }
}