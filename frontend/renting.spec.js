import { expect, test } from "@playwright/test";
import { Login } from "./pom/Login";
import { Dashboard } from "./pom/Dashboard";
import { Header } from "./components/Header";
import { Rents } from "./pom/Rents";
import { listAvailableBooks } from "../helpers/backend/listAvailableBooks";
import { Approvals } from "./pom/Approvals";
import { addBook } from "../helpers/backend/addBook";
import { bookData } from "../test-data/backend/books";

test.describe('Renting', () => {
    let login;
    let dashboard;
    let student = { email: 'aluna@teste.com', password: '123456' }; // seeded in the db.
    let employee = { email: 'func@biblio.com', password: '123456' } // seeded in the db.

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        dashboard = new Dashboard(page);

        await login.navigateToPage();

        await login.expectPageLoaded();
    });

    test('CT-FE-016: Should validate renting', async ({ page, request }) => {
        const header = new Header(page);
        const rents = new Rents(page);

        const book = await bookData();

        const { body: bookInfo } = await addBook(request, book);

        const bookId = String(bookInfo.id);

        await login.loginWithCredentials(student.email, student.password);

        await login.clickToLogin();

        await header.openRents();

        await rents.expectPageLoaded();

        await rents.selectBook(bookId, '2026-08-03', '2026-08-17');

        await rents.expectSuccessDialog();

        await rents.clickToSubmitRenting();

        await rents.expectRentToBeVisible(bookId, 'PENDENTE');
    });

    test('CT-FE-017: Should approve renting', async ({ page, request }) => {
        const header = new Header(page);
        const rents = new Rents(page);
        const approvals = new Approvals(page);

        const book = await bookData();

        const { body: bookInfo } = await addBook(request, book);

        const bookId = String(bookInfo.id);

        await login.loginWithCredentials(employee.email, employee.password);

        await login.clickToLogin();

        await header.openRents();

        await rents.selectBook(bookId, '2026-08-01', '2026-08-19');

        await rents.clickToSubmitRenting();

        const rentId = await rents.expectRentToBeVisible(bookId, 'PENDENTE');

        await header.openApprovals();

        await approvals.expectPageLoaded();

        await approvals.expectPendingApproval(rentId, 'PENDENTE');

        await approvals.expectConfirmationDialog(rentId);

        await approvals.approveRental(rentId);
        
        await approvals.expectSuccessDialog();

        await approvals.expectCardToBeMovedToAllRentals(rentId);
        
        await approvals.expectRentalStatus(rentId, 'APROVADO');
    });
});