export async function listAvailableBooks(request) {
    const response = await request.get('/livros/disponiveis')
    
    const body = await response.json();

    return { response, body }
}