const supabase = require("../config/supabase");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname, buffer, mimetype } = req.file;
    const fileName = `${Date.now()}-${originalname}`;

    // Upload ke Supabase Storage
    const { data, error } = await supabase.storage
      .from("uploads") // Ganti "uploads" dengan nama bucket yang sesuai
      .upload(fileName, buffer, { contentType: mimetype });

    if (error) {
      throw error;
    }

    // Ambil URL file yang diunggah
    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;

    res
      .status(200)
      .json({ message: "File uploaded successfully", url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getImageUrl = async (req, res) => {
  try {
    const filename = req.params.filename;

    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${filename}`;

    const { data, error } = await supabase.storage.from("uploads").list();

    if (error) {
      throw error;
    }

    const fileExists = data.some((file) => file.name === filename);

    if (!fileExists) {
      return res.status(404).json({ error: "File not found" });
    }

    return res.redirect(fileUrl);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { uploadFile, getImageUrl };
