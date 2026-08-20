/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      // Todos los colores leen de variables CSS (globals.css) para que el diseño
      // se pueda re-tematizar cambiando un solo lugar.
      colors: {
        // Tokens del sistema visual "ivory editorial" (el diseño aprobado).
        ivory: 'var(--ivory)',
        ivorySoft: 'var(--ivory-soft)',
        cream: 'var(--cream)',
        card: 'var(--card)',
        thumb: 'var(--thumb)',
        sand: 'var(--sand)',
        sandbar: 'var(--sandbar)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        soft: 'var(--soft)',
        faint: 'var(--faint)',
        line: 'var(--line)',
        lineSoft: 'var(--line-soft)',
        accent: 'var(--accent)',
        accentSoft: 'var(--accent-soft)',
        accentPale: 'var(--accent-pale)',
        // Nombres antiguos que todavía usan algunas pantallas.
        wine: 'var(--accent)',
        wineSoft: 'var(--accent-soft)',
        linen: 'var(--sandbar)',
        camel: 'var(--accent-soft)',
        taupe: 'var(--soft)',
        charcoal: 'var(--ink)',
        clay: 'var(--accent)',
        claySoft: 'var(--accent-soft)',
        teal: 'var(--teal)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Helvetica Neue', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        tile: '3px',
        card: '16px',
        xl2: '22px',
        xl3: '28px',
      },
      boxShadow: {
        soft: '0 22px 48px -30px rgba(33, 30, 26, .5)',
      },
      maxWidth: {
        shell: '1240px',
      },
    },
  },
  plugins: [],
};
