const contactService = require("../services/contactService");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createValidationError(message) {
    const err = new Error(message);
    err.statusCode = 400;
    return err;
}

exports.sendContactMessage = async (req, res, next) => {
    try {
        const name = (req.body?.name || "").trim();
        const email = (req.body?.email || "").trim();
        const subject = (req.body?.subject || "").trim();
        const message = (req.body?.message || "").trim();

        if (!name || !email || !subject || !message) {
            throw createValidationError("Tum alanlar zorunludur.");
        }

        if (!EMAIL_PATTERN.test(email)) {
            throw createValidationError("Gecerli bir email adresi girin.");
        }

        if (name.length > 120 || email.length > 180 || subject.length > 180 || message.length > 5000) {
            throw createValidationError("Gonderilen veri boyutu limiti asiyor.");
        }

        const emailResult = await contactService.sendContactEmail({ name, email, subject, message });

        res.status(200).json({
            message: "Mesajiniz basariyla gonderildi.",
            id: emailResult?.id || null,
        });
    } catch (err) {
        next(err);
    }
};
