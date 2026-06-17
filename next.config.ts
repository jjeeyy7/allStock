import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pdkzxpdjcapqzhlswjxz.supabase.co", // 👈 갓벽자님의 Supabase 주소
      },
    ],
  },
};

export default nextConfig;