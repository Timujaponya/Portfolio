const { translate } = require("@vitalets/google-translate-api");

const SUPPORTED_LANGUAGES = new Set(["tr", "en"]);
const MAX_TEXT_COUNT = 120;
const MAX_TEXT_LENGTH = 4000;
const cache = new Map();

function normalizeText(value) {
    return String(value || "").trim();
}

function shouldSkipTranslation(text) {
    if (!text) return true;
    if (text.length > MAX_TEXT_LENGTH) return true;

    const urlPattern = /^(https?:\/\/|www\.)/i;
    const mailPattern = /^\S+@\S+\.\S+$/;
    const numericPattern = /^[\d\s.,:+\-/%()]+$/;

    return urlPattern.test(text) || mailPattern.test(text) || numericPattern.test(text);
}

function getCacheKey(targetLang, text) {
    return `${targetLang}::${text}`;
}

async function translateOne(text, targetLang) {
    if (shouldSkipTranslation(text)) {
        return text;
    }

    const cacheKey = getCacheKey(targetLang, text);
    const cached = cache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const result = await translate(text, { to: targetLang });
        const translated = result?.text?.trim() || text;
        cache.set(cacheKey, translated);
        return translated;
    } catch (err) {
        console.warn("[Translate] failed, fallback to original text:", err.message);
        return text;
    }
}

async function translateTexts(texts, targetLang) {
    const normalizedTargetLang = String(targetLang || "").toLowerCase();
    if (!SUPPORTED_LANGUAGES.has(normalizedTargetLang)) {
        const err = new Error("Hedef dil desteklenmiyor. Sadece tr/en desteklenir.");
        err.statusCode = 400;
        throw err;
    }

    if (!Array.isArray(texts)) {
        const err = new Error("texts alani dizi olmali.");
        err.statusCode = 400;
        throw err;
    }

    if (texts.length > MAX_TEXT_COUNT) {
        const err = new Error(`Tek istekte en fazla ${MAX_TEXT_COUNT} metin cevrilebilir.`);
        err.statusCode = 400;
        throw err;
    }

    const cleanTexts = texts.map((item) => normalizeText(item));
    const translated = await Promise.all(cleanTexts.map((text) => translateOne(text, normalizedTargetLang)));

    return translated;
}

module.exports = {
    translateTexts,
};
