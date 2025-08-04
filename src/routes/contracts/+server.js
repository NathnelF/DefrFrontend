export async function GET({ fetch }) {
  try {
    const res = await fetch('https://localhost:7246/contracts');
    if (!res.ok) {
      return new Response('Failed to fetch contracts server', {
        status: res.status,
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response('Internal server error', {
      status: 500
    });
  }
}
