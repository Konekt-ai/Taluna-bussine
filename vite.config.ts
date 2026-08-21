// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        strategies: "generateSW",
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        manifest: false,
        devOptions: { enabled: false },
        workbox: {
          globPatterns: ["**/*.{js,css}"],
          navigateFallback: null,
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              // Lovable CDN assets: images, videos, fonts (immutable URLs)
              urlPattern: ({ url }: { url: URL }) =>
                url.origin === self.location.origin && url.pathname.startsWith("/__l5e/assets-v1/"),
              handler: "CacheFirst",
              options: {
                cacheName: "taluna-media-v1",
                expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 60 },
                cacheableResponse: { statuses: [0, 200] },
                rangeRequests: true,
              },
            },
            {
              // Hashed build assets + local static media
              urlPattern: ({ url, request }: { url: URL; request: Request }) =>
                url.origin === self.location.origin &&
                (request.destination === "image" ||
                  request.destination === "video" ||
                  request.destination === "font" ||
                  url.pathname.startsWith("/_build/") ||
                  url.pathname.startsWith("/assets/")),
              handler: "CacheFirst",
              options: {
                cacheName: "taluna-static-v1",
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] },
                rangeRequests: true,
              },
            },
            {
              urlPattern: ({ url }: { url: URL }) =>
                url.origin === "https://fonts.googleapis.com" ||
                url.origin === "https://fonts.gstatic.com",
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "taluna-fonts-v1",
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // HTML navigations: always network-first so content stays fresh
              urlPattern: ({ request }: { request: Request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "taluna-pages-v1",
                networkTimeoutSeconds: 4,
                expiration: { maxEntries: 30 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
    ],
  },
});
