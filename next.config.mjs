/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactivé : le double-montage StrictMode (dev) duplique les MotionValue
  // et désynchronise le pilotage du scroll. Sans impact en production.
  reactStrictMode: false,
};

export default nextConfig;
