import { GoogleGenAI } from "@google/genai";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png"];
const PDF_COMING_SOON_MESSAGE =
  "PDF support is coming soon. For now, please upload a clear photo of your denial letter.";
const DENIAL_TYPES = [
  "medical_necessity",
  "coding_error",
  "out_of_network",
  "benefit_limit",
  "missing_information",
  "other",
] as const;

type DenialType = (typeof DENIAL_TYPES)[number];

type AnalyzeRequest = {
  secure_url?: unknown;
  originalFileName?: unknown;
  fileType?: unknown;
};

type GeminiAnalysis = {
  insurerName: string | null;
  patientName: string | null;
  denialReason: string | null;
  denialCode: string | null;
  appealDeadline: string | null;
  appealDeadlineDays: number | null;
  denialType: DenialType;
  exactTextUsed: string | null;
  confidenceScore: number;
  isActualDenialLetter: boolean;
};

export const runtime = "nodejs";

function hasGeminiConfig() {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL);
}

function isAcceptedFileType(fileType: string) {
  return ACCEPTED_FILE_TYPES.includes(fileType);
}

function normalizeMimeType(fileType: string, fileName: string) {
  const lowerFileType = fileType.toLowerCase();
  const lowerFileName = fileName.toLowerCase();

  if (lowerFileType === "image/jpeg" || lowerFileType === "image/jpg") {
    return "image/jpeg";
  }

  if (lowerFileType === "image/png") {
    return "image/png";
  }

  if (lowerFileName.endsWith(".jpg") || lowerFileName.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (lowerFileName.endsWith(".png")) {
    return "image/png";
  }

  return "";
}

function isPdfInput(fileType: string, fileName: string) {
  return (
    fileType.toLowerCase() === "application/pdf" ||
    fileName.toLowerCase().endsWith(".pdf")
  );
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function toNullableString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function toNullableNumber(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}

function toConfidenceScore(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function toDenialType(value: unknown): DenialType {
  if (typeof value === "string" && DENIAL_TYPES.includes(value as DenialType)) {
    return value as DenialType;
  }

  return "other";
}

function normalizeAnalysis(value: Record<string, unknown>): GeminiAnalysis {
  return {
    insurerName: toNullableString(value.insurerName),
    patientName: toNullableString(value.patientName),
    denialReason: toNullableString(value.denialReason),
    denialCode: toNullableString(value.denialCode),
    appealDeadline: toNullableString(value.appealDeadline),
    appealDeadlineDays: toNullableNumber(value.appealDeadlineDays),
    denialType: toDenialType(value.denialType),
    exactTextUsed: toNullableString(value.exactTextUsed),
    confidenceScore: toConfidenceScore(value.confidenceScore),
    isActualDenialLetter: value.isActualDenialLetter === true,
  };
}

function stripMarkdownFences(text: string) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseJsonResponse(text: string) {
  const cleanedText = stripMarkdownFences(text);

  try {
    return JSON.parse(cleanedText) as Record<string, unknown>;
  } catch {
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Gemini did not return valid JSON.");
    }

    try {
      return JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    } catch {
      throw new Error("Gemini returned JSON-like text that could not be parsed.");
    }
  }
}

async function fetchCloudinaryFile(secureUrl: string) {
  const response = await fetch(secureUrl);
  const detectedMimeType = response.headers.get("content-type") ?? "";

  console.log("[analyze-letter] Cloudinary fetch status:", response.status);
  console.log("[analyze-letter] detected MIME type:", detectedMimeType);

  if (!response.ok) {
    throw new Error("Could not fetch uploaded file.");
  }

  const contentLength = response.headers.get("content-length");

  if (contentLength && Number(contentLength) > MAX_FILE_SIZE) {
    throw new Error("Uploaded file is over 10MB.");
  }

  const arrayBuffer = await response.arrayBuffer();

  if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
    throw new Error("Uploaded file is over 10MB.");
  }

  return {
    base64: Buffer.from(arrayBuffer).toString("base64"),
    detectedMimeType,
  };
}

function buildPrompt(originalFileName: string) {
  return `
You are helping a user understand an insurance denial letter.

Analyze the uploaded file named "${originalFileName}".

Return only valid JSON. Do not include markdown. Do not include commentary before or after the JSON.
Do not give legal advice. Do not provide medical advice. Do not guarantee appeal approval.
If this is not an insurance denial letter, set isActualDenialLetter to false.

Return this exact JSON shape:
{
  "insurerName": string or null,
  "patientName": string or null,
  "denialReason": string or null,
  "denialCode": string or null,
  "appealDeadline": string or null,
  "appealDeadlineDays": number or null,
  "denialType": "medical_necessity" | "coding_error" | "out_of_network" | "benefit_limit" | "missing_information" | "other",
  "exactTextUsed": string or null,
  "confidenceScore": number from 0 to 100,
  "isActualDenialLetter": boolean
}

Use simple English for denialReason.
For exactTextUsed, include the shortest exact excerpt from the letter that supports the denial reason.
For appealDeadlineDays, calculate the number of days only if the document makes it possible.
`.trim();
}

export async function POST(request: Request) {
  if (!hasGeminiConfig()) {
    return Response.json(
      { error: "AI analysis is not configured." },
      { status: 500 },
    );
  }

  let body: AnalyzeRequest;

  try {
    body = (await request.json()) as AnalyzeRequest;
  } catch {
    return Response.json({ error: "Invalid analysis request." }, { status: 400 });
  }

  if (
    typeof body.secure_url !== "string" ||
    typeof body.originalFileName !== "string" ||
    typeof body.fileType !== "string"
  ) {
    return Response.json(
      { error: "Missing uploaded file details." },
      { status: 400 },
    );
  }

  console.log("[analyze-letter] received secure_url:", body.secure_url);
  console.log("[analyze-letter] fileName:", body.originalFileName);
  console.log("[analyze-letter] fileType:", body.fileType);

  if (!isHttpsUrl(body.secure_url)) {
    return Response.json({ error: "Invalid uploaded file URL." }, { status: 400 });
  }

  const mimeType = normalizeMimeType(body.fileType, body.originalFileName);

  if (isPdfInput(body.fileType, body.originalFileName)) {
    return Response.json({ error: PDF_COMING_SOON_MESSAGE }, { status: 400 });
  }

  if (!isAcceptedFileType(mimeType)) {
    return Response.json(
      { error: "Only JPG and PNG files can be analyzed." },
      { status: 400 },
    );
  }

  try {
    const cloudinaryFile = await fetchCloudinaryFile(body.secure_url);
    console.log("[analyze-letter] MIME type sent to Gemini:", mimeType);

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL as string,
      contents: [
        {
          inlineData: {
            data: cloudinaryFile.base64,
            mimeType,
          },
        },
        { text: buildPrompt(body.originalFileName) },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });
    const rawText = response.text ?? "";
    console.log("[analyze-letter] Gemini response raw text:", rawText);

    const parsed = parseJsonResponse(rawText);
    const analysis = normalizeAnalysis(parsed);

    return Response.json(analysis);
  } catch (error) {
    console.error("Gemini analysis failed", error);
    const message =
      error instanceof Error ? error.message : "Unknown Gemini analysis error.";
    const isDevelopment = process.env.NODE_ENV !== "production";

    return Response.json(
      {
        error: isDevelopment
          ? message
          : "We could not analyze this letter. Please try again.",
      },
      { status: 500 },
    );
  }
}
