export async function listStatistics(request) {
    const response = await request.get('/estatisticas');
    
    const body = await response.json();

    return { response, body }
}