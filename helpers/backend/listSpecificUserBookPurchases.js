export async function listSpecificUserBookPurchases(request, id) {
    const response = await request.get(`/compras/me?usuarioId=${id}`);
    
    const body = await response.json();

    return { response, body };
}