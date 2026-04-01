const translationService = require("../services/translationService");

exports.translate = async (req, res, next) => {
    try {
        const { texts, targetLang } = req.body || {};
        const translatedTexts = await translationService.translateTexts(texts, targetLang);

        res.status(200).json({
            message: "Ceviri tamamlandi.",
            targetLang,
            translations: translatedTexts,
        });
    } catch (err) {
        next(err);
    }
};
