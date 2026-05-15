const express = require('express');

const axios = require('axios');
const User = require('../models/user');

// Helper to get OAuth URL based on platform
const getOAuthUrl = (platform, userId) => {
  const REDIRECT_URI = `http://localhost:5000/api/social/callback/${platform}`;
  
  // Pass the userId in the state parameter so we know who logged in during the callback
  const stateString = userId ? `userId=${userId}` : 'social_auth_req';

  switch (platform) {
    case 'instagram':
    case 'facebook':
      const fbAppId = process.env.FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';
      const fbScope = 'public_profile,email,instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,pages_manage_posts';
      return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${REDIRECT_URI}&state=${stateString}&scope=${fbScope}&auth_type=rerequest`;
      
    case 'twitter':
      const twitterClientId = process.env.TWITTER_CLIENT_ID || 'YOUR_TWITTER_CLIENT_ID';
      return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${twitterClientId}&redirect_uri=${REDIRECT_URI}&scope=tweet.read%20users.read%20tweet.write%20offline.access&state=${stateString}&code_challenge=challenge&code_challenge_method=plain`;
      
    case 'linkedin':
      const linkedinClientId = process.env.LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID';
      return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${REDIRECT_URI}&state=${stateString}&scope=r_liteprofile%20r_emailaddress`;
      
    case 'youtube':
      const googleClientId = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly`;
      
    default:
      return null;
  }
};

exports.authorizePlatform = (req, res) => {
  const { platform } = req.params;
  const { userId } = req.query; // Expect frontend to pass ?userId=...
  
  const authUrl = getOAuthUrl(platform, userId);
  if (!authUrl) {
    return res.status(400).json({ error: 'Unsupported platform' });
  }

  res.redirect(authUrl);
};

exports.handleCallback = async (req, res) => {
  const { platform } = req.params;
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`http://localhost:3000/social?error=${error}`);
  }

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    let userId = null;
    if (state && state.startsWith('userId=')) {
      userId = state.split('=')[1];
    }

    if (platform === 'facebook' || platform === 'instagram') {
      const REDIRECT_URI = `http://localhost:5000/api/social/callback/${platform}`;
      const fbAppId = process.env.FACEBOOK_APP_ID;
      const fbAppSecret = process.env.FACEBOOK_APP_SECRET;

      // 1. Exchange code for user access token
      const tokenResponse = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
        params: {
          client_id: fbAppId,
          redirect_uri: REDIRECT_URI,
          client_secret: fbAppSecret,
          code: code
        }
      });
      
      const accessToken = tokenResponse.data.access_token;
      console.log(`Successfully fetched user access token for ${platform}!`);

      // 2. Fetch Pages and potential Instagram accounts
      let fbPageId = "";
      let fbPageToken = "";
      let igAccountId = "";
      let igUsername = "";

      try {
        const pagesRes = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);
        let pages = pagesRes.data.data || [];

        // Fallback for specific Page ID if list is empty (common in dev/restricted apps)
        if (pages.length === 0) {
          try {
            const forceRes = await axios.get(`https://graph.facebook.com/v18.0/1111932568671242?fields=access_token,name&access_token=${accessToken}`);
            if (forceRes.data && forceRes.data.access_token) pages = [forceRes.data];
          } catch (e) {}
        }

        if (pages.length > 0) {
          // We'll take the first page that has a linked Instagram account, or just the first page
          let selectedPage = pages[0];
          
          for (const p of pages) {
            const igRes = await axios.get(`https://graph.facebook.com/v18.0/${p.id}?fields=instagram_business_account&access_token=${p.access_token || accessToken}`);
            if (igRes.data?.instagram_business_account) {
              selectedPage = p;
              igAccountId = igRes.data.instagram_business_account.id;
              
              // Get IG username
              const igDetails = await axios.get(`https://graph.facebook.com/v18.0/${igAccountId}?fields=username&access_token=${p.access_token || accessToken}`);
              igUsername = igDetails.data.username;
              break;
            }
          }
          
          fbPageId = selectedPage.id;
          fbPageToken = selectedPage.access_token;
        }
      } catch (metaErr) {
        console.error("Error fetching Meta account details:", metaErr.response?.data || metaErr.message);
      }

      // 3. Save to User Model
      let targetUser = null;
      if (userId) {
        if (userId.includes('@')) {
          targetUser = await User.findOne({ email: userId });
        } else {
          try { targetUser = await User.findById(userId); } catch (e) {}
        }
      } 
      if (!targetUser) {
        targetUser = await User.findOne({ email: "shubhamchavan@live.com" });
      }

      if (targetUser) {
        if (!targetUser.socialAccounts) targetUser.socialAccounts = {};
        
        // Update Facebook details
        targetUser.socialAccounts.facebook = {
          accessToken: accessToken,
          pageId: fbPageId,
          pageAccessToken: fbPageToken
        };
        
        // Update Instagram details
        targetUser.socialAccounts.instagram = {
          accessToken: accessToken,
          igAccountId: igAccountId,
          username: igUsername // We might need to add this to the schema or just use it in the frontend
        };
        
        await targetUser.save();
        console.log(`Saved Meta tokens & IDs to user: ${targetUser.email}. IG: ${igUsername || 'N/A'}`);
      }
    }

    res.redirect(`http://localhost:3000/social?success=true&platform=${platform}`);
  } catch (err) {
    console.error(`Error handling ${platform} callback:`, err.response?.data || err.message);
    res.redirect(`http://localhost:3000/social?error=auth_failed`);
  }
};

exports.getSocialAccounts = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    let user = null;
    if (userId && userId.includes('@')) {
      user = await User.findOne({ email: userId });
    } else if (userId) {
      try { user = await User.findById(userId); } catch (e) {}
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    const socialStatus = {
      facebook: !!user.socialAccounts?.facebook?.accessToken,
      instagram: !!user.socialAccounts?.instagram?.igAccountId,
      twitter: !!user.socialAccounts?.twitter?.accessToken,
      linkedin: !!user.socialAccounts?.linkedin?.accessToken,
      handles: {
        facebook: user.socialAccounts?.facebook?.pageId ? "Connected Page" : null,
        instagram: user.socialAccounts?.instagram?.username ? `@${user.socialAccounts.instagram.username}` : null,
      }
    };

    res.json({ success: true, socialStatus });
  } catch (err) {
    console.error("Error fetching social accounts:", err);
    res.status(500).json({ error: "Server error" });
  }
};
