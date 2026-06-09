import { faker } from "@faker-js/faker";

export async function bookData() {
    return {
        nome: `${faker.book.title()} ${faker.string.nanoid(5)}`,
        autor: faker.book.author(),
        paginas: faker.number.int({ min: 80, max: 600 }),
        descricao: faker.lorem.paragraph(),
        imagemUrl: faker.image.url(),
        estoque: faker.number.int({ min: 5, max: 10 }),
        preco: faker.number.float({ min: 5, max: 50, fractionDigits: 1 })
    };
};