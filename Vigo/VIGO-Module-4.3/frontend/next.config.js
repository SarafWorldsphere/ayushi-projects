/** @type {import('next').NextConfig} */

// SWAIS standard: the ONLY next config file in this repo.
// basePath comes from env so the same code runs behind any prefix.
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  reactStrictMode: true,
};

module.exports = nextConfig;
