import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Nestle/',
    plugins: [
        react(),
            VitePWA({
                  registerType: 'autoUpdate',
                        manifest: {
                                name: 'Nestle',
                                        short_name: 'Nestle',
                                                description: 'Your home, organised',
                                                        theme_color: '#0F0F0F',
                                                                background_color: '#0F0F0F',
                                                                        display: 'standalone',
                                                                                orientation: 'portrait',
                                                                                        start_url: '.',
                                                                                                icons: [
                                                                                                          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
                                                                                                                    { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
                                                                                                                            ],
                                                                                                                                  },
                                                                                                                                      }),
                                                                                                                                        ],
                                                                                                                                        })