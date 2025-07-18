const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models1/User1");

// ✅ Kayıt işlemi
const registerUser = async (req, res) => {
    try {
        const { username, email, password, isAdmin } = req.body;

        // 1. Aynı e-posta ile kayıtlı kullanıcı var mı?
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ mesaj: "Bu e-posta zaten kayıtlı." });
        }

        // 2. Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Yeni kullanıcı oluştur
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isAdmin: isAdmin || false // Varsayılan olarak admin değil
        });

        // 4. Kaydet
        await newUser.save();

        // 5. JWT Token oluştur
        const token = jwt.sign(
            {
                id: newUser._id,
                isAdmin: newUser.isAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        // 6. Yanıt döndür
        res.status(201).json({
            mesaj: "Kayıt başarılı.",
            token
        });

    } catch (err) {
        res.status(500).json({
            mesaj: "Sunucu hatası",
            hata: err.message
        });
    }
};

// ✅ Giriş işlemi
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Kullanıcıyı bul
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ mesaj: "Kullanıcı bulunamadı." });

        // 2. Şifreyi kontrol et
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ mesaj: "Şifre hatalı." });

        // 3. JWT Token oluştur
        const token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        // 4. Yanıt döndür
        res.status(200).json({
            mesaj: "Giriş başarılı.",
            token
        });

    } catch (err) {
        res.status(500).json({
            mesaj: "Sunucu hatası",
            hata: err.message
        });
    }
};

// ✅ Çıkış işlemi (frontend taraflıdır)
const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ mesaj: "Çıkış başarılı, token tarayıcıdan silinmeli." });
    } catch (err) {
        res.status(500).json({ mesaj: "Sunucu hatası", hata: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
