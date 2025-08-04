import { redirect } from '@sveltejs/kit';

export const actions = {
  logout: async ({ cookies }) => {
    cookies.delete('auth-token', { path: '/' });

    throw redirect(303, '/');
  }
}
