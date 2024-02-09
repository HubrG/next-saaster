/** @type {import('next').NextConfig} */

// Intl config
const withNextIntl = require("next-intl/plugin")(
  "./src/lib/intl/i18n.config.ts"
);

const nextConfig = {
  reactStrictMode: true,
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    STRIPE_SIGNIN_SECRET: process.env.STRIPE_SIGNIN_SECRET,
  },
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
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
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
