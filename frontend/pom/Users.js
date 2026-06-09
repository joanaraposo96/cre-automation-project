import { expect } from "@playwright/test";

export class Users {
    constructor(page) {
        this.page = page;
        this.form = page.locator('#form-novo-usuario');
        this.usersTable = page.locator('#lista-usuarios');
        this.name = page.getByRole('textbox', { name: 'Nome:' });
        this.email = page.getByRole('textbox', { name: 'Email:' });
        this.password = page.getByRole('textbox', { name: 'Senha:' });
        this.type = page.getByLabel('Tipo:');
        this.createUser = page.getByRole('button', { name: 'Criar Usuário' });
        this.userName = (name) => page.locator(`input[data-campo="nome"][value="${name}"]`);
        this.userEmail = (email) => page.locator(`input[data-campo="email"][value="${email}"]`);
        this.userType = (id, type) => page.locator(`select[data-campo="tipo"][data-id="${id}"]`).filter({ hasText: type });
        this.userId = (id) => page.getByRole('cell', { name: `${id}`, exact: true});
        this.saveButton = (id) => page.locator(`tr:has(td:text-is("${id}")) button[onclick*="salvar"]`);
        this.deleteButton = (id) => page.locator(`tr:has(td:text-is("${id}")) button[onclick*="excluir"]`);
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/admin-usuarios.html');
    }

    async expectElementsToBeVisible() {
        await expect(this.form).toBeVisible();
        await expect(this.usersTable).toBeVisible();
    }

    async fillUserForm(name, email, password, type) {
        await this.name.fill(name);
        await this.email.fill(email);
        await this.password.clear();
        await this.password.fill(password);
        await this.type.selectOption({ label: type });
    }

    async expectUserCreatedSuccessDialog() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Usuário criado com sucesso!');
            await dialog.accept();
        });
    }

    async expectUserEditedSuccessDialog() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Usuário atualizado com sucesso!');
            await dialog.accept();
        });
    }

    async clickToCreateUser() {
        await this.createUser.click();
    }

    async getIdByName(name) {
        return await this.page
            .locator(`.input-inline[data-campo="nome"][value="${name}"]`)
            .getAttribute('data-id');
    }

    async expectUserInfoToBeVisible(id, name, email, type) {
        await expect(this.userId(id)).toBeVisible();
        await expect(this.userName(name)).toBeVisible();
        await expect(this.userEmail(email)).toBeVisible();
        await expect(this.userType(id, type)).toBeVisible();
    }

    async editUserName(oldName, newName) {       
        await this.userName(oldName).clear();
        await this.userName(oldName).fill(newName);
    }

    async clickToEditUser(id) {
        await this.saveButton(id).click();
    }

    async getIdByName(name) {
        return await this.page
            .locator(`.input-inline[data-campo="nome"][value="${name}"]`)
            .getAttribute('data-id');
    }

    async expectDeleteUserConfirmationAndSuccessDialog(id) {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toBe(`Deseja realmente excluir o usuário #${id}?`);
            await dialog.accept();

            this.page.once('dialog', async dialog => {
                expect(dialog.message()).toBe('Usuário excluído com sucesso!');
                await dialog.accept();
            });
        });
    }

    async clickToDeleteUser(id) {
        await this.deleteButton(id).click();
    }
}
