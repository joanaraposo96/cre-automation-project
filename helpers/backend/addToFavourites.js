export async function addToFavourites(request, book) {
    const response = await request.post('/favoritos', { data: book });
    
    const body = await response.json();

    return { response, body };
};