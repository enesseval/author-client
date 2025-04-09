/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      domains: ["images.unsplash.com", "res.cloudinary.com"],
   },
   eslint: {
      ignoreDuringBuilds: true, // Build sırasında ESLint hatalarını görmezden gel
   },
   experimental: {
      runtime: "nodejs",
      serverComponents: true,
   },
};

module.exports = nextConfig;
