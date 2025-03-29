const express = require("express");
const router = express.Router();
const { auth } = require("../middleware");
const mediaController = require("../controllers/mediaController");

router.delete("/:id", auth, mediaController.deleteMedia);

module.exports = router;
