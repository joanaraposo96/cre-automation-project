export async function approveRenting(request, id, status) {
    const response = await request.put(`/arrendamentos/${id}/status`, { data: status });
    
    const body = await response.json();

    console.log(body);

    return { response, body };
};