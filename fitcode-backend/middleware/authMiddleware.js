const jwt = require("jsonwebtoken");

// Kullanýcýnýn token'ýný doðrulayan middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    // "Bearer token" yapýsýndan sadece token kýsmýný al
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Eriþim reddedildi. Token bulunamadý." });
    }

    // Token doðrulama
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            console.error("JWT doðrulama hatasý:", err.message); // Hata log'u için eklendi
            return res.status(403).json({ message: "Geçersiz veya süresi dolmuþ token." });
        }

        req.user = decodedUser; // decodedUser = { id: ..., isAdmin: ... }
        next();
    });
};

// Admin yetkisi olan kullanýcýlar için eriþim kontrolü
const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.isAdmin !== true) {
        return res.status(403).json({ message: "Bu iþlemi yapmak için yönetici (admin) olmalýsýnýz." });
    }
    next();
};

module.exports = {
    authenticateToken,
    authorizeAdmin
};
