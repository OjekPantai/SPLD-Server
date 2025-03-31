const express = require("express");
const router = express.Router();
const { serveImage } = require("../controllers/mediaController");

router.get("/:filename", serveImage);

module.exports = router;
