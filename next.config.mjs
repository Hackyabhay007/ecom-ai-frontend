/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['148.135.138.221','medusa-public-images.s3.eu-west-1.amazonaws.com','example.com','plus.unsplash.com' ,'localhost','images.pexels.com','randomuser.me'], // Add the hostname here
  },
};

export default nextConfig;
