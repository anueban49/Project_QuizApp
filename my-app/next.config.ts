import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    GENAI_API_KEY: process.env.GENAI_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  async rewrites() {
    return [
      {
        source: "/docs/:slug*",
        destination: "/docs/md/:slug*",
        has: [
          {
            type: "header",
            key: "accept",
            value: "(.*)text/markdown(.*)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
