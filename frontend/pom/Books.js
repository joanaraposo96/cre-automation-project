import { expect } from "@playwright/test";

export class Books {
    constructor(page) {
        this.page = page;
        this.bookName = page.getByRole('textbox', { name: 'Nome do Livro:' });
        this.bookAuthor = page.getByRole('textbox', { name: 'Autor:' });
        this.bookPages = page.getByRole('spinbutton', { name: 'Número de Páginas:' });
        this.bookDescription = page.getByRole('textbox', { name: 'Descrição:' });
        this.bookStock = page.getByRole('spinbutton', { name: 'Estoque:' });
        this.bookURL = page.getByRole('textbox', { name: 'URL da Imagem:' });
        this.bookPrice = page.getByRole('spinbutton', { name: 'Preço (€):' });
        this.addBook = page.getByRole('button', { name: 'Adicionar Livro' });
        this.bookCard = page.locator('.book-card');
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/livros.html');
    }

    async fillBookForm(name, author, pages, description = '', url = '', stock = '1', price = '0') {
        await this.bookName.fill(name);
        await this.bookAuthor.fill(author);
        await this.bookPages.fill(pages);
        await this.bookDescription.fill(description);
        await this.bookURL.fill(url);
        await this.bookStock.fill(stock);
        await this.bookPrice.fill(price)
    }

    async expectBookCreationSuccessfulDialog() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBeTruthy();
            await dialog.accept();
        });
    }


    async clickToAddBook() {
        await this.addBook.click();
    }

    async expectBookToAppearInList(book) {
        const card = this.bookCard.filter({ hasText: `${book}` });
        await expect(card).toBeVisible();
    }

    async expectFormToBeEmpty() {

        const fields = [
            this.bookName,
            this.bookAuthor,
            this.bookPages,
            this.bookDescription,
            this.bookURL
        ]

        for (const field of fields) {
            await expect(field).toHaveValue('');
        }
    }

    async expectValidationMessage(fieldName) {
        const locators = {
            nome:    this.page.locator('#nome'),
            autor:   this.page.locator('#autor'),
            paginas: this.page.locator('#paginas')
        };

        const locator = locators[fieldName];
        const validationMessage = await locator.evaluate(input => input.validationMessage);
        expect(validationMessage).toBeTruthy();
    }

    async openBookCard(book) {
        await this.page.locator('.book-card').filter({ hasText: book }).click();
    }

    async expectStockUnchanged(stock) {
        const stockLabel = this.bookCard
            .locator('p')
            .filter({ hasText: `Estoque: ${stock}`})
            .last();
        
        await expect(stockLabel).toBeVisible();
    }
}