require("dotenv").config();
const axios = require("axios");
const User = require("./models/user");
const mongoose = require("mongoose");

async function testPublish() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const userEmail = "burno7584@gmail.com";
  const user = await User.findOne({ email: userEmail });
  
  if (!user) {
    console.log("User not found");
    process.exit(1);
  }

  const fbToken = user.socialAccounts?.facebook?.accessToken;
  
  try {
    const forceRes = await axios.get(`https://graph.facebook.com/v18.0/1111932568671242?fields=access_token,name,is_published&access_token=${fbToken}`);
    console.log(`Page Name: ${forceRes.data.name}`);
    console.log(`Is Published: ${forceRes.data.is_published}`);
    
    const pageToken = forceRes.data.access_token;
    const pageId = forceRes.data.id;

    const igAccountRes = await axios.get(`https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`);
    const igAccountId = igAccountRes.data.instagram_business_account.id;

    // Try with a very standard public URL
    const testImageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?fm=jpg&w=800&q=80";
    
    console.log("Creating IG media container...");
    const containerRes = await axios.post(`https://graph.facebook.com/v18.0/${igAccountId}/media`, {
      image_url: testImageUrl,
      caption: "Vulpinix Live Test " + new Date().toLocaleTimeString(),
      access_token: pageToken
    });

    const creationId = containerRes.data.id;
    console.log(`Creation ID: ${creationId}`);

    console.log("Waiting for media to be ready...");
    let status = "IN_PROGRESS";
    for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const statusRes = await axios.get(`https://graph.facebook.com/v18.0/${creationId}?fields=status_code,status&access_token=${pageToken}`);
        status = statusRes.data.status_code;
        console.log(`Current status: ${status}`);
        if (status === "FINISHED") break;
        if (status === "ERROR") {
            console.log("Error details:", statusRes.data.status);
            break;
        }
    }

    if (status === "FINISHED") {
        console.log("Publishing...");
        const publishRes = await axios.post(`https://graph.facebook.com/v18.0/${igAccountId}/media_publish`, {
            creation_id: creationId,
            access_token: pageToken
        });
        console.log("✅ Successfully published!", publishRes.data.id);
    } else {
        console.log("❌ Media not ready or failed.");
    }

  } catch (err) {
    console.error("❌ Error!", err.response?.data || err.message);
  }

  await mongoose.disconnect();
}

testPublish();
