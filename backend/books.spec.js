import { test, expect } from "@playwright/test";
import { listAllBooks } from "../helpers/backend/listAllBooks";
import { listAvailableBooks } from "../helpers/backend/listAvailableBooks";
import { listSpecificBook } from "../helpers/backend/listSpecificBook";
import { bookData } from "../test-data/backend/books";
import { deleteBook } from "../helpers/backend/deleteBooks";
import { addBook } from "../helpers/backend/addBook";
import { updateBook } from "../helpers/backend/updateBook";

test.describe('Books', () => {
    let book_1 = { id: 1, 
        nome: 'Clean Code', 
        autor: 'Robert C. Martin', 
        paginas: 464, 
        descricao: 'Um guia completo sobre boas práticas de programação',
        imagemUrl: 'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
        // dataCadastro is omitted here because it's a dynamic value.
        estoque: 5,
        preco: 49.9
    }; // seeded in the db.

    let book_2 = {
        id: 2,
        nome: 'Harry Potter',
        autor: 'J.K. Rowling',
        paginas: 309,
        descricao: 'O primeiro livro da saga do bruxinho mais famoso',
        imagemUrl: 'https://m.media-amazon.com/images/I/81ibfYk4qmL._SY466_.jpg',
        // dataCadastro is omitted here because it's a dynamic value.
        estoque: 3,
        preco: 39.9
    }; // seeded in the db.

    test('CT-API-005: Should list all books', async ({ request }) => {
        const { response, body } = await listAllBooks(request);

        expect(response.status()).toBe(200);

        expect(Array.isArray(body)).toBe(true);

        const fields = ['id', 'nome', 'autor', 'paginas', 'descricao', 'imagemUrl', 'dataCadastro', 'estoque', 'preco'];

        body.forEach(book => {
            fields.forEach(field => {
                expect(book).toHaveProperty(field);
            });

            expect(Number.isInteger(book.paginas)).toBe(true);
            expect(book.dataCadastro).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
        });
    });

    test('CT-API-006: Should list all available books', async ({ request }) => {
        const { response, body } = await listAvailableBooks(request);

        expect(response.status()).toBe(200);

        expect(Array.isArray(body)).toBe(true);

        body.forEach((book) => {
            expect(book.estoque).toBeGreaterThan(0);

            if (book.estoque > 0) {
                expect(book).toHaveProperty('disponivel');
                expect(book.disponivel).toBe(true);
            }
        });
    });

    test('CT-API-007: Should search book by its existing ID', async ({ request }) => {        
        const { response, body } = await listSpecificBook(request, book_1.id);

        expect(response.status()).toBe(200);

        expect(body.id).toBe(1);

        expect(body.nome).toBeTruthy();

        expect(body.autor).toBeTruthy();

        expect(body.paginas).not.toBeNull();

        expect(body.paginas).toBeDefined();
    });

    test('CT-API-008: Should return error message when searching for a non-existing ID', async ({ request }) => {
        const { response, body } = await listSpecificBook(request, 9999);

        expect(response.status()).toBe(404);

        expect(body.mensagem).toBe('Livro não encontrado');
    });

    test('CT-API-009: Add new book', async ({ request }) => {
        const book = await bookData();

        const { response, body } = await addBook(request, book);

        const id = body.id;

        expect(response.status()).toBe(201);

        expect(body.id).toBeTruthy();

        expect(body.dataCadastro).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);

        const fields = ['nome', 'autor', 'paginas', 'descricao', 'imagemUrl', 'estoque', 'preco'];

        fields.forEach(field => {
            expect(body[field]).toEqual(book[field]);
        });

        await deleteBook(request, id);
    });

    test('CT-API-010: Should not allow adding a book without mandatory fields', async ({ request }) => {
        const book = await bookData();

        const { nome, autor, paginas, ...bookWithoutMandatoryFields } = book;

        const { response, body } = await addBook(request, bookWithoutMandatoryFields);

        expect(response.status()).toBe(400);

        expect(body.mensagem).toBe('Nome, autor e páginas são obrigatórios');
    });

    test('CT-API-011: Should allow updating an existing book', async ({ request }) => {
        const book_1_updated = { ...book_1, nome: 'Clean Code Atualizado'}

        const { response, body } = await updateBook(request, 1, book_1_updated);

        expect(response.status()).toBe(200);

        expect(body.id).toBe(book_1_updated.id);

        Object.keys(book_1_updated).forEach(field => {
            expect(body[field]).toEqual(book_1_updated[field]);
        });

        const reset_book_1 = { ...book_1_updated, nome: 'Clean Code'}

        await updateBook(request, 1, reset_book_1);
    });

    test('CT-API-012: Should allow deleting a book', async ({ request }) => {
        const book = await bookData();

        await addBook(request, book);

        const { body: bookId } = await listAllBooks(request);

        const id = bookId.find(b=> b.nome === book.nome).id;

        const { response, body } = await deleteBook(request, id);

        expect(response.status()).toBe(200);

        expect(body.mensagem).toBe('Livro removido');

        const { response: checkDeletedBook } = await listSpecificBook(request, id);

        expect(checkDeletedBook.status()).toBe(404);
    });
});