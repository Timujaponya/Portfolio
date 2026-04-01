require("dotenv").config();
const path = require("path");

const defaultCorsOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
];

function normalizeOrigin(origin) {
    return String(origin || "").trim().replace(/\/+$/, "").toLowerCase();
}

function parseCorsOrigins(origins) {
    if (!origins) {
        return defaultCorsOrigins.map(normalizeOrigin);
    }

    const parsed = String(origins)
        .split(/[\s,]+/)
        .map((origin) => origin.trim())
        .filter(Boolean)
        .map(normalizeOrigin);

    return parsed.length ? [...new Set(parsed)] : defaultCorsOrigins.map(normalizeOrigin);
}

function normalizePublicBaseUrl(value) {
    const raw = (value || "").trim().replace(/\/+$/, "");
    if (!raw) return "";

    if (/^https?:\/\//i.test(raw)) {
        return raw;
    }

    if (raw.startsWith("localhost") || raw.startsWith("127.0.0.1")) {
        return `http://${raw}`;
    }

    return `https://${raw}`;
}

module.exports = {
    githubToken:process.env.GITHUB_TOKEN,
    port:process.env.PORT || 3000,
    mongoUri:process.env.MONGODB_URI,
    nodeEnv:process.env.NODE_ENV || "development",
    corsOrigins:parseCorsOrigins(process.env.CORS_ORIGINS),
    uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads"),
    publicBaseUrl: normalizePublicBaseUrl(process.env.PUBLIC_BASE_URL),
    resendApiKey: (process.env.RESEND_API_KEY || "").trim(),
    contactFromEmail: (process.env.CONTACT_FROM_EMAIL || "").trim(),
    contactToEmail: (process.env.CONTACT_TO_EMAIL || "").trim()
}