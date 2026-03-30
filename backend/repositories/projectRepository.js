// Veritabanı ile bağlantılı işlemler buradan yönetiliyor.

const Project = require("../models/Project");

async function getActiveProjects() {
	return await Project.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
}

async function getAllProjectsForAdmin() {
	return await Project.find().sort({ order: 1, createdAt: -1 }).lean();
}

async function getProjectById(id){return await Project.findById(id).lean()};
async function createProject(data){return await Project.create(data)};
async function updateProject(id,data){return await Project.findByIdAndUpdate(id,data, { new: true, runValidators: true })};
async function deleteProject(id){return await Project.findByIdAndDelete(id)};


module.exports = {getActiveProjects, getAllProjectsForAdmin, getProjectById, createProject, updateProject, deleteProject}