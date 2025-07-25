"use strict";
require('dotenv').config({ debug: true });

ensureEnvVars([
  'SERVICE_HOST',
  'SERVICE_NAME',
  'SERVICE_VERSION',
  'SERVICE_PORT',
  'SERVICE_SECRET_KEY',
  'DATABASE_TYPE',
  'MONGO_URI',
  'JWT_SECRET',
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_REFRESH_TOKEN_SECRET",
  "JWT_ACCESS_EXPIRY",
  "JWT_REFRESH_EXPIRY",
]);


function ensureEnvVars(vars) {
  vars.forEach((envVar) => {
    if (!process.env[envVar])  throw new Error(`Missing environment variable: ${envVar}`);
    // else logger.info(`Environment variable ${envVar} is set to ${process.env[envVar]}.`); // have to remove this line in production
  });
}

const config = {
  service: {
    host: process.env.SERVICE_HOST,
    name: process.env.SERVICE_NAME,
    version: process.env.SERVICE_VERSION,
    port: parseInt(process.env.SERVICE_PORT, 10),
    secretKey: process.env.SERVICE_SECRET_KEY
  },
  database: {
    type: process.env.DATABASE_TYPE,
    uri: process.env.MONGO_URI
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpiry: parseInt(process.env.JWT_ACCESS_EXPIRY),
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExpiry: parseInt(process.env.JWT_REFRESH_EXPIRY)
  }
};

module.exports = config;