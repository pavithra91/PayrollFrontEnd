import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dynamicImport from 'vite-plugin-dynamic-import'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3000,
        proxy: {
            '/api': {
                // config the target url based on your backend server
                target: 'https://localhost:44360/',
                //target: 'http://13.234.120.62/',
                //target: 'http://internal-cpstl-poc-internal-alb-1716520389.ap-southeast-1.elb.amazonaws.com/',
                //target: 'http://cpstl-poc-ebankng-alb-664275385.ap-southeast-1.elb.amazonaws.com/',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    plugins: [
        react({
            babel: {
                plugins: ['babel-plugin-macros'],
            },
        }),
        dynamicImport(),
    ],
    assetsInclude: ['**/*.md'],
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
    },
    build: {
        outDir: 'build',
    },
})
