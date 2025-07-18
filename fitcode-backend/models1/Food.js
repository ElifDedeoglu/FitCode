const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    calories: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Food", foodSchema);
