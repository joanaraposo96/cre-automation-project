import { expect } from "@playwright/test";

export async function deleteUser(request, id) {
    const response = await request.delete(`/usuarios/${id}`);

    const body = await response.json();

    return { response, body };
}