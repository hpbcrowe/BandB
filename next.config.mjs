import { DB_URI, API, NEXTAUTH_SECRET } from "./config.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DB_URI: DB_URI,
    API: API,
    NEXTAUTH_SECRET: NEXTAUTH_SECRET,
  },
};

export default nextConfig;
