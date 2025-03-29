const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const role = require("../middleware/role");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser,
} = require("../controllers/userController");

router.get("/", auth, role(["admin"]), getAllUsers);
router.get("/me", auth, getCurrentUser);
router.get("/:id", auth, role(["admin"]), getUserById);
router.post("/", auth, role(["admin"]), createUser);
router.put("/:id", auth, role(["admin"]), updateUser);
router.delete("/:id", auth, role(["admin"]), deleteUser);

module.exports = router;
