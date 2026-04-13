"use server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) return { error: "No file" };

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "postjet_uploads" },
        (error, result) => {
          if (error) reject(error);
          else resolve({ url: result?.secure_url, resourceType: result?.resource_type });
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    return { error: "Upload failed" };
  }
}