export async function listSpecificBook(request, id) {
    const response = await request.get(`/livros/${id}`);
    
    const body = await response.json();

    return { response, body };
}