// sunucu ve bağlantı ayarları ve sunucunun başlatılması buradan


const { connectDb } = require("./config/db.js"); // MongoDB bağlantısı
const app = require("./app.js");

const {port} = require("./config/env.js");
const host = process.env.HOST || "0.0.0.0";

// Async startServer ile DB bağlanıp server başlat
async function startServer() {
    try {
        await connectDb();
        app.listen(port, host, ()=>{
            console.log(`server running on ${host}:${port}`);
        });
    } catch (err) {
        console.error("DB bağlantı hatası:", err);
    }
}

// server’ı başlat
startServer();
