const { Resend } = require("resend");
const { resendApiKey, contactFromEmail, contactToEmail } = require("../config/env.js");

let resendClient = null;
if (resendApiKey) {
    resendClient = new Resend(resendApiKey);
}

function createConfigError(message) {
    const err = new Error(message);
    err.statusCode = 500;
    return err;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

async function sendContactEmail(payload) {
    if (!resendApiKey) {
        throw createConfigError("RESEND_API_KEY tanimli degil.");
    }

    if (!contactFromEmail || !contactToEmail) {
        throw createConfigError("CONTACT_FROM_EMAIL ve CONTACT_TO_EMAIL tanimli olmali.");
    }

    if (!resendClient) {
        resendClient = new Resend(resendApiKey);
    }

    const safeName = escapeHtml(payload.name);
    const safeEmail = escapeHtml(payload.email);
    const safeSubject = escapeHtml(payload.subject);
    const safeMessage = escapeHtml(payload.message).replace(/\n/g, "<br />");

    const { data, error } = await resendClient.emails.send({
        from: contactFromEmail,
        to: [contactToEmail],
        replyTo: payload.email,
        subject: `[Portfolio Contact] ${payload.subject}`,
        text: [
            `Name: ${payload.name}`,
            `Email: ${payload.email}`,
            `Subject: ${payload.subject}`,
            "",
            "Message:",
            payload.message,
        ].join("\n"),
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;max-width:680px;">
            <h2 style="margin:0 0 16px;">Yeni Iletisim Formu Mesaji</h2>
            <p><strong>Ad:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Konu:</strong> ${safeSubject}</p>
            <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
            <p><strong>Mesaj:</strong></p>
            <p>${safeMessage}</p>
          </div>
        `,
    });

    if (error) {
        const err = new Error(error.message || "Email gonderimi basarisiz oldu.");
        err.statusCode = 502;
        throw err;
    }

    return data;
}

module.exports = {
    sendContactEmail,
};
