import { expect, test } from "@playwright/test";
import { Login } from "./pom/Login";
import { Dashboard } from "./pom/Dashboard";
import { Header } from "./components/Header";
import { Books } from "./pom/Books";
import { BooksAvailableForPurchase } from "./pom/BooksAvailableForPurchase";
import { PurchaseHistory } from "./pom/PurchaseHistory";
import { listSpecificBook } from "../helpers/backend/listSpecificBook";
import { AdminPurchases } from "./pom/AdminPurchases";
import { addPurchase } from "../helpers/backend/addPurchase";
import { bookData } from "../test-data/backend/books";
import { addBook } from "../helpers/backend/addBook";

test.describe('Purchases', () => {
    let login;
    let admin = { id: 1, email: 'admin@biblioteca.com', password: '123456' }; // seeded in the db.
    let student = { id: 3, email: 'aluna@teste.com', password: '123456' }; // seeded in the db.

    test.beforeEach(async ({ page }) => {
        login = new Login(page);

        await login.navigateToPage();

        await login.expectPageLoaded();
    });

    test('CT-FE-018: Should validate purchase', async ({ page, request }) => {
        const dashboard = new Dashboard(page);
        const header = new Header(page);
        const booksAvailableForPurchase = new BooksAvailableForPurchase(page);
        const purchaseHistory = new PurchaseHistory(page);
        const books = new Books(page);

        const book = await bookData();

        const { body: bookInfoBeforePurchaseRequest } = await addBook(request, book);

        const bookId = bookInfoBeforePurchaseRequest.id;
        
        const stockBeforeBookPurchaseRequest = bookInfoBeforePurchaseRequest.estoque; 
        // Minimum stock set is 5. Check bookData() for more info.

        await login.loginWithCredentials(student.email, student.password);

        await login.clickToLogin();

        await header.openPurchases();

        const requestedQuantity = 1;

        await booksAvailableForPurchase.adjustBookQuantity(bookId, requestedQuantity);

        await booksAvailableForPurchase.expectSuccessDialog();

        await booksAvailableForPurchase.clickToPurchase(bookId);

        await header.openBooks();

        const { body: bookInfoAterPurchaseRequest } = await listSpecificBook(request, bookId);

        const stockAfterBookPurchaseRequest = bookInfoAterPurchaseRequest.estoque; 

        await books.expectStockUnchanged(stockAfterBookPurchaseRequest); 
        // Needs admin confirmation.

        await header.openPersonalPurchases();

        await purchaseHistory.expectPendingStatus(bookId);
    });

    test('CT-FE-019: Should approve purchase request', async ({ page, request }) => {
        const header = new Header(page);
        const adminPurchases = new AdminPurchases(page);

        const book = await bookData();

        const { body: bookInfo } = await addBook(request, book); 

        const requestedQuantity = 2;

        const purchase = { usuarioId: student.id, livroId: bookInfo.id, quantidade: requestedQuantity};
        
        await addPurchase(request, purchase);

        await login.loginWithCredentials(admin.email, admin.password);

        await login.clickToLogin();
        
        await header.openAdminPurchases();

        await adminPurchases.expectPageLoaded();

        const purchaseId = await adminPurchases.expectPendingPurchase(purchase.livroId);

        await adminPurchases.expectEnoughStockForPurchase(purchaseId, purchase.livroId, request);

        await adminPurchases.expectConfirmationAndSuccessDialog(purchaseId);

        await adminPurchases.clickToApprovePurchase(purchaseId);

        await adminPurchases.expectApprovedStatus(purchaseId, 'APROVADA');
    });
});