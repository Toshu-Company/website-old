import { defineConfig, sharpImageService } from "astro/config";
import react from "@astrojs/react";
import compress from "astro-compress";
import svelte from "@astrojs/svelte";
import vercel from '@astrojs/vercel/serverless';
import node from '@astrojs/node';
const isDev = process.env.NODE_ENV === "development";

// https://astro.build/config
export default defineConfig({
  image: {
    service: sharpImageService(),
  },
  vite: {
    legacy: {
      buildSsrCjsExternalHeuristics: !isDev,
    },
    ssr: {
      noExternal: ["styled-components"],
    },
    optimizeDeps: {
      exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
    },
  },
  integrations: [
    react(),
    svelte(),
    compress({
      CSS: false,
    }),
  ],
  output: 'server',
  adapter: vercel({
    analytics: true,
  }),
  // adapter: node({
  //   mode: 'standalone',
  // }),
});
