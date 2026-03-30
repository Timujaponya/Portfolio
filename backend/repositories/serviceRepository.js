// Servis repository

const Service = require("../models/Service");

exports.getAllServices = async () => {
    return await Service.find().sort({ order: 1 }).lean();
};

exports.getActiveServices = async () => {
    return await Service.find({ isActive: true }).sort({ order: 1 }).lean();
};

exports.getServiceById = async (id) => {
    return await Service.findById(id).lean();
};

exports.createService = async (data) => {
    const service = new Service(data);
    return await service.save();
};

exports.updateService = async (id, data) => {
    return await Service.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteService = async (id) => {
    return await Service.findByIdAndDelete(id);
};
