import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function GET() {
  try {
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      max_results: 30
    });
    const images = resources.map((r: any) => ({
      url: r.secure_url,
      public_id: r.public_id
    }));
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}