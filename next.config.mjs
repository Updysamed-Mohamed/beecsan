/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ⭐ KAN MUHIIM AH
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // already good for static
  },
}

export default nextConfig
