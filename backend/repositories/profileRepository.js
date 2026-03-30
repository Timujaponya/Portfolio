// Profil repository

const Profile = require("../models/Profile");

exports.getProfile = async () => {
    return await Profile.findOne().lean();
};

exports.createProfile = async (data) => {
    const profile = new Profile(data);
    return await profile.save();
};

exports.updateProfile = async (id, data) => {
    return await Profile.findByIdAndUpdate(id, data, { new: true });
};
