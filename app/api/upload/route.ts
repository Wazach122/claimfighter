import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png"];
const CLOUDINARY_FOLDER = "claimfighter-denials";
const PDF_COMING_SOON_MESSAGE =
  "PDF support is coming soon. For now, please upload a clear photo of your denial letter.";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isAcceptedFile(file: File) {
  return ACCEPTED_FILE_TYPES.includes(file.type);
}

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

async function uploadToCloudinary(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        resource_type: "auto",
        use_filename: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
}

export async function POST(request: Request) {
  if (!hasCloudinaryConfig()) {
    return Response.json(
      { error: "Upload service is not configured." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Please choose a file to upload." }, { status: 400 });
  }

  if (isPdfFile(file)) {
    return Response.json({ error: PDF_COMING_SOON_MESSAGE }, { status: 400 });
  }

  if (!isAcceptedFile(file)) {
    return Response.json(
      { error: "Please upload a JPG or PNG file." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json(
      { error: "Please upload a file smaller than 10MB." },
      { status: 400 },
    );
  }

  try {
    const result = await uploadToCloudinary(file);

    return Response.json({
      secure_url: result.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary upload failed", error);

    return Response.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}
