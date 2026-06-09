export async function loginUser(request, user) {
    const startTime = performance.now();

    const response = await request.post('/login', { data: user });

    const responseTime = performance.now() - startTime;

    const body = await response.json();

    return { response, body, responseTime };
}