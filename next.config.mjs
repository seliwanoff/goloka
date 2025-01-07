/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "goloka.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
