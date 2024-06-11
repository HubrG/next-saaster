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
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    TRANSLATE_API_KEY: process.env.TRANSLATE_API_KEY
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
// 
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400", 
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
