export async function listUsers(request) {
    const response = await request.get('usuarios');
    
    const body = await response.json();

    return { response, body };
};