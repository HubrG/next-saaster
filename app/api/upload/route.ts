
export async function POST(req: Request) {
  const form = await req.formData();
  // Is it bad/wrong to just use a server action here?
  // await UploadFile(form);

  // Calling a non-server action method to upload the file:
  const file = form.get("file") as File;
  const success = await UploadToGcs(file);

  return Response.json({ success: success });
}

const UploadFile = async (form: FormData) => {
  try {
    const file = form.get("file") as File;
    await UploadToGcs(file);
  } catch (error) {
    console.error(error);
    return false;
  }
};

const UploadToGcs = async (file: File) => {
  if (!file) throw new Error("No file provided");
  if (file.size < 1) throw new Error("File is empty");
  const buffer = await file.arrayBuffer();
  const storage = new Storage();
  await storage
    .bucket(process.env.GCS_BUCKET_NAME ?? "")
    .file(file.name)
    .save(Buffer.from(buffer));

  return true;
};