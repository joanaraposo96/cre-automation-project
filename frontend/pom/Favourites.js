import { expect } from "@playwright/test";
import { DetailsPage } from "./DetailsPage";
import { Header } from "../components/Header";

export class Favourites {
    constructor(page) {
        this.page = page;
        this.bookCards = page.locator('div.book-card');
        this.emptyGridMessage = page.locator('p[id="mensagem-vazio"]');
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/favoritos.html');
    }

    async expectBookCardToBeVisible(title) {
        const locator = this.bookCards.getByRole('heading', { name: title });
        await expect(locator).toBeVisible();
    }

    async clickToOpenDetailedView(title) {
        const locator = this.bookCards.getByRole('heading', { name: title });
        await locator.click();
    }

    async removeAllFromFavourites() {
        const details = new DetailsPage(this.page);
        const header = new Header(this.page);

        while (await this.bookCards.count() > 0) {
            await this.bookCards.first().locator('h3').click();
            await details.removeFromFavourites();
            await details.goBackToManageBooks();
            await header.openFavourites();
            await this.expectPageLoaded();
        }
    }

    async expectEmptyGridMessage() {
        await expect(this.bookCards).toHaveCount(0);
        await expect(this.emptyGridMessage).toBeAttached();
    }
}