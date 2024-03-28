import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  if (!file) throw new Error("No file provided");
  if (file.size < 1) throw new Error("File is empty");
  try {
    const url: string = await new Promise(async (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
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
        },
        (error, result) => {
          if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject("Failed to upload file to Cloudinary");
              throw new Error("Failed to upload file to Cloudinary");
          } else {
            console.log("Cloudinary Upload Result:", result?.secure_url);
            resolve(result?.secure_url ?? "");
          }
        }
      );

      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = require("stream");
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      bufferStream.pipe(uploadStream);
    });
    return NextResponse.json({ success: url });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
// import { v2 as cloudinary } from "cloudinary";
// import { NextApiResponse } from "next";
// import { NextRequest } from "next/server";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req: NextRequest, res: NextApiResponse) {
//     const reqBody = await req.json();
//     console.log(reqBody);
//     return;
// }
//   const form = new IncomingForm(); // Modifié ici
//   form.parse(reqBody, async (err, fields, files) => {
//     if (err) {
//       console.error("Erreur lors du parsing du formulaire :", err);
//       return res
//         .status(500)
//         .json({ message: "Erreur serveur lors du parsing du fichier." });
//     }
//     // Traitement du fichier uploadé
//     const file = files.file ? (files.file[0] as formidable.File) : undefined;
//     console.log(file);
//     return;
//   });
// }
//     return;
//   const reqBody = await req.json();

//   const { data, provider, secret } = reqBody;
//   if (!verifySecretRequest(secret)) throw new ActionError("Unauthorized");
//   const file: File | null = data.get("file") as unknown as File;
//   if (!file) throw new Error("No file provided");
//   if (file.size < 1) throw new Error("File is empty");
//   try {
//     const bytes = await file.arrayBuffer();
//     // NOTE: Google Cloud Storage
//     if (provider === "GCS") {
//       const storage = new Storage({
//         projectId: process.env.GCS_CLIENT_ID,
//       });
//       await storage
//         .bucket(process.env.GCS_BUCKET_NAME ?? "")
//         .file(file.name)
//         .save(Buffer.from(bytes));

//       const metadata = await storage
//         .bucket(process.env.GCS_BUCKET_NAME ?? "")
//         .file(file.name)
//         .getMetadata();

//       if (!metadata[0].mediaLink) {
//         throw new Error("Failed to upload file to GCS");
//       }
//       return handleRes<string>({
//         success: metadata[0].mediaLink,
//         statusCode: 200,
//       });
//     }
//     // NOTE: Cloudinary
//     else if (provider === "Cloudinary") {
//       const url: string = await new Promise(async (resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             resource_type: "auto",
//             transformation: [
//               {
//                 width: 400,
//                 height: 400,
//                 gravity: "face",
//                 crop: "thumb",
//               },
//               { fetch_format: "webp" },
//             ],
//           },
//           (error, result) => {
//             if (error) {
//               console.error("Cloudinary Upload Error:", error);
//               reject("Failed to upload file to Cloudinary");
//             } else {
//               console.log("Cloudinary Upload Result:", result?.secure_url);
//               resolve(result?.secure_url ?? "");
//             }
//           }
//         );

//         const buffer = Buffer.from(await file.arrayBuffer());
//         const stream = require("stream");
//         const bufferStream = new stream.PassThrough();
//         bufferStream.end(buffer);
//         bufferStream.pipe(uploadStream);
//       });

//       return handleRes<string>({
//         success: url,
//         statusCode: 200,
//       });
//     }
//     throw new ActionError("No provider selected");
//   } catch (ActionError) {
//     return handleRes<string>({
//       error: ActionError,
//       statusCode: 500,
//     });
//   }
// }
