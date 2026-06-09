export async function listSpecificUserBookRentals(request, id) {
    const response = await request.get(`/arrendamentos/me?usuarioId=${id}`);
    
    const body = await response.json();

    return { response, body };
}