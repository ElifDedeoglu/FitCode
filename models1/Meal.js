// models1/Meal.js
const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    items: [
        {
            foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
            quantity: { type: Number, required: true } // gram cinsinden ya da 1 adet vs.
        }
    ]
});

module.exports = mongoose.model("Meal", mealSchema);
