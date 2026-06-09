import { test } from "@playwright/test";
import { Login } from "./pom/Login";
import { Dashboard } from "./pom/Dashboard";
import { Header } from "./components/Header";

test.describe('Logout', () => {
    let login;
    let dashboard;
    let header;
    let admin = { email: 'admin@biblioteca.com', password: '123456' } // seeded in the db.

    test('CT-FE-024: Should successfully logout from the system and clear local storage', async ({ page }) => {
        login = new Login(page);
        dashboard = new Dashboard(page);
        header = new Header(page);

        await login.navigateToPage();

        await login.expectPageLoaded();

        await login.loginWithCredentials(admin.email, admin.password);

        await login.clickToLogin();

        await dashboard.expectPageLoaded();

        await header.logoutFromSystem();

        await login.expectPageLoaded();

        await login.expectLocalStorageToBeCleared();

        await dashboard.navigateToPage();

        await login.expectPageLoaded();
    });
});
