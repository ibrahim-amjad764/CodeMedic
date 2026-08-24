import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // CodeMedic never sends user-submitted code anywhere except our own
  // server-side OpenRouter call, and it never executes it. No custom
  // headers, rewrites, or experimental flags are needed for this MVP.
};

export default nextConfig;
