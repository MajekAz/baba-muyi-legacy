import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "260mb"
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co"
      },
      {
        protocol: "https",
        hostname: "img.youtube.com"
      }
    ]
  },
  async redirects() {
    return [
      {
        source: "/early-life",
        destination: "/biography#early-life-the-roots-that-shaped-a-leader",
        permanent: true
      },
      {
        source: "/journey-to-bariga",
        destination: "/biography#from-iboogun-to-bariga-the-journey-that-changed-everything",
        permanent: true
      },
      {
        source: "/community-leadership",
        destination: "/biography#beyond-business-a-leader-who-served-his-community",
        permanent: true
      },
      {
        source: "/bolekaja",
        destination: "/biography#from-bolekaja-to-tioluwa-lase-a-legacy-on-the-roads-of-lagos",
        permanent: true
      },
      {
        source: "/tioluwa-lase-molue",
        destination: "/biography#from-bolekaja-to-tioluwa-lase-a-legacy-on-the-roads-of-lagos",
        permanent: true
      },
      { source: "/routes-and-locations", destination: "/timeline", permanent: true },
      { source: "/journey-map", destination: "/timeline", permanent: true },
      { source: "/family", destination: "/gallery", permanent: true },
      { source: "/transport-gallery", destination: "/gallery", permanent: true },
      { source: "/bolekaja-gallery", destination: "/gallery", permanent: true },
      { source: "/molue-gallery", destination: "/gallery", permanent: true },
      { source: "/community-gallery", destination: "/gallery", permanent: true },
      { source: "/restored-images", destination: "/gallery", permanent: true },
      { source: "/portraits", destination: "/gallery", permanent: true },
      { source: "/documents", destination: "/gallery", permanent: true },
      { source: "/english-documentary", destination: "/documentaries", permanent: true },
      { source: "/documentary-episodes", destination: "/documentaries", permanent: true },
      { source: "/trailer-clips", destination: "/documentaries", permanent: true },
      { source: "/transcripts", destination: "/documentaries", permanent: true },
      { source: "/family-memories", destination: "/tributes", permanent: true }
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
