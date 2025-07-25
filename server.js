// Core Imports
const express = require("express");
const helmet = require("helmet");
// const cors = require("cors");

// Configs & Utils
const config = require("./config/index.config");
const { connectToDatabase } = require("./config/db.config");
const logger = require("./utils/logger.utils"); // your pino logger

// App Initialization
const app = express();

// Connect DB
connectToDatabase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

// Optional: Log HTTP requests using Pino in dev
if (config.env.mode === "development") {
    app.use((req, res, next) => {
        logger.info({ method: req.method, url: req.url }, "Incoming request");
        next();
    });
}

// Routes
const routes = require("./routes/auth.routes");
app.use("/api/mvp", routes);

// 404 Handler
app.use((req, res) => {
    logger.warn({ url: req.originalUrl }, "404 Not Found");
    res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    logger.error({ err }, "Unhandled application error");
    res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = config.service.port || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT} in ${config.env.mode} mode`);
});
