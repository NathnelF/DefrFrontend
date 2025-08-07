import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import path from 'path'

export default defineConfig({
	server: {
    https: true
  },
	plugins: [mkcert(), tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			'root': path.resolve(__dirname, './src'), 
		},
	},
});
