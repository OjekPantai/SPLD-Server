const path = require("path");
const fs = require("fs");
const mime = require("mime-types");

const MediaController = {
  serveImage: (req, res) => {
    try {
      const filename = req.params.filename;
      const safeFilename = path.basename(filename);
      const imagePath = path.join(__dirname, "../media", safeFilename);

      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: "File not found" });
      }

      const mimeType = mime.lookup(imagePath);

      const allowedMimeTypes = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
      ];
      if (!mimeType || !allowedMimeTypes.includes(mimeType)) {
        return res.status(415).json({ error: "Unsupported file type" });
      }

      res.set({
        "Content-Type": mimeType,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=31536000",
      });

      const fileStream = fs.createReadStream(imagePath);
      fileStream.pipe(res);

      fileStream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });
    } catch (error) {
      console.error("Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
};

module.exports = MediaController;
