const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const { addMeal, getDailyReport } = require("../controllers1/mealController");

router.post("/", authenticateToken, addMeal);          // Öðün ekle
router.get("/report", authenticateToken, getDailyReport); // Rapor getir

module.exports = router;
