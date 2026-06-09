import { expect } from "@playwright/test";
import { listAvailableBooks } from "../../helpers/backend/listAvailableBooks";

export class DetailsPage {
    constructor(page) {
        this.page = page;
        this.favourites = page.getByRole('button', { name: '🤍 Adicionar aos Favoritos' });
        this.removeFavourites = page.getByRole('button', { name: '❤️ Remover dos Favoritos' });
        this.delete = page.getByRole('button', { name: 'Deletar Livro' });
        this.back = page.getByRole('button', { name: 'Voltar' });
        this.img = page.getByRole('img');
        this.header = (header) => page.getByRole('heading', { name: header });
        this.author = (author) => page.getByText(`Autor: ${author}`);
        this.pages = (pages) => page.getByText(`Páginas: ${pages}`);
        this.description = (description) => page.getByText(`Descrição: ${description}`);
        this.date = (date) => page.getByText(`Data de Cadastro: ${date}`);
    }

    async expectPageLoaded(bookID) {
        await expect(this.page).toHaveURL(`/detalhes.html?id=${bookID}`);
    }

    async expectAllBookInfoToBeVisible(header, author, pages, description, date) {
        await this.page.waitForLoadState('networkidle');

        const bookInfo = [
            this.header(header),
            this.author(author),
            this.pages(pages),
            this.description(description),
            this.date(date)
        ]

        for (const locator of bookInfo) {
            await expect(locator).toBeVisible();
        }

        const loaded = await this.img.evaluate(img => img.naturalWidth > 0);
        expect(loaded).toBe(true);
    }

    async expectAllButtonsToBeVisible() {
        const buttons = [
            this.favourites,
            this.delete,
            this.back
        ]

        for (const button of buttons) {
            await expect(button).toBeVisible();
        }
    }

    async addToFavourites() {
        await this.favourites.click();
    }

    async expectButtonRemoveFromFavourites() {
        await expect(this.favourites).not.toBeVisible();
        await expect(this.removeFavourites).toBeVisible();
    }

    async removeFromFavourites() {
        await Promise.all([
            this.page.waitForResponse(response => 
                response.url().includes('favorito') && response.status() === 200
            ),
            this.removeFavourites.click()
        ]);
    }
    
    async expectButtonAddToFavourites() {
        await expect(this.removeFavourites).not.toBeVisible();
        await expect(this.favourites).toBeVisible();
    }

    async goBackToManageBooks() {
        await this.back.click();
    }
}