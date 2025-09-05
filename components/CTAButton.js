export default function CTAButton({ children = 'Acessar simulador', href = '#' , variant='solid' }) {
  const cls = variant === 'ghost' ? 'btn ghost' : 'btn';
  return <a className={cls} href={href}>{children}</a>;
}
