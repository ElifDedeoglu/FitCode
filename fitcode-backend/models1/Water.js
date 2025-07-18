// models1/Water.js
const mongoose = require("mongoose");

const waterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User1"
    },
    amount: {
        type: Number, // ml cinsinden
        required: true
    }
}, {
    timestamps: true // ✅ createdAt ve updatedAt alanlarını otomatik ekler
});

module.exports = mongoose.model("Water", waterSchema);
