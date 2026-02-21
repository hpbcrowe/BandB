// import {
//   DB_URI,
//   API,
//   NEXTAUTH_SECRET,
//   GOOGLE_CLIENT_ID,
//   GOOGLE_CLIENT_SECRET,
// } from "./config.js";
//import { config } from "./middleware.js";

const config = require("./config.js");

const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  env: {
    DB_URI: config.DB_URI,
    API: config.API,
    NEXTAUTH_SECRET: config.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: config.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: config.GOOGLE_CLIENT_SECRET,
    CLOUDINARY_CLOUD_NAME: config.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: config.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: config.CLOUDINARY_API_SECRET,
    STRIPE_PUBLISHABLE_KEY: config.STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: config.STRIPE_SECRET_KEY,
    STRIPE_TAX_RATE: config.STRIPE_TAX_RATE,
  },
  // Note: Only set a webpack override when running without Turbopack. When
  // Turbopack is active Next will warn if a `webpack` config is present but no
  // `turbopack` config is provided. We therefore only add this override when
  // NEXT_USE_TURBOPACK is explicitly disabled (set to '0').
};

// No webpack overrides applied to avoid Turbopack warnings when running with
// the default Turbopack dev server. If you need to run without Turbopack,
// set NEXT_USE_TURBOPACK=0 in your environment and add a webpack override
// dynamically in a local-only config.

module.exports = nextConfig;
