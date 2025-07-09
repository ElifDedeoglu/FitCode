const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models1/User1");

// Kayýt iþlemi
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Kullanýcý daha önce kayýt olmuþ mu kontrol et
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ mesaj: "Bu e-posta zaten kayýtlý" });
        }

        // 2. Þifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Yeni kullanýcýyý oluþtur
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // 4. Kaydet
        await newUser.save();

        // 5. JWT Token oluþtur
        console.log("JWT_SECRET:", process.env.JWT_SECRET); // kontrol için
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        // 6. Baþarýlý yanýt
        res.status(201).json({
            mesaj: "Kayýt baþarýlý",
            token: token
        });

    } catch (err) {
        res.status(500).json({
            mesaj: "Sunucu hatasý",
            hata: err.message
        });
    }
};

// Giriþ iþlemi
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kullanýcýyý bul
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ mesaj: "Kullanýcý bulunamadý" });

        // Þifreyi karþýlaþtýr
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ mesaj: "Þifre hatalý" });

        // JWT token oluþtur
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(200).json({ mesaj: "Giriþ baþarýlý", token });

    } catch (err) {
        res.status(500).json({ mesaj: "Sunucu hatasý", hata: err.message });
    }
};

// Çýkýþ iþlemi (opsiyonel)
const logoutUser = async (req, res) => {
    try {
        // Logout iþleminde tarayýcýdaki token silinir, backend’de iþlem gerekmez ama token geçersiz kýlýnmak istenirse yapýlabilir
        res.status(200).json({ mesaj: "Çýkýþ baþarýlý, token tarayýcýdan silinmeli." });
    } catch (err) {
        res.status(500).json({ mesaj: "Sunucu hatasý", hata: err.message });
    }
};

module.exports = { registerUser, loginUser, logoutUser };

