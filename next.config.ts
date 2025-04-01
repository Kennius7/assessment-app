import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // domains: ["picsum.photos", "fastly.picsum.photos"],
    // remotePatterns: ["picsum.photos", "fastly.picsum.photos"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/id/**",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
        port: "",
        pathname: "/id/**",
      },
    ],
  },
};

export default nextConfig;
