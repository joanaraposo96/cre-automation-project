import { test, expect } from "@playwright/test";
import { listStatistics } from "../helpers/backend/listStatistics";

test.describe('Statistics', () => {
    test('CT-API-013: Should display the correct statistics numbers', async ({ request }) => {
        const fields = ['totalLivros', 'totalPaginas', 'totalUsuarios', 'usuariosPorTipo', 'arrendamentosPendentes', 'comprasPendentes'];

        const { response, body } = await listStatistics(request);

        expect(response.status()).toBe(200);

        Object.keys(body).forEach(field => {
            expect(body).toHaveProperty(field);

            if (field === 'usuariosPorTipo') {
                Object.keys(body[field]).forEach(tipo => {
                    expect(body[field][tipo]).toBeGreaterThan(0);
                    expect(Number.isInteger(body[field][tipo])).toBeTruthy();
                });
            } else {
                expect(body[field]).toBeGreaterThanOrEqual(0);
                expect(Number.isInteger(body[field])).toBeTruthy();
            }
        });
    });
});