const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const role = require("../middleware/role");
const {
  createNarrative,
  getAllNarratives,
  getNarrativeById,
  publishNarrative,
  getPublicNarratives,
} = require("../controllers/narrativeController");
const upload = require("../utils/upload");

router.get("/public", getPublicNarratives);

router.post("/", auth, role(["humas"]), upload.array("media"), createNarrative);
// router.get("/", getAllNarratives);
// router.get("/:id", getNarrativeById);
router.put("/:id/publish", auth, role(["humas"]), publishNarrative);

module.exports = router;
