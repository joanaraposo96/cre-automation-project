import { faker } from "@faker-js/faker";

export async function userData() {
    return {
        nome: faker.person.fullName(), 
        email: faker.internet.email(),
        senha: faker.internet.password() 
    }
};