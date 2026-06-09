export async function addBook(request, book) {
    const response = await request.post('/livros', { data: book });
    
    const body = await response.json();

    return { response, body };
};