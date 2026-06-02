export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="shell flex flex-col items-center justify-between gap-4 py-10 text-sm text-muted sm:flex-row">
        <span className="font-display text-lg text-ink">
          Taluna<span className="text-wine">.</span>
        </span>
        <span>© {new Date().getFullYear()} Taluna MX · Hecho a mano en México.</span>
        <span className="opacity-70">Ecosistema por Konekt AI</span>
      </div>
    </footer>
  );
}
