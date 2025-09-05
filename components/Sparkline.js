// components/Sparkline.js
export default function Sparkline({ data = [], width = 520, height = 120, stroke = '#22c55e' }) {
  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const norm = (v) => {
    if (max === min) return height / 2;
    const t = (v - min) / (max - min);
    return height - t * height;
  };
  const step = width / (data.length - 1);

  const d = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${norm(v)}`).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" />
      <path d={`${d} L ${width} ${height} L 0 ${height} Z`} fill="url(#sg)" />
    </svg>
  );
}
