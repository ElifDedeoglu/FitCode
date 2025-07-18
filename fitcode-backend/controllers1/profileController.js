const User = require("../models1/User1");

// Kalori hesaplama fonksiyonu
const calculateCalories = (gender, weight, height, age, goal) => {
    let bmr = 0;

    if (gender === "male") {
        bmr = 66 + 13.7 * weight + 5 * height - 6.8 * age;
    } else {
        bmr = 655 + 9.6 * weight + 1.8 * height - 4.7 * age;
    }

    // Hedefe göre ayarlama
    if (goal === "lose") bmr -= 500;
    else if (goal === "gain") bmr += 500;
    else if (goal === "muscle") bmr += 300;

    return Math.round(bmr);
};

// ✅ PROFİL GETİR
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

        // Kalori hesapla ve ekle
        const calories = calculateCalories(user.gender, user.weight, user.height, user.age, user.goal);

        res.json({
            ...user.toObject(),
            calories
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Sunucu hatası." });
    }
};

// ✅ PROFİL GÜNCELLE
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, age, weight, height, gender, goal, profileImage } = req.body;

        const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
        const calories = calculateCalories(gender, weight, height, age, goal);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                username,
                age,
                weight,
                height,
                gender,
                goal,
                bmi,
                calories,
                profileImage
            },
            { new: true }
        ).select("-password");

        res.json({ message: "Profil güncellendi", user: updatedUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Profil güncellenemedi." });
    }
};
