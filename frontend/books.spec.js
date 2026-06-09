import { test } from "@playwright/test";
import { Login } from "./pom/Login";
import { Dashboard } from "./pom/Dashboard";
import { Header } from "./components/Header";
import { Books } from "./pom/Books";
import { DetailsPage } from "./pom/DetailsPage";
import { listAvailableBooks } from "../helpers/backend/listAvailableBooks";
import { bookData } from "../test-data/backend/books";
import { listAllBooks } from "../helpers/backend/listAllBooks";
import { deleteBook } from "../helpers/backend/deleteBooks";
import { request } from "node:http";

test.describe('Books', () => {
    let login;
    let dashboard;
    let header;
    let books;
    let admin = { email: 'admin@biblioteca.com', password: '123456' }; // seeded in the db.
    let book = { 
        id: 1, 
        nome: 'Clean Code', 
        autor: 'Robert C. Martin', 
        paginas: 464, 
        descricao: 'Um guia completo sobre boas práticas de programação',
        dataCadastro: '2026-06-09T11:05:45.111Z',
    }; // seeded in the db.

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        dashboard = new Dashboard(page);
        header = new Header(page);
        books = new Books(page);

        await login.navigateToPage();

        await login.loginWithCredentials(admin.email, admin.password);

        await login.clickToLogin();

        await dashboard.expectPageLoaded();

        await header.openBooks();

        await books.expectPageLoaded();
    });

    test('CT-FE-010: Should validate book creation', async ({ page, request }) => {
        const book = await bookData();

        await books.fillBookForm(book.nome, book.autor, String(book.paginas), book.descricao, book.imagemUrl, String(book.estoque), String(book.preco));

        await books.expectBookCreationSuccessfulDialog();

        await books.clickToAddBook();

        await books.expectBookToAppearInList(book.nome);

        await books.expectFormToBeEmpty();

        const { body: bookInfo } = await listAllBooks(request);

        const bookId = bookInfo.find(b=> b.nome === book.nome).id;
        
        await deleteBook(request, bookId);
    });

    test('CT-FE-011: Should not be able to submit form if mandatory fields are not filled', async ({ page, request }) => {
        const book = await bookData();

        const bookWithoutName = { ...book, nome: '', invalidField: 'nome' };

        const bookWithoutAuthor = { ...book, autor: '', invalidField: 'autor' };

        const bookWithoutPages = { ...book, paginas: '', invalidField: 'paginas' };

        const allBooks = [bookWithoutName, bookWithoutAuthor, bookWithoutPages];

        for (const invalidBook of allBooks) {
            await page.reload();
            await books.fillBookForm(invalidBook.nome, invalidBook.autor, String(invalidBook.paginas));
            await books.clickToAddBook();
            await books.expectValidationMessage(invalidBook.invalidField);
        }
    });

    test('CT-FE-012: Should validate book details', async ({ page, request }) => {
        const detailsPage = new DetailsPage(page);

        await books.openBookCard(book.nome);

        const normalizedDate = book.dataCadastro.split('T')[0];

        const formatedDate = normalizedDate.split('-').reverse().join('/');

        await detailsPage.expectPageLoaded(book.id);

        await detailsPage.expectAllBookInfoToBeVisible(book.nome, book.autor, book.paginas, book.descricao, formatedDate);

        await detailsPage.expectAllButtonsToBeVisible();
    });
});
