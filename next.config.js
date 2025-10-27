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
  env: {
    DB_URI: config.DB_URI,
    API: config.API,
    NEXTAUTH_SECRET: config.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: config.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: config.GOOGLE_CLIENT_SECRET,
    CLOUDINARY_CLOUD_NAME: config.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: config.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: config.CLOUDINARY_API_SECRET,
  },
};

module.exports = nextConfig;
