import type { NextConfig } from "next";

/** Security + caching headers. Good-practice signals for SEO/Lighthouse. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // Emit smaller, faster HTML/CSS.
  compress: true,
  poweredByHeader: false,
  // Allow next/image to optimise blog cover images served from Supabase
  // storage (the project's own bucket, over https only).
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yyxnuwyputwpimepviyl.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // The Insights section was renamed to Blog. 308 permanent redirects preserve
  // the SEO value of the old URLs (already submitted to Search Console) and
  // stop old links 404-ing. Article slugs are unchanged, so /:slug maps 1:1.
  async redirects() {
    return [
      { source: "/insights", destination: "/blog", permanent: true },
      {
        source: "/insights/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
