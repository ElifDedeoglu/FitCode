const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    gender: { type: String, enum: ["male", "female"] },
    goal: { type: String, enum: ["lose", "gain", "maintain", "muscle"] },
    bmi: { type: Number },
    calories: { type: Number },
    profileImage: { type: String }, // Base64 ya da URL olabilir

    // ✅ Admin özelliği eklendi
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", userSchema);
