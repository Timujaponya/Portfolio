// app kurulumu ve kullanılacak middleware ve route benzeri belirtmeler burada yapılıyor

const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");
const projectsRouter = require("./routes/projects.js");
const profileRouter = require("./routes/profile.js");
const servicesRouter = require("./routes/services.js");
const uploadRouter = require("./routes/upload.js");
const contactRouter = require("./routes/contact.js");
const translateRouter = require("./routes/translate.js");
const cors = require("cors");
const { corsOrigins, uploadDir } = require("./config/env.js");


const app = express();

app.use(cors({
    origin: (origin, callback) => {
        const normalizedOrigin = String(origin || "").trim().replace(/\/+$/, "").toLowerCase();

        // Server-to-server veya curl isteklerinde Origin olmayabilir.
        if (!origin) {
            return callback(null, true);
        }

        if (corsOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }

        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true // cookie veya Authorization header göndermeye izin verir
}))
app.use(express.json()); // json middleware

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Static files - Yüklenen resimleri serve et
app.use('/uploads', express.static(uploadDir));

app.use("/api/projects", projectsRouter); // projectRouter
app.use("/api/profile", profileRouter); // profileRouter
app.use("/api/services", servicesRouter); // servicesRouter
app.use("/api/upload", uploadRouter); // uploadRouter
app.use("/api/contact", contactRouter); // contactRouter
app.use("/api/translate", translateRouter); // translateRouter
app.use(errorHandler); // Error Handler middleware

module.exports = app;