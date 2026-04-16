import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function GET() {
  try {
    // క్లౌడ్-డినరీ నుండి చివరి 20 ఇమేజ్‌లను తెస్తుంది
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'postjet/', // నీ ఫోల్డర్ పేరు (ఐచ్ఛికం)
      max_results: 20
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