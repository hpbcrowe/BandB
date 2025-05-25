import {
  DB_URI,
  API,
  NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "./config.js";
import { config } from "./middleware.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DB_URI: DB_URI,
    API: API,
    NEXTAUTH_SECRET: NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: GOOGLE_CLIENT_SECRET,
  },
};

export default nextConfig;
