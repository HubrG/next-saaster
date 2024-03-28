import { put } from "@vercel/blob";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  // ⚠️ The below code is for App Router Route Handlers only
  if (!filename) {
    return new NextResponse("Filename is required", {
      status: 400,
    });
  }
  if (!request.body) {
    return new NextResponse("No file provided", {
      status: 400,
    });
  }
  const blob = await put(filename, request.body, {
    access: "public",
  });
  const result = await cloudinary.uploader
    .upload(blob.url, {
      resource_type: "auto",
      transformation: [
        {
          width: 400,
          height: 400,
          gravity: "face",
          crop: "thumb",
        },
        { fetch_format: "webp" },
      ],
    })
   
  return NextResponse.json({ blob, url: result.secure_url});
}
