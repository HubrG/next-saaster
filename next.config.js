/** @type {import('next').NextConfig} */
const nextConfig = {
  // Change the host of your assets management
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

module.exports = nextConfig;
