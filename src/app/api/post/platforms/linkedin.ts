export async function postToLinkedIn(content: string, mediaUrl: string, mediaType: string, token: string) {
  try {
    if (!token) throw new Error("Missing Access Token");

    // 1. User Info (Person URN) Fetch
    const meRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const meData = await meRes.json();
    const personUrn = `urn:li:person:${meData.sub}`;

    let mediaAsset = "";

    if (mediaUrl) {
      // Detecting Media Type
      const isVideo = mediaUrl.toLowerCase().match(/\.(mp4|mov|avi|m4v)/i) || mediaUrl.includes("video");
      
      // Fetching media from Cloudinary
      const mediaFetch = await fetch(mediaUrl);
      if (!mediaFetch.ok) throw new Error("Cloudinary fetch failed");
      const mediaBlob = await mediaFetch.blob();

      // 2. Register Upload (UGC API)
      const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          registerUploadRequest: {
            owner: personUrn,
            recipes: [isVideo ? "urn:li:digitalmediaRecipe:feedshare-video" : "urn:li:digitalmediaRecipe:feedshare-image"],
            serviceRelationships: [{
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent"
            }]
          }
        })
      });

      const registerData = await registerRes.json();
      
      // Error Handling for Registration
      if (!registerRes.ok) throw new Error(`LinkedIn Registration Error: ${registerData.message}`);

      // Fix for the 'undefined' uploadUrl issue
      const uploadMechanism = registerData.value.uploadMechanism;
      const mechanismKey = Object.keys(uploadMechanism)[0]; 
      const uploadUrl = uploadMechanism[mechanismKey].uploadUrl;
      mediaAsset = registerData.value.asset;

      // 3. Binary Data Upload (PUT)
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': mediaBlob.type 
        },
        body: mediaBlob
      });

      if (!uploadRes.ok) throw new Error("Binary upload to LinkedIn failed");

      if (isVideo) {
        console.log("Video uploaded to UGC, waiting for processing buffer...");
        await new Promise(r => setTimeout(r, 7000)); // Increased to 7s for safety
      }
    }

    // 4. Create the Post (UGC Structure)
    const postPayload = {
      author: personUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content },
          shareMediaCategory: mediaAsset ? (mediaUrl.toLowerCase().includes("video") || mediaUrl.match(/\.(mp4|mov)/i) ? "VIDEO" : "IMAGE") : "NONE",
          ...(mediaAsset ? {
            media: [{
              status: "READY",
              media: mediaAsset,
              title: { text: "Post via PostJet" },
              description: { text: "Automated video post" }
            }]
          } : {})
        }
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
    };

    const finalRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postPayload)
    });

    const finalData = await finalRes.json();
    console.log('LinkedIn UGC POST response:', finalData);

    if (finalRes.status === 201) {
      console.log("UGC Post Created Successfully!");
      return { success: true, data: finalData };
    }

    throw new Error(finalData.message || `UGC Post Failed: ${JSON.stringify(finalData)}`);

  } catch (error: any) {
    console.error("LinkedIn Plan B Final Error:", error.message);
    throw new Error(error.message);
  }
}