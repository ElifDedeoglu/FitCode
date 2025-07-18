const express = require("express");
const router = express.Router();
const FoodLog = require("../models1/FoodLog");
const { authenticateToken } = require("../middleware/authMiddleware");

// Bugünkü toplam kalori
router.get("/today", authenticateToken, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const logs = await FoodLog.find({
            userId: req.user.id,
            date: { $gte: today }
        });

        const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);
        res.json({ totalCalories, logs });
    } catch (err) {
        res.status(500).json({ message: "Sunucu hatasý", error: err.message });
    }
});

// Besin ekle
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { foodName, calories } = req.body;

        const newLog = new FoodLog({
            userId: req.user.id,
            foodName,
            calories
        });

        await newLog.save();
        res.status(201).json(newLog);
    } catch (err) {
        res.status(500).json({ message: "Sunucu hatasý", error: err.message });
    }
});

module.exports = router;
