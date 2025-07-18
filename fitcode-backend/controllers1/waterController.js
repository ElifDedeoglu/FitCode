const Water = require("../models1/Water");

// ✅ Su tüketimini kaydet ve toplamı döndür
exports.addWater = async (req, res) => {
    try {
        const { amount } = req.body;

        const newEntry = new Water({
            userId: req.user.id,
            amount,
        });

        await newEntry.save();

        // Türkiye saatine göre bugünün başlangıcı ve sonu
        const now = new Date();
        const trOffset = 3 * 60 * 60 * 1000; // UTC+3
        const localNow = new Date(now.getTime() + trOffset);

        const startOfDay = new Date(Date.UTC(localNow.getUTCFullYear(), localNow.getUTCMonth(), localNow.getUTCDate()));
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

        // Bugünkü tüm kayıtları getir
        const records = await Water.find({
            userId: req.user.id,
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });

        const total = records.reduce((sum, item) => sum + item.amount, 0);

        // amount da döndürülüyor!
        res.status(201).json({
            message: "Su tüketimi kaydedildi.",
            amount,
            total,
        });
    } catch (err) {
        res.status(500).json({
            message: "Su kaydedilirken hata oluştu",
            error: err.message,
        });
    }
};

// ✅ Bugünkü toplam su tüketimini getir (Türkiye saatine göre)
exports.getTodayWater = async (req, res) => {
    try {
        const userId = req.user.id;

        // Türkiye saatine göre tarih hesapla
        const now = new Date();
        const trOffset = 3 * 60 * 60 * 1000; // UTC+3 farkı
        const localNow = new Date(now.getTime() + trOffset);

        const startOfDay = new Date(Date.UTC(localNow.getUTCFullYear(), localNow.getUTCMonth(), localNow.getUTCDate()));
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

        const records = await Water.find({
            userId,
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        const total = records.reduce((sum, item) => sum + item.amount, 0);

        res.json({ total });
    } catch (err) {
        res.status(500).json({
            message: "Su verisi alınamadı",
            error: err.message
        });
    }
};
