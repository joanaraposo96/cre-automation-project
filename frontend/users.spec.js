import { expect, test } from "@playwright/test";
import { Login } from "./pom/Login";
import { Dashboard } from "./pom/Dashboard";
import { Header } from "./components/Header";
import { Users } from "./pom/Users";
import { UsersNonAdmin } from "./pom/UsersNonAdmin";
import { deleteUser } from "../helpers/backend/deleteUser";
import { homedir } from "node:os";
import { updateUser } from "../helpers/backend/updateUser";
import { faker } from "@faker-js/faker";

test.describe('Users', () => {
    let login;
    let admin = { email: 'admin@biblioteca.com', password: '123456' } // seeded in the db
    let student = { email: 'aluna@teste.com', password: '123456' }; // seeded in the db
    let employee = { nome: 'João Funcionário', email: 'func@biblio.com', tipo: 2 } // seeded in the db

    test.beforeEach(async ({ page }) => {
        login = new Login(page);

        await login.navigateToPage();

        await login.expectPageLoaded();
    });

    test(' CT-FE-020: Should validate only admin has access to Users page', async ({ page }) => {
        const dashboard = new Dashboard(page);
        const header = new Header(page);
        const users = new Users(page);

        await login.loginWithCredentials(admin.email, admin.password);

        await login.clickToLogin();

        await dashboard.expectPageLoaded();

        await header.openUsers();

        await users.expectPageLoaded();

        await users.expectElementsToBeVisible();

        await header.logoutFromSystem();

        await login.loginWithCredentials(student.email, student.password);

        await login.clickToLogin();

        await dashboard.expectPageLoaded();

        const usersNonAdmin = new UsersNonAdmin(page);

        await usersNonAdmin.navigateToPage();

        await usersNonAdmin.expectPageOnlyAccessibleToAdministratorsMessage();
    });

    test('CT-FE-021: Should successfully create an employee profile', async ({ page, request }) => {
        const dashboard = new Dashboard(page);
        const header = new Header(page);
        const users = new Users(page);
        const employee = { 
            name: faker.person.fullName(), 
            email: faker.internet.email(), 
            password: faker.internet.password(), 
            type: 'Funcionário' 
        }

        await login.loginWithCredentials(admin.email, admin.password);

        await login.clickToLogin();

        await dashboard.expectPageLoaded();

        await header.openUsers();

        await users.expectPageLoaded();

        await users.fillUserForm(employee.name, employee.email, employee.password, employee.type);

        await users.expectUserCreatedSuccessDialog();

        await users.clickToCreateUser();

        const id = await users.getIdByName(employee.name);

        await users.expectUserInfoToBeVisible(id, employee.name, employee.email, employee.type);

        await deleteUser(request, id); // resets db
    });

    test('CT-FE-022: Should be able to update name of existing user', async ({ page, request }) => {
        const dashboard = new Dashboard(page);
        const header = new Header(page);
        const users = new Users(page);
        const updatedUser = { ...employee, nome: 'João Funcionário Atualizado' };

        await login.loginWithCredentials(admin.email, admin.password);

        await login.clickToLogin();

        await dashboard.expectPageLoaded();

        await header.openUsers();

        await users.expectPageLoaded();

        await users.editUserName(employee.nome, updatedUser.nome);

        let id = await users.getIdByName(employee.nome);

        await users.expectUserEditedSuccessDialog();

        await users.clickToEditUser(id);

        await users.editUserName(updatedUser.nome, employee.nome);

        id = await users.getIdByName(updatedUser.nome);

        await users.clickToEditUser(id);
    });

    test('CT-FE-023: Should successfuly delete an existing user', async ({ page, request }) => {
        const dashboard = new Dashboard(page);
        const header = new Header(page);
        const users = new Users(page);
        const employee = { name: 'Nova Func', email: 'nova.func@teste.com', password: '123456', type: 'Funcionário' }

        await login.loginWithCredentials(admin.email, admin.password);

        await login.clickToLogin();

        await dashboard.expectPageLoaded();

        await header.openUsers();

        await users.expectPageLoaded();

        await users.fillUserForm(employee.name, employee.email, employee.password, employee.type);

        await users.clickToCreateUser();

        const id = await users.getIdByName(employee.name);
        
        await users.expectDeleteUserConfirmationAndSuccessDialog(id);
        
        await users.clickToDeleteUser(id);

        await deleteUser(request, id);
    });
});