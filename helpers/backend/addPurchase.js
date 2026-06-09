export async function addPurchase(request, purchaseData) {
    const response = await request.post('/compras', { data: purchaseData });
    
    const body = await response.json();

    return { response, body };
};