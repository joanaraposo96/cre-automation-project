import { test } from "@playwright/test";
import { Register } from "./pom/Register";
import { Login } from "./pom/Login";
import { Dashboard } from "./pom/Dashboard";
import { Header } from "./components/Header";
import { faker } from "@faker-js/faker";
import { userData } from "../test-data/frontend/users";
import { listUsers } from "../helpers/backend/listUsers";
import { deleteUser } from "../helpers/backend/deleteUser";

test.describe('Registration', () => {
    let login;
    let register;

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        register = new Register(page);

        await login.navigateToPage();

        await login.expectPageLoaded();

        await login.clickToRegister();

        await register.expectPageLoaded();
    });

    test('CT-FE-001: Should successfully create a new student account', async ({ page, request }) => {
        const user = await userData();

        await register.registerAccount(user.name, user.email, user.password, user.confirmPassword);

        await register.expectSuccessDialog();

        await register.clickToRegister();

        await login.expectPageLoaded();

        await register.navigateToPage();

        await register.expectFormToBeEmpty();

        const { body: userInfo } = await listUsers(request);

        const userId = userInfo.find(u=>u.email === user.email).id;

        await deleteUser(request, userId);
    });

     test('CT-FE-002: Should display a non-matching password dialog', async ({ page }) => {
        const user = await userData();

        const nonMatchingPassword = `${user.password}_wrong`;

        await register.registerAccount(user.name, user.email, user.password, nonMatchingPassword);

        await register.expectNonMatchingPasswordDialog();

        await register.expectPageLoaded();
    });
});

test.describe('Login', () => {
    let login;
    let admin = { name: 'Admin Master', email: 'admin@biblioteca.com', password: '123456' } // seeded in the db.

    test.beforeEach(async ({ page, request }) => {
        login = new Login(page);

        await login.navigateToPage();

        await login.expectPageLoaded();
    });

    test('CT-FE-003: Should successfully log in to admin account', async({ page, request }) => {
        const dashboard = new Dashboard(page);
        const header = new Header(page);

        await login.loginWithCredentials(admin.email, admin.password);

        await login.expectLoginSuccessfulDialog();

        await login.clickToLogin();
        
        await dashboard.expectPageLoaded();

        await dashboard.expectDataToBeStoredInLocalStorage();

        await header.expectUsernameOnHeader(admin.name);
    });

    test('CT-FE-004: Should not be able to log in with invalid credentials', async ({ page }) => {
        const wrongPassword = `${admin.password}_wrong`;
        
        await login.loginWithCredentials(admin.email, wrongPassword);

        await login.expectLoginUnsuccessfulDialog();

        await login.clickToLogin();
        
        await login.expectPageLoaded();
    });
});