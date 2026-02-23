import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Laravel の API (8000)サーバーへ
      },
      {
        source: '/sanctum/:path*',
        destination: 'http://localhost:8000/sanctum/:path*', // ← CSRF Cookie も Laravel 側に転送
      },
    ];
  },
};

export default nextConfig;
