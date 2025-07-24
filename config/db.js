"use strict";

const mongoose = require("mongoose");
const config = require("./index");

// Optional: retry settings
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

let retries = 0;

const connectToDatabase = async () => {
    while (retries < MAX_RETRIES) {
        try {
            await mongoose.connect(config.database.uri);
            console.log("[DB] Successfully connected to MongoDB");
            break; // success, exit loop
        } catch (err) {
            retries++;
            console.error(`[DB] Connection attempt ${retries} failed:`, err.message);
            if (retries >= MAX_RETRIES) {
                console.error("[DB] Max retries reached. Exiting...");
                process.exit(1); // hard exit if DB is essential
            }
            console.log(`[DB] Retrying in ${RETRY_DELAY_MS / 1000} seconds...\n`);
            await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
        }
    }
};

// --- Mongoose Event Listeners ---
mongoose.connection.on("connected", () => {
    console.log("[DB] Mongoose is connected");
});

mongoose.connection.on("error", (err) => {
    console.error("[DB] Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
    console.warn("[DB] Mongoose disconnected");
});

mongoose.connection.on("reconnected", () => {
    console.log("[DB] Mongoose reconnected");
});

process.on("SIGINT", async () => {
    console.log("\n [App] Caught interrupt signal (SIGINT). Closing DB connection...");
    try {
        await mongoose.connection.close();
        console.log(" [DB] Mongoose disconnected gracefully. Exiting.");
        process.exit(0);
    } catch (err) {
        console.error(" [DB] Error during graceful shutdown:", err.message);
        process.exit(1);
    }
});

module.exports = {
    connectToDatabase,
};
