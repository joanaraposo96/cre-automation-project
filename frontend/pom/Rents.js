import { expect } from "@playwright/test";

export class Rents {
    constructor(page) {
        this.page = page;
        this.bookDropdown = page.getByLabel('Livro:');
        this.startDate = page.getByRole('textbox', { name: 'Data Início:' });
        this.endDate = page.getByRole('textbox', { name: 'Data Fim:' });
        this.submitRenting = page.getByRole('button', { name: 'Solicitar Arrendamento' });
        this.bookCard = page.locator('.book-card');
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/arrendamentos.html');
    }

    async selectBook(id, startDate, endDate){
        await this.bookDropdown.selectOption({ value: id });
        await this.startDate.click();
        await this.startDate.fill(startDate);
        await this.startDate.press('Enter');
        await this.endDate.click();
        await this.endDate.fill(endDate);
        await this.endDate.press('Enter');
    }

    async clickToSubmitRenting() {
        await this.submitRenting.click();
    }

    async expectSuccessDialog() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBeTruthy();
            await dialog.accept();
        });
    }

    async expectRentToBeVisible(livroId, status) {
        const card = this.bookCard
            .filter({ hasText: `Livro ID: ${livroId}` })
            .filter({ hasText: status })
            .last();

        await expect(card).toBeVisible();

        const text = await card.locator('h3').textContent();
        const rentId = text.split('#')[1];
        return rentId;
    }
}