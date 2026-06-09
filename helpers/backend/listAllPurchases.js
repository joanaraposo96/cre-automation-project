export async function listAllPurchases(request) {
    const response = await request.get('/compras')
    
    const body = await response.json();

    return { response, body }
}