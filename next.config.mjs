// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//       domains: ['cdn.discordapp.com'], // Add the appropriate domain here
//     },
//   };

// module.exports = nextConfig

import million from 'million/compiler';
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com'], // Add the appropriate domain here
  },
};
 
const millionConfig = {
  auto: true,
  // if you're using RSC:
  // auto: { rsc: true },
}
 
export default million.next(nextConfig, millionConfig);