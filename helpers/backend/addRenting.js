export async function addRenting(request, rentData) {
    const response = await request.post('/arrendamentos', { data: rentData });
    
    const body = await response.json();

    return { response, body };
};