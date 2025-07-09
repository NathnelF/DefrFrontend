import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "$env/static/private";

export async function handle({ event, resolve }) {

  const token = event.cookies.get('auth-token'); 

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (decoded && typeof decoded === 'object'){
          event.locals.user = { email: decoded.email };
      }
    } catch (error){
      console.error('Invalid token', error.message);
      event.locals.user = null;
    }
  }

  const response = await resolve(event);
  return response;
}