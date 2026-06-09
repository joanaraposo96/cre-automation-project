export async function listUserFavourites(request, usuarioId) {
    const response = await request.get(`/favoritos/${usuarioId}`);
    
    const body = await response.json();

    return { response, body };
};