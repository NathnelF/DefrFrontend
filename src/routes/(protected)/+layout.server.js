import { redirect } from '@svelte.js'

export function load({ fetch }){
  if (!locals.user){
    throw redirect(303, '/')
  }

  return {
    user: locals.user
  };
}
