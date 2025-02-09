/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // フロントエンドの API エンドポイント
        destination: "/api/:path*", // Next.js の API Routes にリダイレクト
      },
    ];
  },
};

module.exports = nextConfig;
