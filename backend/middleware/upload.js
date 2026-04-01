const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadDir } = require('../config/env.js');

// Uploads klasörünü oluştur
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Benzersiz dosya adı: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Dosya filtresi - resim ve PDF dosyaları
const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();
  const mimeType = (file.mimetype || '').toLowerCase();

  const allowedImageExts = new Set(['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg']);
  const allowedImageMimePrefix = 'image/';
  const isImage = mimeType.startsWith(allowedImageMimePrefix) || allowedImageExts.has(extname);

  const isPdf = mimeType === 'application/pdf' || extname === '.pdf';

  if (isImage || isPdf) {
    return cb(null, true);
  }

  cb(new Error(`Sadece resim (jpeg, jpg, png, gif, webp, svg) veya PDF dosyaları yüklenebilir! (mimetype: ${mimeType || 'yok'}, ext: ${extname || 'yok'})`));
};

// Multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
