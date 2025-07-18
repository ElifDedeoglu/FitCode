const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers1/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 👉 Profil bilgilerini getir
router.get('/', authenticateToken, getProfile);

// 👉 Profil bilgilerini güncelle
router.put('/', authenticateToken, updateProfile);

// 👉 Günlük alınması gereken kaloriyi getir (sadece kalori için)
router.get('/calories', authenticateToken, async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

        res.json({ calories: user.calories || 2000 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Kalori bilgisi alınamadı" });
    }
});

module.exports = router;
