function errorHandler(err, req, res, next) {
  console.error("Hata logu:", err.message); // geliştirici için log

  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "error",
        message: "Dosya boyutu 5MB limitini aşıyor.",
      });
    }

    return res.status(400).json({
      status: "error",
      message: err.message || "Dosya yükleme hatası",
    });
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      status: "error",
      message: "CORS hatası: Bu origin için API erişimine izin verilmiyor.",
    });
  }

  // Eğer hata özel statusCode taşıyorsa onu kullan
  const status = err.statusCode || 500;

  res.status(status).json({
    status: "error",
    message: err.message || "Bir hata oluştu",
  });
}


module.exports = {errorHandler}