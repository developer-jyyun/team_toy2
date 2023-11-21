/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'gravatar.com',
      'tong.visitkorea.or.kr',
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
