// Profil controller

const profileService = require("../services/profileService");

// GET /api/profile
exports.getProfile = async (req, res, next) => {
    try {
        const profile = await profileService.getProfile();
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
        const profile = await profileService.updateProfile(req.params.id, req.body);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ message: "Profile updated", profile });
    } catch (err) {
        next(err);
    }
};
