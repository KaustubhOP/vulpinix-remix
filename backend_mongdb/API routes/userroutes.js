const express = require("express");
const router = express.Router();
const { registerUser, loginUser, googleAuth, updateProfile } = require("../controllers/usercontrollers");
const { requireAuth } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.patch("/profile", requireAuth, updateProfile);

module.exports = router;