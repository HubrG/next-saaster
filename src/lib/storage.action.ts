"use server";

import { Storage } from "@google-cloud/storage";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import { verifySecretRequest } from "../helpers/functions/verifySecretRequest";
import {
  HandleResponseProps,
  handleRes,
} from "./error-handling/handleResponse";
import { ActionError, authAction } from "./safe-actions";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  
});

export const UploadFile = authAction(
  z.object({
    data: z.instanceof(FormData),
    provider: z.enum(["GCS", "Cloudinary"]),
    secret: z.string(),
  }),
  async ({ data, provider, secret }): Promise<HandleResponseProps<string>> => {
    if (!verifySecretRequest(secret)) throw new ActionError("Unauthorized");
    const file: File | null = data.get("file") as unknown as File;
    if (!file) throw new Error("No file provided");
    if (file.size < 1) throw new Error("File is empty");
    try {
      const bytes = await file.arrayBuffer();
      // NOTE: Google Cloud Storage
      if (provider === "GCS") {
        const storage = new Storage({
          projectId: process.env.GCS_CLIENT_ID,
        });
        await storage
          .bucket(process.env.GCS_BUCKET_NAME ?? "")
          .file(file.name)
          .save(Buffer.from(bytes));

        const metadata = await storage
          .bucket(process.env.GCS_BUCKET_NAME ?? "")
          .file(file.name)
          .getMetadata();

        if (!metadata[0].mediaLink) {
          throw new Error("Failed to upload file to GCS");
        }
        return handleRes<string>({
          success: metadata[0].mediaLink,
          statusCode: 200,
        });
      }
      // NOTE: Cloudinary
      else if (provider === "Cloudinary") {
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

        return handleRes<string>({
          success: url,
          statusCode: 200,
        });
      }
      throw new ActionError("No provider selected");
    } catch (ActionError) {
      return handleRes<string>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);
