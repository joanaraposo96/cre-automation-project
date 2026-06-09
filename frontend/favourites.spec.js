import { expect, test } from "@playwright/test";
import { Login } from "./pom/Login";
import { Dashboard } from "./pom/Dashboard";
import { DetailsPage } from "./pom/DetailsPage";
import { Header } from "./components/Header";
import { Favourites } from "./pom/Favourites";
import { Books } from "./pom/Books";
import { listAvailableBooks } from "../helpers/backend/listAvailableBooks";
import { removeFromFavourites } from "../helpers/backend/removeFromFavourites";
import { listUserFavourites } from "../helpers/backend/listUserFavourites";
import { listAllBooks } from "../helpers/backend/listAllBooks";
import { bookData } from "../test-data/backend/books";
import { addBook } from "../helpers/backend/addBook";

test.describe('Favourites', () => {
    let login;
    let dashboard;
    let student = { email: 'aluna@teste.com', password: '123456', id: 3 }; // seeded in the db.

    test.beforeEach(async ({ page, request }) => {
        login = new Login(page);
        dashboard = new Dashboard(page);

        const { body } = await listAllBooks(request);

        expect(body.length).toBeGreaterThan(0);

        await login.navigateToPage();

        await login.loginWithCredentials(student.email, student.password);

        await login.clickToLogin();

        await dashboard.expectPageLoaded();
    });

    test('CT-FE-013: Should be able to favourite a book', async ({ page, request }) => {
        const header = new Header(page);
        const books = new Books(page);
        const detailsPage = new DetailsPage(page);
        const favourites = new Favourites(page);
        const book_1 = await bookData();

        await addBook(request, book_1);

        await header.openBooks();

        await books.expectPageLoaded();

        const { body: bookId } = await listAllBooks(request);

        const book_1_id = bookId.find(book=> book.nome === book_1.nome).id;

        await books.openBookCard(book_1.nome);

        await detailsPage.expectPageLoaded(book_1_id);

        await detailsPage.addToFavourites();

        await detailsPage.expectButtonRemoveFromFavourites();

        await header.openFavourites();

        await favourites.expectPageLoaded();

        await favourites.expectBookCardToBeVisible(book_1.nome);

        const bookObject = { usuarioId: student.id, livroId: book_1_id};
        
        await removeFromFavourites(request, bookObject);
    });

    test('CT-FE-014: Should be able to remove book from favourites', async ({ page, request }) => {
        const header = new Header(page);
        const books = new Books(page);
        const favourites = new Favourites(page);
        const detailsPage = new DetailsPage(page);
        const book_1 = await bookData();

        await addBook(request, book_1);

        await header.openBooks();

        const { body: bookId } = await listAllBooks(request);

        const book_1_id = bookId.find(book=> book.nome === book_1.nome).id;

        await books.openBookCard(book_1.nome);

        await detailsPage.expectPageLoaded(book_1_id);

        await detailsPage.addToFavourites();

        await header.openFavourites();

        await favourites.expectBookCardToBeVisible(book_1.nome);

        await favourites.clickToOpenDetailedView(book_1.nome);

        await detailsPage.removeFromFavourites();

        await detailsPage.expectButtonAddToFavourites();
    });

    test('CT-FE-015: Should validate user favourites and empty grid', async ({ page, request }) => {
        const header = new Header(page);
        const books = new Books(page);
        const favourites = new Favourites(page);
        const detailsPage = new DetailsPage(page);
        const book_1 = await bookData();
        const book_2 = await bookData();
        const listOfBooks = [book_1, book_2];

        await addBook(request, book_1);

        await addBook(request, book_2);

        await header.openBooks();

        const { body: bookId_1 } = await listAllBooks(request);

        const book_1_id = bookId_1.find(book=> book.nome === book_1.nome).id;

        await books.openBookCard(book_1.nome);

        await detailsPage.expectPageLoaded(book_1_id);

        await detailsPage.addToFavourites();

        await detailsPage.expectButtonRemoveFromFavourites();

        await detailsPage.goBackToManageBooks();

        const { body: bookId_2 } = await listAllBooks(request);

        const book_2_id = bookId_2.find(book=> book.nome === book_2.nome).id;

        await books.openBookCard(book_2.nome);

        await detailsPage.expectPageLoaded(book_2_id);

        await detailsPage.addToFavourites();

        await detailsPage.expectButtonRemoveFromFavourites();

        await header.openFavourites();

        for (const book of listOfBooks) {
            await favourites.expectBookCardToBeVisible(book.nome);
        }

        await favourites.removeAllFromFavourites();

        await favourites.expectEmptyGridMessage();
    });
});