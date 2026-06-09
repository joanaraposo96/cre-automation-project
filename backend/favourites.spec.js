import { test, expect } from "@playwright/test";
import { addToFavourites } from "../helpers/backend/addToFavourites";
import { removeFromFavourites } from "../helpers/backend/removeFromFavourites";
import { listUserFavourites } from "../helpers/backend/listUserFavourites";
import { listUsers } from "../helpers/backend/listUsers";
import { bookData } from "../test-data/backend/books";
import { addBook } from "../helpers/backend/addBook";
import { listAvailableBooks } from "../helpers/backend/listAvailableBooks";
import { listAllBooks } from "../helpers/backend/listAllBooks";

test.describe('Favourites', () => {
    let admin = { id: 1 } // seeded in the db.

    test('CT-API-014: Should successfully add a book to favourites', async ({ request }) => {
        const book = await bookData();

        await addBook(request, book);

        const { body: book_Id } = await listAllBooks(request);

        const bookId = book_Id.find(b=> b.nome === book.nome).id;

        const favouriteBook = { usuarioId: admin.id, livroId: bookId};

        const { response, body } = await addToFavourites(request, favouriteBook);

        expect(response.status()).toBe(201);

        expect(body.mensagem).toBe('Livro adicionado aos favoritos');

        await removeFromFavourites(request, favouriteBook);
    });

    test('CT-API-015: Should not allow duplicated favourite books', async ({ request }) => {
        const book = await bookData();

        await addBook(request, book);

        const { body: book_Id } = await listAllBooks(request);

        const bookId = book_Id.find(b=> b.nome === book.nome).id;

        const favouriteBook = { usuarioId: admin.id, livroId: bookId};

        await addToFavourites(request, favouriteBook);

        const { response, body } = await addToFavourites(request, favouriteBook);

        expect(response.status()).toBe(400);

        expect(body.mensagem).toBe('Já está nos favoritos');

        await removeFromFavourites(request, favouriteBook);
    });

    test('CT-API-016: Show list user favourites', async ({ request }) => {
        const book = await bookData();

        await addBook(request, book);

        const { body: book_Id } = await listAllBooks(request);

        const bookId = book_Id.find(b=> b.nome === book.nome).id;

        const favouriteBook = { usuarioId: admin.id, livroId: bookId};

        await addToFavourites(request, favouriteBook);

        const { response, body } = await listUserFavourites(request, admin.id);

        expect(response.status()).toBe(200);

        expect(Array.isArray(body)).toBe(true);

        expect(body.length).toBeGreaterThan(0);

        body.forEach(book => {
            expect(book).toHaveProperty('id');
        });

        await removeFromFavourites(request, favouriteBook)
    });

    test('CT-API-017: Should remove a book from favourites', async ({ request }) => {
        const book = await bookData();

        await addBook(request, book);

        const { body: book_Id } = await listAllBooks(request);

        const bookId = book_Id.find(b=> b.nome === book.nome).id;

        const favouriteBook = { usuarioId: admin.id, livroId: bookId};

        await addToFavourites(request, favouriteBook);

        const { response, body } = await removeFromFavourites(request, favouriteBook);

        expect(response.status()).toBe(200);

        expect(body.mensagem).toBe('Livro removido dos favoritos');
    });
});