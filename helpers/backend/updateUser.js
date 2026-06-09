export async function updateUser(request, id, updatedUser) {
    const response = await request.put(`/usuarios/${id}`, { data: updatedUser });
    
    const body = await response.json();
    
    return { response, body };
}