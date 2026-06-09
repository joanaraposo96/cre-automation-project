export async function updateBook(request, id, updatedBook) {
    const response = await request.put(`/livros/${id}`, { data: updatedBook });
    
    const body = await response.json();
    
    return { response, body };
}