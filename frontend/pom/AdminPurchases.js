import { expect } from "@playwright/test";
import { listSpecificBook } from "../../helpers/backend/listSpecificBook";

export class AdminPurchases {
    constructor(page) {
        this.page = page;
        this.bookCard = page.locator('.book-card');
        this.approvePurchaseButton = page.getByRole('button', { name: 'Aprovar'});
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/compras-admin.html');
    }

    async expectPendingPurchase(id) {
        const card = this.bookCard
            .filter({ hasText: `Livro ID: ${id}` })
            .filter({ hasText: 'PENDENTE' })
            .last();

        await expect(card).toBeVisible();
        
        const text = await card.locator('h3').innerText();
        const purchaseId = text.split('#')[1];

        return purchaseId;
    }

    async expectEnoughStockForPurchase(purchaseId, bookId, request) {
        const card = this.bookCard
            .filter({ hasText: `Compra #${purchaseId}` })
            .filter({ hasText: 'PENDENTE' })
            .last();

        const text = await card
            .locator('p')
            .filter({ hasText: 'Quantidade:'})
            .innerText();

        const quantityRequested = Number(text.split(':')[1]);

        const { body } = await listSpecificBook(request, bookId);
        const currentStock = body.estoque;
                
        expect(currentStock).toBeGreaterThanOrEqual(quantityRequested);
    }

    async expectConfirmationAndSuccessDialog(purchaseId) {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toContain(`${purchaseId}`);
            await dialog.accept();
            
            this.page.once('dialog', async dialog => {
                expect(dialog.message()).toBeTruthy();
                await dialog.accept();
            });
        })
    }

    async clickToApprovePurchase(purchaseId) {
        const card = this.bookCard
            .filter({ hasText: `Compra #${purchaseId}` })
            .filter({ hasText: 'PENDENTE' })
            .last();

        await card.locator(this.approvePurchaseButton).click();
    }

    async expectApprovedStatus(purchaseId, status) {
        await expect(
            this.bookCard
                .filter({ hasText: `Compra #${purchaseId}` })
                .filter({ hasText: status })
                .last()
        ).toBeVisible();
    }
}
