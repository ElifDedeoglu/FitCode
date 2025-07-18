// models1/FoodLog.js
const mongoose = require("mongoose");

const foodLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    foodName: String,
    calories: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("FoodLog", foodLogSchema);
