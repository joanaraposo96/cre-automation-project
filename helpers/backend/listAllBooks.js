export async function listAllBooks(request) {
    const response = await request.get('/livros')
    
    const body = await response.json();

    return { response, body }
}