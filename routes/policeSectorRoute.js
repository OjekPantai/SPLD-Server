const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const role = require("../middleware/role");
const {
  getAllPoliceSectors,
  createPoliceSector,
  updatePoliceSector,
  deletePoliceSector,
} = require("../controllers/policeSectorController");

router.get("/", auth, getAllPoliceSectors);
router.post("/", auth, role(["admin"]), createPoliceSector);
// router.put("/:id", auth, role(["admin"]), updatePoliceSector);
// router.delete("/:id", auth, role(["admin"]), deletePoliceSector);

module.exports = router;
