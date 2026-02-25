import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    base: '/scribe/app/',
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'icons/*.png'],
            manifest: {
                name: 'Hanna Scribe',
                short_name: 'Scribe',
                description: 'Intelligent clinical documentation',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/scribe/app/',
                icons: [
                    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
                    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com/,
                        handler: 'CacheFirst',
                        options: { cacheName: 'google-fonts-stylesheets' }
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-webfonts',
                            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
                        }
                    }
                ]
            }
        })
    ],
    server: {
        port: 5174,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
})
