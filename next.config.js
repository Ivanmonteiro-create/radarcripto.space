/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Libera TradingView, Binance WS e estilos inline (necessários para o widget)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://s3.tradingview.com",
              "style-src 'self' 'unsafe-inline' https://s3.tradingview.com https://www.tradingview.com",
              "img-src * blob: data:",
              "font-src 'self' data:",
              "connect-src 'self' https://* wss://stream.binance.com",
              "frame-src https://s.tradingview.com https://www.tradingview.com",
              "frame-ancestors 'self'",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
