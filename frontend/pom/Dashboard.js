import { expect } from '@playwright/test';
import { executionAsyncId } from 'node:async_hooks';
import { listAvailableBooks } from '../../helpers/backend/listAvailableBooks';

export class Dashboard {
    constructor(page) {
        this.page = page;
        this.header = page.getByRole('heading', { name: 'Minha Biblioteca' });
        this.totalBooks = page.getByRole('heading', { name: 'Total de Livros' });
        this.totalUsers = page.getByRole('heading', { name: 'Total de Usuários' });
        this.availableBooks = page.getByRole('heading', { name: 'Livros Disponíveis', level: 3 });
        this.students = page.getByRole('heading', {name: 'Alunos'});
        this.registeredStudents = page.getByRole('heading', {name: 'Alunos Cadastrados'});
        this.employees = page.getByRole('heading', {name: 'Funcionários'});
        this.administrators = page.getByRole('heading', {name: 'Administradores'});
        this.recentBooksGrid = page.locator('#livros-recentes');
        this.bookCards = page.locator('div.book-card');
        this.statCards = page.locator('div.stat-card');
    }

    async navigateToPage() {
        await this.page.goto('/dashboard.html');
    }

    async expectPageLoaded() {
        await expect(this.page).toHaveURL('/dashboard.html');
    }

    async expectUsernameOnHeader(username) {
        const locator = this.page.getByText(`${username}`);
        expect(locator).toBeVisible();
    }

    async expectDataToBeStoredInLocalStorage() {
        const key = await this.page.evaluate(() => {
            return Object.keys(localStorage);
        });

        console.log(key); // OUTPUT: ['usuario'] -> Object

        const usuario = await this.page.evaluate(() => {
            return JSON.parse(localStorage.getItem('usuario'));
        });

        console.log(usuario);

        expect(usuario.tipo).toBe(3);
    }

    async expectAdminStatisticsToBeVisible() {
        const statisticsCards = [
            this.totalBooks,
            this.totalUsers,
            this.availableBooks,
            this.students,
            this.employees,
            this.administrators
        ]

        for (const card of statisticsCards) {
            expect(card).toBeVisible();
        }
    }

    async expectStudentStatisticsToBeVisible() {
        const statisticsCards = [
            this.availableBooks,
            this.totalBooks,
            this.registeredStudents
        ]

        for (const card of statisticsCards) {
            expect(card).toBeVisible();
        }
    }

    async countBookGrid(request) {
        const { body } = await listAvailableBooks(request);

        if (body.length > 0) {
            await expect(this.bookCards.first()).toBeVisible();

            const numberOfAvailableBooks = await this.statCards
                .filter({ hasText: 'Livros Disponíveis' })
                .locator('div.number')
                .innerText();

            await expect(Number(numberOfAvailableBooks)).toBeGreaterThan(0);
        }
    }

    async expectMax5BooksToBeVisible() {
        const totalBooksText = await this.page
            .locator('.stat-card', { hasText: 'Total de Livros' })
            .locator('.number').textContent();
        
        const totalBooks = Number(totalBooksText);
        
        const visibleBooks = await this.page
            .locator('div.book-card:visible')
            .count();
        
        expect(visibleBooks).toBeLessThanOrEqual(5);
        
        if (totalBooks > 5) {
            expect(visibleBooks).toBe(5);
        }
    }

    async expectBookCardToLoadAllInfoSuccessfully(heading, author, stock, price) {
        const bookCard = this.bookCards.filter({ hasText: heading }).first();
        await expect(bookCard).toBeVisible();

        await this.page.waitForLoadState('networkidle');

        const loaded = await bookCard.locator('img').evaluate(img => img.naturalWidth > 0);
        expect(loaded).toBe(true);
        
        await expect(bookCard.getByRole('heading', { name: heading })).toBeVisible();
        await expect(bookCard.getByRole('paragraph').filter({ hasText: `Autor: ${author}`})).toBeVisible();
        await expect(bookCard.getByRole('paragraph').filter({ hasText: `Estoque: ${stock}` })).toBeVisible();
        await expect(bookCard.getByRole('paragraph').filter({ hasText: `€ ${price}` })).toBeVisible();         
    }
}