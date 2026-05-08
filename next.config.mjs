/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // TS errors unna build avthundi
  },
  eslint: {
    ignoreDuringBuilds: true, // Linting errors unna build avthundi
  },
};

export default nextConfig;