export async function removeFromFavourites(request, book) {
    const response = await request.delete('/favoritos', { data: book });
    
    const body = await response.json();

    return { response, body };
};