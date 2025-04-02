// Contoh implementasi lengkap
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const role = require("../middleware/role");
const {
  createReport,
  getAllReports,
  getReportById,
  submitReport,
} = require("../controllers/reportController");
const upload = require("../utils/media");

router.post("/", auth, role(["polsek"]), upload.array("files"), createReport);
router.get("/", auth, getAllReports);
// router.get("/:id", auth, getReportById);
router.put("/:id/submit", auth, role(["polsek"]), submitReport);

module.exports = router;
