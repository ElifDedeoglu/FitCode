const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// 🔄 Türkçe karakter sorunu olmasın diye Content-Type ayarı:
app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next();
});

// Rotaları tanıt
const authRoutes = require("./routes1/auth1");
app.use("/api/auth", authRoutes);

// Test rotası
app.get("/", (req, res) => {
    res.json({
        message: "Fitcode Backend Çalışıyor ✅",
        mongoStatus: "Bağlı",
        port: process.env.PORT || 5000
    });
});

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("✅ MongoDB bağlantısı başarılı");
    })
    .catch((err) => {
        console.log("❌ MongoDB bağlantı hatası:", err.message);
    });

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});
// bu bir test satırııı!!!!!!!!!!!!!!!!!!!!!!!!