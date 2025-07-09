import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
  const user = locals.user;

  if (user) {
    return json(user);
  }

  return new Response(null, { status: 204 });
}