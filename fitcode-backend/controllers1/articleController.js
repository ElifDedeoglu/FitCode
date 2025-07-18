const Article = require("../models1/Article1");

// ✅ Belirli kategoriye ait makaleleri getir
exports.getArticlesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const articles = await Article.find({ category }).sort({ createdAt: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: "Makaleler alınamadı", error: err.message });
    }
};

// ✅ Tüm makaleleri getir (kategori bağımsız)
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: "Tüm makaleler alınamadı", error: err.message });
    }
};

// ✅ Yeni makale ekle
exports.addArticle = async (req, res) => {
    try {
        const newArticle = new Article(req.body);
        await newArticle.save();
        res.status(201).json({ message: "Makale başarıyla eklendi", article: newArticle });
    } catch (err) {
        res.status(400).json({ message: "Makale eklenemedi", error: err.message });
    }
};

// ✅ Makaleyi ID ile güncelle
exports.updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Article.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Makale bulunamadı" });
        res.json({ message: "Makale güncellendi", article: updated });
    } catch (err) {
        res.status(400).json({ message: "Makale güncellenemedi", error: err.message });
    }
};

// ✅ Makaleyi ID ile sil
exports.deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Article.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Makale bulunamadı" });
        res.json({ message: "Makale silindi" });
    } catch (err) {
        res.status(400).json({ message: "Makale silinemedi", error: err.message });
    }
};

// ✅ ID ile tek bir makale getir
exports.getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findById(id);
        if (!article) return res.status(404).json({ message: "Makale bulunamadı" });
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: "Makale alınamadı", error: err.message });
    }
};
