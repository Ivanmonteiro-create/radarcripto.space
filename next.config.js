/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Português -> Inglês
      { source: '/sobre', destination: '/about', permanent: true },
      { source: '/planos', destination: '/plans', permanent: true },
      { source: '/contato', destination: '/contact', permanent: true },
      { source: '/fale-com-agente', destination: '/contact', permanent: true },
      { source: '/acessar-simulador', destination: '/simulator', permanent: true },
      { source: '/simulador', destination: '/simulator', permanent: true },
    ];
  },
};

module.exports = nextConfig;
