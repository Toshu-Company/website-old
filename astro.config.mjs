import { defineConfig, sharpImageService } from 'astro/config';
import react from "@astrojs/react";
import compress from "astro-compress";
const isDev = process.env.NODE_ENV === 'development';

// https://astro.build/config
export default defineConfig({
    experimental: {
        assets: true
    },
    image: {
        service: sharpImageService()
    },
    vite: {
        legacy: {
            buildSsrCjsExternalHeuristics: !isDev
        },
        ssr: {
            noExternal: ['styled-components']
        }
    },
    integrations: [react(), compress({
        CSS: false,
    })]
});