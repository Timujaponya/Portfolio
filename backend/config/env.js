require("dotenv").config();
const path = require("path");

const defaultCorsOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
];

function parseCorsOrigins(origins) {
    if (!origins) {
        return defaultCorsOrigins;
    }

    const parsed = origins
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    return parsed.length ? parsed : defaultCorsOrigins;
}

module.exports = {
    githubToken:process.env.GITHUB_TOKEN,
    port:process.env.PORT || 3000,
    mongoUri:process.env.MONGODB_URI,
    nodeEnv:process.env.NODE_ENV || "development",
    corsOrigins:parseCorsOrigins(process.env.CORS_ORIGINS),
    uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads"),
    publicBaseUrl: (process.env.PUBLIC_BASE_URL || "").replace(/\/+$/, "")
}