require("dotenv").config();
const axios = require("axios");
const User = require("./models/user");
const mongoose = require("mongoose");

async function checkInstagram() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Find users with socialAccounts.facebook or instagram (they share the same token system)
  const users = await User.find({ "socialAccounts.facebook.accessToken": { $exists: true, $ne: "" } });
  
  if (users.length === 0) {
    console.log("No user found with a connected Meta/Facebook account in DB.");
    process.exit(0);
  }

  for (const user of users) {
    console.log(`\nChecking Instagram connection for user: ${user.email}`);
    const token = user.socialAccounts.facebook.accessToken;
    
    try {
      // 1. Get Facebook Pages
      const url = `https://graph.facebook.com/v18.0/me/accounts?access_token=${token}`;
      const response = await axios.get(url);
      const pages = response.data.data || [];
      
      console.log(`Found ${pages.length} Facebook pages.`);

      if (pages.length === 0) {
        console.log("Checking if we can force-fetch Page ID 1111932568671242...");
        try {
           const forceRes = await axios.get(`https://graph.facebook.com/v18.0/1111932568671242?fields=access_token,name&access_token=${token}`);
           if (forceRes.data && forceRes.data.access_token) {
             pages.push(forceRes.data);
             console.log("✅ Force-fetch successful!");
           }
        } catch (e) {
          console.log("❌ Force-fetch failed.");
        }
      }

      for (const p of pages) {
        console.log(`\n--- Checking Page: ${p.name} (${p.id}) ---`);
        
        // 2. Check for Instagram Business Account linked to this page
        try {
          const igUrl = `https://graph.facebook.com/v18.0/${p.id}?fields=instagram_business_account,name&access_token=${p.access_token || token}`;
          const igRes = await axios.get(igUrl);
          const igAccount = igRes.data.instagram_business_account;

          if (igAccount) {
            console.log(`✅ Found Linked Instagram Business Account!`);
            console.log(`   IG Account ID: ${igAccount.id}`);
            
            // 3. Get Instagram Account Details (username)
            try {
              const igDetailsUrl = `https://graph.facebook.com/v18.0/${igAccount.id}?fields=username,name,profile_picture_url&access_token=${p.access_token || token}`;
              const igDetailsRes = await axios.get(igDetailsUrl);
              console.log(`   IG Username: @${igDetailsRes.data.username}`);
              console.log(`   IG Name: ${igDetailsRes.data.name}`);
            } catch (detailErr) {
              console.log(`   ⚠️ Could not fetch IG details: ${detailErr.response?.data?.error?.message || detailErr.message}`);
            }
          } else {
            console.log(`❌ No Instagram Business Account linked to this page.`);
            console.log(`   Note: Ensure your IG account is a "Business" or "Creator" account and linked to this FB Page.`);
          }
        } catch (igErr) {
          console.error(`   ❌ Error checking IG for this page:`, igErr.response?.data?.error?.message || igErr.message);
        }
      }

    } catch (err) {
      console.error("Meta API Error for this user:", err.response?.data?.error?.message || err.message);
    }
  }
  
  await mongoose.disconnect();
}

checkInstagram();
