const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models1/User1");

// Kay�t i�lemi
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Kullan�c� daha �nce kay�t olmu� mu kontrol et
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ mesaj: "Bu e-posta zaten kay�tl�" });
        }

        // 2. �ifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Yeni kullan�c�y� olu�tur
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // 4. Kaydet
        await newUser.save();

        // 5. JWT Token olu�tur
        console.log("JWT_SECRET:", process.env.JWT_SECRET); // kontrol i�in
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        // 6. Ba�ar�l� yan�t
        res.status(201).json({
            mesaj: "Kay�t ba�ar�l�",
            token: token
        });

    } catch (err) {
        res.status(500).json({
            mesaj: "Sunucu hatas�",
            hata: err.message
        });
    }
};

// Giri� i�lemi
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kullan�c�y� bul
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ mesaj: "Kullan�c� bulunamad�" });

        // �ifreyi kar��la�t�r
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ mesaj: "�ifre hatal�" });

        // JWT token olu�tur
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(200).json({ mesaj: "Giri� ba�ar�l�", token });

    } catch (err) {
        res.status(500).json({ mesaj: "Sunucu hatas�", hata: err.message });
    }
};

// ��k�� i�lemi (opsiyonel)
const logoutUser = async (req, res) => {
    try {
        // Logout i�leminde taray�c�daki token silinir, backend�de i�lem gerekmez ama token ge�ersiz k�l�nmak istenirse yap�labilir
        res.status(200).json({ mesaj: "��k�� ba�ar�l�, token taray�c�dan silinmeli." });
    } catch (err) {
        res.status(500).json({ mesaj: "Sunucu hatas�", hata: err.message });
    }
};

module.exports = { registerUser, loginUser, logoutUser };

