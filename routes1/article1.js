const express = require("express");
const router = express.Router();

const {
    getArticlesByCategory,
    getAllArticles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle
} = require("../controllers1/articleController");

const { authenticateToken, authorizeAdmin } = require("../middleware/authMiddleware");

// ✅ Herkese açık rotalar
router.get("/", authenticateToken, getAllArticles);           // Tüm makaleleri getir (JWT ile korundu)
router.get("/single/:id", authenticateToken, getArticleById); // ID'ye göre tek makale getir (JWT ile korundu)
router.get("/:category", getArticlesByCategory);              // Kategoriye göre getir (herkese açık)

// ✅ Admin yetkisi gerektiren rotalar
router.post("/", authenticateToken, authorizeAdmin, addArticle);       // Makale ekle
router.put("/:id", authenticateToken, authorizeAdmin, updateArticle);  // Makale güncelle
router.delete("/:id", authenticateToken, authorizeAdmin, deleteArticle); // Makale sil

module.exports = router;
