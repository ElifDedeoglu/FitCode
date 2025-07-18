const express = require("express");
const router = express.Router();
const {
    searchFood,
    addFood,
    updateFood,
    deleteFood
} = require("../controllers1/foodController");

const { authenticateToken } = require("../middleware/authMiddleware");

// 👉 Besin arama (Kullanıcı arama çubuğuna yazınca)
router.get("/search", authenticateToken, searchFood);

// 👉 Besin ekle
router.post("/", authenticateToken, addFood);

// 👉 Besin güncelle
router.put("/:id", authenticateToken, updateFood);

// 👉 Besin sil
router.delete("/:id", authenticateToken, deleteFood);

module.exports = router;
