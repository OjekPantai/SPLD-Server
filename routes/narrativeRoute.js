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
  deleteNarrative,
} = require("../controllers/narrativeController");

const upload = require("../utils/media");

router.get("/public", getPublicNarratives);

router.post("/", auth, role(["humas"]), upload.array("media"), createNarrative);
router.get("/", getAllNarratives);
router.get("/:id", getNarrativeById);
router.put("/:id/publish", auth, role(["humas"]), publishNarrative);
router.delete("/:id", auth, role(["admin"]), deleteNarrative);

module.exports = router;
