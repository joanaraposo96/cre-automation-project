import { expect } from "@playwright/test";

export async function registerUser(request, user) {
    const response = await request.post('/registro', { data: user });

    const body = await response.json();

    return { response, body };
};