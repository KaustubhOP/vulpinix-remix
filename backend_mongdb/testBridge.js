require("dotenv").config();
const axios = require("axios");
const User = require("./models/user");
const mongoose = require("mongoose");
const FormData = require('form-data');

async function testBridge() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const userEmail = "burno7584@gmail.com";
  const user = await User.findOne({ email: userEmail });
  
  try {
    const fbToken = user.socialAccounts?.facebook?.accessToken;
    const forceRes = await axios.get(`https://graph.facebook.com/v18.0/1111932568671242?fields=access_token,name&access_token=${fbToken}`);
    const pageToken = forceRes.data.access_token;
    const pageId = forceRes.data.id;

    // 1. Upload base64 to FB
    console.log("Uploading base64 to Facebook...");
    const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="; // Tiny red dot
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    const form = new FormData();
    form.append('source', imageBuffer, { filename: 'test.png', contentType: 'image/png' });
    form.append('message', 'Bridge Test ' + new Date().toISOString());
    form.append('access_token', pageToken);
    
    const fbRes = await axios.post(`https://graph.facebook.com/v18.0/${pageId}/photos`, form, { headers: { ...form.getHeaders() } });
    const fbPhotoId = fbRes.data.id;
    console.log(`FB Photo ID: ${fbPhotoId}`);

    // 2. Get CDN URL
    console.log("Getting CDN URL from Facebook...");
    const photoDetail = await axios.get(`https://graph.facebook.com/v18.0/${fbPhotoId}?fields=images&access_token=${pageToken}`);
    const igImageUrl = photoDetail.data.images[0]?.source;
    console.log(`CDN URL: ${igImageUrl}`);

    // 3. Post to IG
    const igAccountRes = await axios.get(`https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`);
    const igAccountId = igAccountRes.data.instagram_business_account.id;

    console.log("Creating IG media container...");
    const containerRes = await axios.post(`https://graph.facebook.com/v18.0/${igAccountId}/media`, {
      image_url: igImageUrl,
      caption: "Bridge Test " + new Date().toLocaleTimeString(),
      access_token: pageToken
    });

    const creationId = containerRes.data.id;
    console.log(`Creation ID: ${creationId}`);

    // Wait and Publish
    console.log("Waiting 10s...");
    await new Promise(r => setTimeout(r, 10000));
    
    const publishRes = await axios.post(`https://graph.facebook.com/v18.0/${igAccountId}/media_publish`, {
        creation_id: creationId,
        access_token: pageToken
    });
    console.log("✅ Published to IG!", publishRes.data.id);

  } catch (err) {
    console.error("❌ Failed!", err.response?.data || err.message);
  }

  await mongoose.disconnect();
}

testBridge();
