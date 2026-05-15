const express = require('express');
const router = express.Router();
const { authorizePlatform, handleCallback, getSocialAccounts } = require('../controllers/socialController');

// @route   GET /api/social/status
// @desc    Gets the status of connected social accounts
// @access  Public (should eventually be protected)
router.get('/status', getSocialAccounts);

// @route   GET /api/social/auth/:platform
// @desc    Redirects user to the social platform's OAuth login page
// @access  Public (should eventually be protected to link to a specific user)
router.get('/auth/:platform', authorizePlatform);

// @route   GET /api/social/callback/:platform
// @desc    Handles the OAuth callback from the social platform
// @access  Public
router.get('/callback/:platform', handleCallback);

module.exports = router;
