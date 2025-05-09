// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Silence warnings
//   // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
//   webpack: (config) => {
//     config.externals.push("pino-pretty", "lokijs", "encoding");
//     return config;
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: '*.ipfs.dweb.link',
      },
      // Add other IPFS gateways you might use
    ],
    // Optional performance optimizations
    formats: ['image/webp'],
    minimumCacheTTL: 3600, // 1 hour cache
  },

  // Existing webpack configuration
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },

  // Optional: Enable React strict mode
  reactStrictMode: true,
};

export default nextConfig;