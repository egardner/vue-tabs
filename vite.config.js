import { defineConfig } from 'vite'
import path from 'path';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		target: 'es2015',
		minify: true,
		emptyOutDir: true,

		lib: {
			name: 'VueTabs',
			entry: path.resolve( __dirname, 'src/lib.js' ),
			formats: [ 'esm', 'cjs' ]
		},

		rollupOptions: {
			output: {
				entryFileNames: 'vue-tabs.[format].js',
				assetFileNames: 'vue-tabs.[name].[ext]'
			},

			external: [ 'vue' ]
		}
	},

	plugins: [ vue() ]
} );
