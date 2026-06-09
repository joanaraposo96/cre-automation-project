import { expect, test } from "@playwright/test";
import { Login } from "./pom/Login";
import { Dashboard } from "./pom/Dashboard";

test.describe('Dashboard', () => {
    let login;
    let admin = { email: 'admin@biblioteca.com', password: '123456' } // seeded in the db.
    let student = { email: 'aluna@teste.com', password: '123456' } // seeded in the db.
    let book = { name: 'Clean Code', author: 'Robert C. Martin', stock: 5, price: 49.9 } // seeded in the db.

    test.beforeEach(async ({ page }) => {
        login = new Login(page);

        await login.navigateToPage();

        await login.expectPageLoaded();
    });

    test('CT-FE-008: Should validate admin statistics', async ({ page, request }) => {
        const dashboard = new Dashboard(page);

        await login.loginWithCredentials(admin.email, admin.password);

        await login.clickToLogin();

        await dashboard.expectPageLoaded();

        await dashboard.expectAdminStatisticsToBeVisible();

        await dashboard.countBookGrid(request);

        await dashboard.expectMax5BooksToBeVisible();
    });

    test('CT-FE-009: Should validate student statistics', async ({ page }) =>  {
        const dashboard = new Dashboard(page);

        await login.loginWithCredentials(student.email, student.password);

        await login.clickToLogin();

        await dashboard.expectPageLoaded();

        await dashboard.expectStudentStatisticsToBeVisible();

        await dashboard.expectBookCardToLoadAllInfoSuccessfully(book.name, book.author, book.stock, book.price); // also includes img load validation.
    });
});