"use server";

import clientPromise from "@/lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { v2 as cloudinary } from "cloudinary";

// --- నీ వెర్సెల్ వేరియబుల్స్ కి తగ్గట్టుగా సెట్టింగ్స్ ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, // నీ వెర్సెల్ లో ఉన్న పేరు
  api_key: process.env.CLOUDINARY_KEY,    // నీ వెర్సెల్ లో ఉన్న పేరు
  api_secret: process.env.CLOUDINARY_SECRET, // నీ వెర్సెల్ లో ఉన్న పేరు
});

async function uploadToCloudinary(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
      if (error) reject(error);
      else resolve(result?.secure_url);
    }).end(buffer);
  });
}

// ... (మిగతా టెలిగ్రామ్ & ఇన్‌స్టాగ్రామ్ హెల్పర్ ఫంక్షన్స్ ఇక్కడే ఉంటాయి) ...

export async function postToAllPlatforms(formData: FormData): Promise<void> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return;

  const content = formData.get("content") as string;
  const file = formData.get("media") as File;
  const hasFile = file && file.size > 0;

  let mediaUrl = "";
  if (hasFile) mediaUrl = (await uploadToCloudinary(file)) as string;

  const tasks = [];
  if (hasFile) {
    // Telegram
    tasks.push(postToTelegram(content, file));
    
    // Instagram (Media URL అవసరం)
    if (process.env.INSTAGRAM_ACCESS_TOKEN) {
        tasks.push(postToInstagram(content, mediaUrl, file.type.startsWith("video/")));
    }
    
    // YouTube (వీడియో అయితేనే)
    if (file.type.startsWith("video/") && process.env.YOUTUBE_ACCESS_TOKEN) {
        tasks.push(postToYouTube(content, file));
    }
  }

  await Promise.allSettled(tasks);

  const client = await clientPromise;
  await client.db("postjet").collection("posts").insertOne({
    userId: user.id,
    content,
    mediaUrl,
    createdAt: new Date(),
  });
}