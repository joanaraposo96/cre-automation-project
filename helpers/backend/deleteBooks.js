export async function deleteBook(request, id) {
    const response = await request.delete(`/livros/${id}`);

    const  body = await response.json();

    return { response, body };
}