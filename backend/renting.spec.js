import { test, expect } from "@playwright/test";
import { addRenting } from "../helpers/backend/addRenting";
import { bookData } from "../test-data/backend/books";
import { addBook } from "../helpers/backend/addBook";
import { approveRenting } from "../helpers/backend/approveRenting";
import { listSpecificUserBookRentals } from "../helpers/backend/listSpecificUserBookRentals";
import { listSpecificBook } from "../helpers/backend/listSpecificBook";
import { deleteBook } from "../helpers/backend/deleteBooks";

test.describe('Renting', () => {
  let admin = { id: 1 } // seeded in the db.

    test('CT-API-018: Should allow renting available books', async ({ request }) => {
      const book = await bookData();

      const { body: book_Info } = await addBook(request, book);

      const rentBook = { usuarioId: admin.id, livroId: book_Info.id, dataInicio: '2026-08-03', dataFim: '2026-08-17' }; 

      const { response, body } = await addRenting(request, rentBook);

      const fields = ['id', 'usuarioId', 'livroId', 'status', 'criadoEm'];

      expect(response.status()).toBe(201);

      fields.forEach(field => expect(body).toHaveProperty(field));

      expect(body.status).toBe('PENDENTE');
    });

    test('CT-API-019: Should not allow renting out of stock books', async ({ request }) => {
      const book = await bookData();

      const bookWithoutStock = { ...book, estoque: 0 };

      const { body: book_Info } = await addBook(request, bookWithoutStock);

      const rentBook = { usuarioId: admin.id, livroId: book_Info.id, dataInicio: '2026-08-03', dataFim: '2026-08-17' };

      const { body: rent_Info } = await addRenting(request, rentBook); // Status 'PENDING'.

      const approveBook = { ...rent_Info, status: 'APROVADO' };

      await approveRenting(request, rent_Info.id, approveBook); // Stock is now 0.

      const { response, body } = await addRenting(request, rentBook);

      expect(response.status()).toBe(400);

      expect(body.mensagem).toBe('Livro sem estoque para arrendamento');

      await deleteBook(request, book_Info.id);
    });

    test('CT-API-020: Should update book status to "Aprovado"', async ({ request }) => {
      const book = await bookData();

      const { body: book_Info } = await addBook(request, book);

      const rentBook = { usuarioId: admin.id, livroId: book_Info.id, dataInicio: '2026-08-03', dataFim: '2026-08-17' };

      const { body: rent_Info } = await addRenting(request, rentBook);

      const approveBook = { ...rent_Info, status: 'APROVADO' };

      const { response, body } = await approveRenting(request, rent_Info.id, approveBook);

      expect(response.status()).toBe(200);

      expect(body.status).toBe('APROVADO');

      const { body: listStock } = await listSpecificBook(request, book_Info.id);

      const currentStock = book_Info.estoque - 1;

      expect(currentStock).toBe(listStock.estoque);

      await deleteBook(request, book_Info.id);
    });

    test('CT-API-021: Should reject renting books with invalid status', async ({ request }) => {
      const book = await bookData();

      const { body: book_Info } = await addBook(request, book);

      const rentBook = { usuarioId: admin.id, livroId: book_Info.id, dataInicio: '2026-08-03', dataFim: '2026-08-17' };

      const { body: rent_Info } = await addRenting(request, rentBook);

      const rejectBook = { ...rent_Info, status: 'EM_ANÁLISE' };

      const { response, body } = await approveRenting(request, rent_Info.id, rejectBook);

      expect(response.status()).toBe(400);

      expect(body.mensagem).toBe('Status inválido');

      await deleteBook(request, book_Info.id);
    });

    test('CT-API-022: Should list specific user book rentals', async ({ request }) => {
      const book = await bookData();

      const { body: book_Info } = await addBook(request, book);

      const rentBook = { usuarioId: admin.id, livroId: book_Info.id, dataInicio: '2026-08-03', dataFim: '2026-08-17' };

      const { body: rent_Info } = await addRenting(request, rentBook);

      const { response, body } = await listSpecificUserBookRentals(request, rent_Info.usuarioId);
        
      expect(response.status()).toBe(200);

      expect(Array.isArray(body)).toBe(true);

      body.forEach(book => expect(book.usuarioId).toBe(rent_Info.usuarioId));

      await deleteBook(request, book_Info.id);
    });
});