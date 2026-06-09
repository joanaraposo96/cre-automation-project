import { test, expect } from "@playwright/test";
import { registerUser } from "../helpers/backend/registerUser";
import { updateUser } from "../helpers/backend/updateUser";
import { deleteUser } from "../helpers/backend/deleteUser";
import { listUsers } from "../helpers/backend/listUsers";
import { faker } from "@faker-js/faker";


test.describe('Users', () => {
    let admin = { id: 1, nome: 'Admin Master', email: 'admin@biblioteca.com', senha: 'senha123', tipo: 3 }; // seeded in the db.
    let employee = { id: 2, nome: 'João Funcionário', email: 'func@biblio.com', senha: 'senha123', tipo: 2 }; // seeded in the db.
    let student = { id: 3, nome: 'Maria Aluna', email: 'aluna@teste.com', senha: 'senha123', tipo: 1 }; // seeded in the db.

    test('CT-API-029: Should list all users', async ({ request }) => {
        const { response, body } = await listUsers(request);

        expect(response.status()).toBe(200);

        expect(Array.isArray(body)).toBe(true);

        expect(body.length).toBeGreaterThan(0);

        body.forEach(user => {
            expect(user).not.toHaveProperty('senha');
        });
    });

    test('CT-API-030: Should allow updating users', async ({ request }) => {
        const updatedUser = { ...student, email: 'aluna_atualizado@teste.com'}

        const { response, body } = await updateUser(request, student.id, updatedUser);

        expect(response.status()).toBe(200);

        expect(body.nome).toBe(updatedUser.nome);

        expect(body.email).toBe(updatedUser.email);

        expect(body.tipo).toBe(student.tipo);

        const reset_user = { ...student }

        await updateUser(request, student.id, reset_user);
    });

    test('CT-API-031: Should be able to remove non-admin user', async ({ request }) => {
        const user = { nome: faker.person.fullName(), email: faker.internet.email, senha: faker.internet.password(), tipo: 2 };

        await registerUser(request, user);

        const { body: users } = await listUsers(request);

        const id = users.find(u => u.nome === user.nome).id;

        const { response, body } = await deleteUser(request, id);

        expect(response.status()).toBe(200);

        expect(body.mensagem).toBe('Usuário deletado com sucesso');
    });

    test('CT-API-032: Should not allow to remove admin user', async ({ request }) => {
        const { response, body } = await deleteUser(request, admin.id);

        expect(response.status()).toBe(403);
        
        expect(body.mensagem).toBe('Admin principal não pode ser deletado');
    });

});