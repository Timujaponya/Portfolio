// Profil controller

const profileService = require("../services/profileService");
const { publicBaseUrl } = require("../config/env.js");

function getFirstHeaderValue(value) {
    if (!value) return "";
    if (Array.isArray(value)) return String(value[0] || "").trim();
    return String(value).split(",")[0].trim();
}

function getPublicBaseUrl(req) {
    if (publicBaseUrl) {
        return publicBaseUrl;
    }

    const forwardedProto = getFirstHeaderValue(req.headers["x-forwarded-proto"]);
    const forwardedHost = getFirstHeaderValue(req.headers["x-forwarded-host"]);

    if (forwardedProto && forwardedHost) {
        return `${forwardedProto}://${forwardedHost}`;
    }

    return `${req.protocol}://${req.get("host")}`;
}

// GET /api/profile
exports.getProfile = async (req, res, next) => {
    try {
        const profile = await profileService.getProfile();
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const baseUrl = getPublicBaseUrl(req);
        // avatarUrl ve cvUrl path ise tam URL'ye çevir
        const patchUrl = (url) => {
            if (!url) return url;
            if (/^https?:\/\//.test(url)) return url;
            if (url.startsWith("/uploads/")) {
                return `${baseUrl}${url}`;
            }
            if (url.startsWith("uploads/")) {
                return `${baseUrl}/${url}`;
            }
            return url;
        };
        profile.avatarUrl = patchUrl(profile.avatarUrl);
        profile.cvUrl = patchUrl(profile.cvUrl);

        res.status(200).json({ message: "Profile found", profile });
    } catch (err) {
        next(err);
    }
};

// POST /api/profile
exports.createProfile = async (req, res, next) => {
    try {
        const profile = await profileService.createProfile(req.body);
        res.status(201).json({ message: "Profile created", profile });
    } catch (err) {
        next(err);
    }
};

// PUT /api/profile/:id
exports.updateProfile = async (req, res, next) => {
    try {
        // avatarUrl ve cvUrl normalize et
        const normalizeUrl = (url) => {
            if (!url) return url;
            // Eğer tam URL ise ve /uploads/ ile başlıyorsa sadece path'i al
            const match = url.match(/\/uploads\/[^\s?#]+|^uploads\/[^\s?#]+/);
            if (match) {
                const matchedPath = match[0];
                return matchedPath.startsWith("/") ? matchedPath : `/${matchedPath}`;
            }
            return url;
        };
        if (req.body.avatarUrl) req.body.avatarUrl = normalizeUrl(req.body.avatarUrl);
        if (req.body.cvUrl) req.body.cvUrl = normalizeUrl(req.body.cvUrl);

        const profile = await profileService.updateProfile(req.params.id, req.body);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ message: "Profile updated", profile });
    } catch (err) {
        next(err);
    }
};
