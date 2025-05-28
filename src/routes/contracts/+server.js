export async function GET() {
  try {
    const res = await fetch('http://localhost:5025/contracts');
    if (!res.ok) {
      return new Response('Failed to fetch contracts from backend.', {
        status: res.status,
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Server error in /contracts:', error);
    return new Response('Internal server error', {
      status: 500
    });
  }
}