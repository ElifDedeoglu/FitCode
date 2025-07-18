// controllers1/mealController.js
const Meal = require("../models1/Meal");
const Food = require("../models1/Food");

const addMeal = async (req, res) => {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "Yemek bilgisi eksik." });
    }

    try {
        const newMeal = new Meal({ userId, items });
        await newMeal.save();
        res.status(201).json(newMeal);
    } catch (err) {
        res.status(500).json({ message: "Sunucu hatasý", error: err.message });
    }
};

const getDailyReport = async (req, res) => {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const meals = await Meal.find({
            userId,
            date: { $gte: today }
        }).populate("items.foodId");

        let totalCalories = 0;

        meals.forEach(meal => {
            meal.items.forEach(item => {
                const cal = item.foodId.calories * item.quantity;
                totalCalories += cal;
            });
        });

        res.json({ totalCalories });
    } catch (err) {
        res.status(500).json({ message: "Sunucu hatasý", error: err.message });
    }
};

module.exports = { addMeal, getDailyReport };
