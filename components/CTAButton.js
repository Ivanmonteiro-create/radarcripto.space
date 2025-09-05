export default function CTAButton({
  href = "/simulador",
  children = "Acessar simulador",
}) {
  return (
    <a href={href} className="btn-cta" aria-label={children}>
      {/* ícone (play) simples só pra reforçar ação */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        style={{ marginRight: 8 }}
      >
        <path d="M8 5v14l11-7z" />
      </svg>
      {children}
    </a>
  );
}
