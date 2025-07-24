"use strict";

const mongoose = require("mongoose");
const config = require("./index.config");
const logger = require("./../utils/logger.utils");
const User = require("../models/user.model");

// Optional: retry settings
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

let retries = 0;

const connectToDatabase = async () => {
    while (retries < MAX_RETRIES) {
        try {
            await mongoose.connect(config.database.uri);
            logger.info(" { module: 'db.config.js' } [DB] Successfully connected to MongoDB");
            break; // success, exit loop
        } catch (err) {
            retries++;
            logger.error(` { module: 'db.config.js' } [DB] Connection attempt ${retries} failed:`, err.message);
            if (retries >= MAX_RETRIES) {
                logger.error(" { module: 'db.config.js' } [DB] Max retries reached. Exiting...");
                process.exit(1); // hard exit if DB is essential
            }
            logger.info(` { module: 'db.config.js' } [DB] Retrying in ${RETRY_DELAY_MS / 1000} seconds...\n`);
            await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
        }
    }
};

// --- Mongoose Event Listeners ---
mongoose.connection.on("connected", () => {
    logger.info(" { module: 'db.config.js' } [DB] Mongoose is connected");
});

mongoose.connection.on("error", (err) => {
    logger.error(" { module: 'db.config.js' } [DB] Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
    logger.warn("{ module: 'db.config.js' } [DB] Mongoose disconnected");
});

mongoose.connection.on("reconnected", () => {
    logger.info("{ module: 'db.config.js' } [DB] Mongoose reconnected");
});

process.on("SIGINT", async () => {
    logger.info("\n { module: 'db.config.js' } [App] Caught interrupt signal (SIGINT). Closing DB connection...");
    try {
        await mongoose.connection.close();
        logger.info(" { module: 'db.config.js' } [DB] Mongoose disconnected gracefully. Exiting.");
        process.exit(0);
    } catch (err) {
        logger.error(" { module: 'db.config.js' } [DB] Error during graceful shutdown:", err.message);
        process.exit(1);
    }
});


connectToDatabase();
module.exports = {
    connectToDatabase,
};
