import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "https://subguard.onrender.com/api"}/:path*`, 
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zmwjvcepsrsxbwwmhsed.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
      },
    ],
  },
};

export default nextConfig;