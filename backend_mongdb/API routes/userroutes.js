const express = require("express");
const router = express.Router();

// Placeholder — user auth routes not yet implemented
router.get("/", (req, res) => res.json({ message: "User routes OK" }));

module.exports = router;