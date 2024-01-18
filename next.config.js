/** @type {import('next').NextConfig} */

// Intl config
const withNextIntl = require('next-intl/plugin')(
    "./src/lib/intl/i18n.config.ts",
);

const nextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400", // Caching the homepage for 1 hour
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
