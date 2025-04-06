const express = require("express");
const router = express.Router();
const { getImageUrl, upload } = require("../controllers/mediaController");

router.post("/upload", upload.single("file"), uploadFile);
router.get("/:filename", getImageUrl);

module.exports = router;
