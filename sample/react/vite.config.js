
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslintPlugin from 'vite-plugin-eslint'
import path from 'path'

export default defineConfig({
    resolve: {
        preserveSymlinks: true,
        alias: {
            '@': path.resolve(__dirname, './src'), // eslint-disable-line no-undef
            crypto: 'empty-module',
            assert: 'empty-module',
            http: 'empty-module',
            https: 'empty-module',
            os: 'empty-module',
            url: 'empty-module',
            zlib: 'empty-module',
            stream: 'empty-module',
            _stream_duplex: 'empty-module',
            _stream_passthrough: 'empty-module',
            _stream_readable: 'empty-module',
            _stream_writable: 'empty-module',
            _stream_transform: 'empty-module',
        },
    },
    optimizeDeps: { // 👈 optimizedeps
        esbuildOptions: {
            target: 'esnext',
            supported: {
                bigint: true
            },
        }
    },
    define: {
        'process.version': '{}',
    },
    build: {
        target: [
            'esnext', // 👈 build.target
        ],
    },
    plugins: [
        react(),
        eslintPlugin({
            cache: false,
            include: /\.(jsx?|tsx?|vue|svelte)$/,
        })
    ],
    server: {
        host: '0.0.0.0',
        port: 3000,
    },
})
