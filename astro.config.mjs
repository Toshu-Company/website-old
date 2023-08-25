import { defineConfig } from 'astro/config';

import react from "@astrojs/react";

const isDev = process.env.NODE_ENV === 'development';

// https://astro.build/config
export default defineConfig({
    experimental: {
        assets: true
    },
    vite: {
        legacy: {
            buildSsrCjsExternalHeuristics: !isDev
        },
        ssr: {
            noExternal: ['styled-components']
        },
    },
    integrations: [react()]
});