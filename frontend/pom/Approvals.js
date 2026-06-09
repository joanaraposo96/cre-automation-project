import { expect } from "@playwright/test";

export class Approvals {
    constructor(page) {
        this.page = page;
        this.pendingApprovals = page.locator('#lista-pendentes');
        this.approveButton = page.getByRole('button', { name: 'Aprovar' });
        this.allRentals = page.locator('#lista-todos');
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/aprovacoes.html');
    }

    async expectPendingApproval(rentId, status){
        await expect
            (this.pendingApprovals
                .locator('.book-card')
                .filter({ hasText: `Arrendamento #${rentId}` })
                .filter({ hasText: status})
        ).toBeVisible();
    }

    async expectConfirmationDialog(rentId) {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe(`Confirmar aprovação do arrendamento #${rentId}?`);
            await dialog.accept();
        });
    }

    async expectSuccessDialog() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Arrendamento aprovado com sucesso!');
            await dialog.accept();
        });
    }

    async approveRental(rentId) {
        const bookCard = this.pendingApprovals
            .locator('.book-card')
            .filter({ hasText: `Arrendamento #${rentId}` })

        await bookCard.locator(this.approveButton).click();
    }

    async expectCardToBeMovedToAllRentals(rentId) {
        await expect(this.pendingApprovals.locator('.book-card').filter({ hasText: `Arrendamento #${rentId}` })).not.toBeVisible();
        await expect(this.allRentals.locator('.book-card').filter({ hasText: `Arrendamento #${rentId}` })).toBeVisible();
    }

    async expectRentalStatus(rentId, status) {
        await expect
            (this.allRentals
                .locator('.book-card')
                .filter({ hasText: `Arrendamento #${rentId}`  })
                .filter({ hasText: status })
        ).toBeVisible();
    }
}
