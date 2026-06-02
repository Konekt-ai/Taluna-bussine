/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permite servir imágenes desde Supabase Storage y Unsplash (para los ejemplos).
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
};
module.exports = nextConfig;
