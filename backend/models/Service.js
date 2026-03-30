// Servisler modeli

const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: String,
    price: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'USD' }
    },
    features: [{
        text: String,
        icon: String
    }],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

serviceSchema.pre("findOneAndUpdate", function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

serviceSchema.index({ isActive: 1, order: 1 });

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
