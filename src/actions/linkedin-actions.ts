"use server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function postToLinkedInWithMedia(formData: FormData) {
  const text = formData.get("text") as string;
  const file = formData.get("media") as File;
  const token = process.env.LINKEDIN_ACCESS_TOKEN?.trim();
  const author = process.env.LINKEDIN_PERSON_URN?.trim();

  try {
    let imageUrn = "";

    if (file && file.size > 0) {
      // 1. LinkedIn లో ఇమేజ్ అప్‌లోడ్ చేయడానికి "Register" చేయాలి
      const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
            owner: author,
            serviceRelationships: [{
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent"
            }]
          }
        })
      });

      const registerData = await registerRes.json();
      const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      imageUrn = registerData.value.asset;

      // 2. ఇప్పుడు ఆ ఇమేజ్‌ని లింక్డిన్ ఇచ్చిన URL కి పంపాలి (Native Upload)
      const imageBuffer = Buffer.from(await file.arrayBuffer());
      await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: imageBuffer,
      });
    }

    // 3. ఇప్పుడు పోస్ట్ క్రియేట్ చేయాలి (ఇక్కడ URN వాడుతున్నాం, URL కాదు!)
    const body: any = {
      author: author,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: text },
          shareMediaCategory: imageUrn ? 'IMAGE' : 'NONE',
        },
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    };

    if (imageUrn) {
      body.specificContent['com.linkedin.ugc.ShareContent'].media = [{
        status: 'READY',
        description: { text: 'Shared via PostJet' },
        media: imageUrn, // 👈 ఇదే మ్యాజిక్! ఇప్పుడు URN వెళ్తుంది.
        title: { text: 'Media Post' }
      }];
    }

    const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) return { success: true };
    const errData = await res.json();
    return { success: false, error: errData.message };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}