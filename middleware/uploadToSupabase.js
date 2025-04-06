const uploadToSupabase = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from("media") // Ganti dengan nama bucket Supabase kamu
      .upload(`uploads/${fileName}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/uploads/${fileName}`;

    req.fileUrl = fileUrl; // Simpan URL ke request object
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { upload, uploadToSupabase };
