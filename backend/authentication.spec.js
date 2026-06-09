import { test, expect } from "@playwright/test";
import { registerUser } from "../helpers/backend/registerUser";
import { deleteUser } from "../helpers/backend/deleteUser";
import { loginUser } from "../helpers/backend/loginUser";
import { listUsers } from "../helpers/backend/listUsers";
import { faker } from "@faker-js/faker";
import { userData } from "../test-data/backend/users";

test.describe('Account Registration', () => {
    let student = { nome: 'Maria Aluna', email: 'aluna@teste.com', senha: '123456', tipo: 1 } // seeded in the db.

    test('CT-API-001: Should successfully register a new user', async ({ request }) => {
        const user = await userData();

        const { response, body } = await registerUser(request, user);

        expect(response.status()).toBe(201);

        expect(body.mensagem).toBe('Usuário criado com sucesso');

        const fields = ['id', 'nome', 'email', 'tipo'];

        fields.forEach(field => {
            expect(body.usuario).toHaveProperty(field);
        });

        expect(body.usuario).not.toHaveProperty('senha');
        
        expect(Number.isInteger(body.usuario.tipo)).toBe(true);

        const { body: userId } = await listUsers(request);

        const id = userId.find(u=> u.email === user.email).id;

        await deleteUser(request, id);
    });

    test('CT-API-002: Should not be able to register an already existing account', async ({ request }) => {
        const { response, body } = await registerUser(request, student);

        expect(response.status()).toBe(400);

        expect(body.mensagem).toBe('Email já cadastrado');
    });
});

test.describe('Account Login', () => {
    let admin = { email: 'admin@biblioteca.com', senha: '123456'} // seeded in the db.

    test('CT-API-003: Should successfully login with administrator account', async ({ request }) => {
        const { response, body, responseTime } = await loginUser(request, admin);

        expect(response.status()).toBe(200);

        expect(body.mensagem).toBe('Login realizado com sucesso');

        expect(body.usuario).not.toHaveProperty('senha');

        expect(body.usuario.tipo).toBe(3);

        expect(responseTime).toBeLessThan(2000);
    });

    test('CT-API-004: Should not be able to login with invalid credentials', async ({ request }) => {
        const wrongCredentials = { email: admin.email, senha: 'wrongPassword' }

        const { response, body } = await loginUser(request, wrongCredentials);

        expect(response.status()).toBe(401);

        expect(body.mensagem).toBe('Email ou senha incorretos');
    });
});