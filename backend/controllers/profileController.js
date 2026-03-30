// Profil controller

const profileService = require("../services/profileService");

// GET /api/profile
exports.getProfile = async (req, res, next) => {
    try {
        const profile = await profileService.getProfile();
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // PUBLIC_BASE_URL'i al
        const publicBaseUrl = process.env.PUBLIC_BASE_URL?.replace(/\/+$/, "");
        // avatarUrl ve cvUrl path ise tam URL'ye çevir
        const patchUrl = (url) => {
            if (!url) return url;
            if (/^https?:\/\//.test(url)) return url;
            if (publicBaseUrl && url.startsWith("/uploads/")) {
                return `${publicBaseUrl}${url}`;
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
            const match = url.match(/\/uploads\/[^\s?#]+/);
            if (match) return match[0];
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
