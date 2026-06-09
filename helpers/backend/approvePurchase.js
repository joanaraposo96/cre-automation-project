export async function approvePurchase(request, id, status) {
    const response = await request.put(`/compras/${id}/status`, { data: { status } });
    
    const body = await response.json();

    return { response, body };
};