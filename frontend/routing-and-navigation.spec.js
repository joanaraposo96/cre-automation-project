import { test } from "@playwright/test";
import { Login } from "./pom/Login";
import { Dashboard } from "./pom/Dashboard";
import { Header } from "./components/Header";
import { registerUser } from "../helpers/backend/registerUser";
import { faker } from "@faker-js/faker";
import { Favourites } from "./pom/Favourites";
import { Books } from "./pom/Books";
import { Rents } from "./pom/Rents";
import { BooksAvailableForPurchase, Purchases } from "./pom/BooksAvailableForPurchase";
import { PurchaseHistory } from "./pom/PurchaseHistory";
import { clickAndAssertStudentMenuItems, clickAndAssertAdminMenuItems } from "../helpers/frontend/menuItems";

test.describe('Routing and Navigation', () => {
    let login;
    let admin = { email: 'admin@biblioteca.com', password: '123456' }; // seeded in the db.
    let student = { email: 'aluna@teste.com', password: '123456' }; // seeded in the db.

    test.beforeEach(async ({ page }) => {
        login = new Login(page);

        await login.navigateToPage();
    });

    test('CT-FE-005: Should direct user to login page upon local storage clean up', async ({ page }) => {
        const dashboard = new Dashboard(page);

        await login.clearLocalStorage();

        await dashboard.navigateToPage();

        await login.expectPageLoaded();
    });

    test('CT-FE-006: Should validate student menu items', async ({ page, request }) => {
        const dashboard = new Dashboard(page);
        const header = new Header(page);

        await login.loginWithCredentials(student.email, student.password);

        await login.clickToLogin();

        await dashboard.expectPageLoaded();

        await header.expectStudentMenuItemsToBeVisible();

        await clickAndAssertStudentMenuItems(page);
    });

    test('CT-FE-007: Should validate admin menu items', async({ page }) => {
        const dashboard = new Dashboard(page);
        const header = new Header(page);

        await login.loginWithCredentials(admin.email, admin.password);

        await login.clickToLogin();

        await dashboard.expectPageLoaded();

        await header.expectAdminMenuItemsToBeVisible();
        
        await clickAndAssertAdminMenuItems(page);
    });
});