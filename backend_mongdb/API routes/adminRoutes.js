const express = require("express");
const router = express.Router();
const { adminLogin, getAllCampaigns, updateCampaignStatus } = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.post("/login", adminLogin);
router.get("/campaigns", requireAuth, requireAdmin, getAllCampaigns);
router.patch("/campaigns/:id/status", requireAuth, requireAdmin, updateCampaignStatus);

module.exports = router;
