// collection şeması/şekillendirilmesi ve mongoose kurulumu buradan

const mongoose = require("mongoose");

// Proje modeli şeması
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    tags: [String],
    category: { 
        type: String, 
        enum: ['web', 'game', 'tools'], 
        default: 'web' 
    },
    categoryIcon: String, // Kategori için özel icon
    icon: String, // Proje icon'u
    link: String,
    githubUrl: String,
    imageUrl: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


// Proje güncellerken tarih ayarlama
projectSchema.pre("findOneAndUpdate", function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

projectSchema.index({ isActive: 1, order: 1 });
projectSchema.index({ category: 1, isActive: 1 });


const Project = mongoose.model("Project", projectSchema)

module.exports = Project;