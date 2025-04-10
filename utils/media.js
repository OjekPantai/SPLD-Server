const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");

// Konfigurasi Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Menggunakan memoryStorage agar file bisa langsung diunggah ke Supabase
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // Maksimal 50MB per file
    files: 5, // Maksimal 5 file
  },
});

module.exports = { upload };
