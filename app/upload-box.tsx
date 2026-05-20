"use client";

import { ChangeEvent, useState } from "react";
import { HipaaBadge } from "./trust-badges";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png"];
const PDF_COMING_SOON_MESSAGE =
  "PDF support is coming soon. For now, please upload a clear photo of your denial letter.";
const ATTACHMENTS_NOTE =
  "Suggested attachments: denial letter, doctor notes, medical records, treatment plan, and any related bills.";
const APPEAL_DISCLAIMER =
  "This draft is for informational support only and is not legal or medical advice. Please review it carefully before sending.";

type AnalysisResult = {
  insurerName: string | null;
  patientName: string | null;
  denialReason: string | null;
  denialCode: string | null;
  appealDeadline: string | null;
  appealDeadlineDays: number | null;
  denialType:
    | "medical_necessity"
    | "coding_error"
    | "out_of_network"
    | "benefit_limit"
    | "missing_information"
    | "other";
  exactTextUsed: string | null;
  confidenceScore: number;
  isActualDenialLetter: boolean;
};

type ConfirmationForm = {
  patientName: string;
  insurerName: string;
  denialReason: string;
  denialType: AnalysisResult["denialType"];
  appealDeadline: string;
  treatmentOrServiceDenied: string;
  providerName: string;
  whyTreatmentNeeded: string;
};

const emptyConfirmationForm: ConfirmationForm = {
  patientName: "",
  insurerName: "",
  denialReason: "",
  denialType: "other",
  appealDeadline: "",
  treatmentOrServiceDenied: "",
  providerName: "",
  whyTreatmentNeeded: "",
};

const denialTypeOptions: Array<{
  value: AnalysisResult["denialType"];
  label: string;
}> = [
  { value: "medical_necessity", label: "Medical Necessity" },
  { value: "coding_error", label: "Coding Error" },
  { value: "out_of_network", label: "Out of Network" },
  { value: "benefit_limit", label: "Benefit Limit" },
  { value: "missing_information", label: "Missing Information" },
  { value: "other", label: "Other" },
];

function formatFileSize(bytes: number) {
  const sizeInMb = bytes / (1024 * 1024);

  if (sizeInMb >= 1) {
    return `${sizeInMb.toFixed(1)} MB`;
  }

  return `${(bytes / 1024).toFixed(0)} KB`;
}

function isAcceptedFile(file: File) {
  return ACCEPTED_FILE_TYPES.includes(file.type);
}

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function formatDenialType(denialType: AnalysisResult["denialType"]) {
  return denialType
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export default function UploadBox() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [confirmationForm, setConfirmationForm] =
    useState<ConfirmationForm>(emptyConfirmationForm);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [nextStepMessage, setNextStepMessage] = useState("");
  const [isDraftingAppeal, setIsDraftingAppeal] = useState(false);
  const [appealLetter, setAppealLetter] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [pdfMessage, setPdfMessage] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setSelectedFile(null);
    setError("");
    setSuccessMessage("");
    setUploadedUrl("");
    setAnalysisResult(null);
    setConfirmationForm(emptyConfirmationForm);
    setIsConfirmed(false);
    setNextStepMessage("");
    setIsDraftingAppeal(false);
    setAppealLetter("");
    setCopyMessage("");
    setPdfMessage("");

    if (!file) {
      return;
    }

    if (isPdfFile(file)) {
      setError(PDF_COMING_SOON_MESSAGE);
      event.target.value = "";
      return;
    }

    if (!isAcceptedFile(file)) {
      setError("Please upload a JPG or PNG file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Please upload a file smaller than 10MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile || uploadedUrl) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        error?: string;
        secure_url?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed. Please try again.");
      }

      if (!data.secure_url) {
        throw new Error("Upload finished, but no secure URL was returned.");
      }

      console.log("Cloudinary secure_url:", data.secure_url);
      setUploadedUrl(data.secure_url);
      setSuccessMessage("File uploaded securely.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAnalyze() {
    if (!selectedFile || !uploadedUrl || isAnalyzing) {
      return;
    }

    setError("");
    setAnalysisResult(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secure_url: uploadedUrl,
          originalFileName: selectedFile.name,
          fileType: selectedFile.type,
        }),
      });
      const data = (await response.json()) as AnalysisResult & {
        error?: string;
      };

      if (!response.ok) {
        console.error("AI analysis failed:", data);
        throw new Error("AI analysis failed. Please try a clearer JPG photo first.");
      }

      setAnalysisResult(data);
      setConfirmationForm({
        patientName: data.patientName ?? "",
        insurerName: data.insurerName ?? "",
        denialReason: data.denialReason ?? "",
        denialType: data.denialType ?? "other",
        appealDeadline: data.appealDeadline ?? "",
        treatmentOrServiceDenied: "",
        providerName: "",
        whyTreatmentNeeded: "",
      });
      setIsConfirmed(false);
      setNextStepMessage("");
      setAppealLetter("");
      setCopyMessage("");
      setPdfMessage("");
    } catch (analyzeError) {
      console.error("AI analysis failed:", analyzeError);
      setError(
        analyzeError instanceof Error
          ? analyzeError.message
          : "AI analysis failed. Please try a clearer JPG photo first.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleUploadAnotherFile() {
    setSelectedFile(null);
    setError("");
    setSuccessMessage("");
    setUploadedUrl("");
    setAnalysisResult(null);
    setConfirmationForm(emptyConfirmationForm);
    setIsConfirmed(false);
    setNextStepMessage("");
    setIsDraftingAppeal(false);
    setAppealLetter("");
    setCopyMessage("");
    setPdfMessage("");
  }

  const shouldShowResultCards =
    analysisResult &&
    analysisResult.isActualDenialLetter &&
    analysisResult.confidenceScore >= 75;

  function updateConfirmationField(
    field: keyof ConfirmationForm,
    value: string,
  ) {
    setConfirmationForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
    setNextStepMessage("");
    setAppealLetter("");
    setCopyMessage("");
    setPdfMessage("");
  }

  async function handleContinueToAppealDraft() {
    if (!isConfirmed) {
      return;
    }

    setError("");
    setNextStepMessage("");
    setAppealLetter("");
    setCopyMessage("");
    setPdfMessage("");

    if (!confirmationForm.treatmentOrServiceDenied.trim()) {
      setError("Please enter the treatment or service denied.");
      return;
    }

    if (!confirmationForm.providerName.trim()) {
      setError("Please enter the doctor or provider name.");
      return;
    }

    if (!confirmationForm.whyTreatmentNeeded.trim()) {
      setError("Please explain why this treatment is needed.");
      return;
    }

    setIsDraftingAppeal(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch("/api/generate-appeal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirmationForm),
      });
      const data = (await response.json()) as {
        error?: string;
        letter?: string;
      };

      if (!response.ok || !data.letter) {
        throw new Error(
          data.error ??
            "We could not draft the letter. Please check your details and try again.",
        );
      }

      setAppealLetter(data.letter);
      setPdfMessage("");
    } catch (draftError) {
      console.error("Appeal draft generation failed:", draftError);
      setError(
        "We could not draft the letter. Please check your details and try again.",
      );
    } finally {
      setIsDraftingAppeal(false);
    }
  }

  async function handleCopyLetter() {
    if (!appealLetter) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        `${appealLetter}\n\n${ATTACHMENTS_NOTE}\n\n${APPEAL_DISCLAIMER}`,
      );
      setCopyMessage("Letter copied.");
    } catch {
      setCopyMessage("Could not copy the letter. Please select and copy it manually.");
    }
  }

  async function handleDownloadPdf() {
    if (!appealLetter) {
      return;
    }

    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        unit: "pt",
        format: "letter",
      });
      const margin = 72;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const maxLineWidth = pageWidth - margin * 2;
      const lineHeight = 16;
      const content = appealLetter;
      const paragraphs = content.split("\n");
      let y = margin;

      pdf.setTextColor(0, 0, 0);
      pdf.setFont("times", "normal");
      pdf.setFontSize(12);

      paragraphs.forEach((paragraph) => {
        const lines = paragraph
          ? pdf.splitTextToSize(paragraph, maxLineWidth)
          : [""];

        lines.forEach((line: string) => {
          if (y > pageHeight - margin) {
            pdf.addPage();
            y = margin;
          }

          pdf.text(line, margin, y);
          y += lineHeight;
        });
      });

      pdf.save("claimfighter-appeal-letter.pdf");
      setPdfMessage("");
    } catch (pdfError) {
      console.error("PDF download failed:", pdfError);
      setPdfMessage("PDF download failed. Please copy the letter instead.");
    }
  }

  function handleEditDetails() {
    setAppealLetter("");
    setCopyMessage("");
    setPdfMessage("");
    setNextStepMessage("");
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          Upload your denial letter to see what it says in plain English.
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Upload Your Denial Letter
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Take a clear photo of your insurance denial letter. JPG or PNG only.
          Maximum file size 10MB.
        </p>
      </div>

      <label
        htmlFor="denial-letter"
        className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-blue-200 bg-gradient-to-b from-blue-50/80 to-white px-5 py-12 text-center transition hover:border-blue-300 hover:bg-blue-50"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-blue-700 shadow-sm ring-1 ring-blue-100">
          +
        </span>
        <span className="mt-5 text-base font-semibold text-slate-950">
          Choose a file
        </span>
        <span className="mt-2 text-sm leading-6 text-slate-600">
          JPG or PNG only. Maximum file size 10MB.
        </span>
        <input
          id="denial-letter"
          name="denial-letter"
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          className="sr-only"
          onChange={handleFileChange}
        />
      </label>

      {error ? (
        <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
          {error}
        </p>
      ) : null}

      {successMessage ? (
        <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      {selectedFile ? (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950">
              {selectedFile.name}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
            Ready
          </span>
        </div>
      ) : null}

      <p className="mt-5 text-sm leading-6 text-slate-500">
        Your file is sent through secure server-side processing. We do not show
        the uploaded file link on this page.
      </p>
      <div className="mt-5">
        <HipaaBadge />
      </div>

      <button
        type="button"
        disabled={!selectedFile || isUploading || isAnalyzing}
        onClick={uploadedUrl ? handleAnalyze : handleUpload}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#2563EB] px-6 py-3 text-base font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none sm:w-auto"
      >
        {isUploading
          ? "Uploading..."
          : isAnalyzing
            ? "Reading your denial letter..."
            : uploadedUrl
              ? "Analyze My Letter"
              : "Continue"}
      </button>

      {isAnalyzing ? (
        <p className="mt-4 text-sm font-medium text-blue-700">
          Reading your denial letter...
        </p>
      ) : null}

      {analysisResult ? (
        <div className="mt-8 space-y-4">
          {!analysisResult.isActualDenialLetter ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium leading-6 text-amber-800">
                This does not look like an insurance denial letter. Please
                upload a clear photo of your insurance denial letter.
              </p>
              <button
                type="button"
                onClick={handleUploadAnotherFile}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-amber-300 bg-white px-5 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-100 sm:w-auto"
              >
                Upload Another File
              </button>
            </div>
          ) : null}

          {analysisResult.isActualDenialLetter &&
          analysisResult.confidenceScore < 75 ? (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              We could not read this clearly. Please upload a clearer photo.
            </p>
          ) : null}

          {shouldShowResultCards ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard
                  label="Insurance Company"
                  value={analysisResult.insurerName ?? "Not visible"}
                />
                <ResultCard
                  label="Denial Reason"
                  value={analysisResult.denialReason ?? "Not visible"}
                />
                <ResultCard
                  label="Denial Type"
                  value={formatDenialType(analysisResult.denialType)}
                />
                <ResultCard
                  label="Appeal Deadline"
                  value={
                    analysisResult.appealDeadline ??
                    (analysisResult.appealDeadlineDays
                      ? `${analysisResult.appealDeadlineDays} days`
                      : "Not visible")
                  }
                />
                <ResultCard
                  label="Confidence Score"
                  value={`${analysisResult.confidenceScore}%`}
                />
                <ResultCard
                  label="Exact Text Found"
                  value={analysisResult.exactTextUsed ?? "Not visible"}
                />
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="max-w-2xl">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-950">
                    Review Your Appeal Details
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    Please check the details below. You can edit anything before
                    we draft your appeal letter.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Patient Name"
                    value={confirmationForm.patientName}
                    onChange={(value) =>
                      updateConfirmationField("patientName", value)
                    }
                  />
                  <FormField
                    label="Insurance Company"
                    value={confirmationForm.insurerName}
                    onChange={(value) =>
                      updateConfirmationField("insurerName", value)
                    }
                  />
                  <FormField
                    label="Denial Reason"
                    value={confirmationForm.denialReason}
                    onChange={(value) =>
                      updateConfirmationField("denialReason", value)
                    }
                    isTextArea
                  />
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    Denial Type
                    <select
                      value={confirmationForm.denialType}
                      onChange={(event) =>
                        updateConfirmationField("denialType", event.target.value)
                      }
                      className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      {denialTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <FormField
                    label="Appeal Deadline"
                    value={confirmationForm.appealDeadline}
                    onChange={(value) =>
                      updateConfirmationField("appealDeadline", value)
                    }
                  />
                  <FormField
                    label="Treatment or Service Denied"
                    value={confirmationForm.treatmentOrServiceDenied}
                    onChange={(value) =>
                      updateConfirmationField(
                        "treatmentOrServiceDenied",
                        value,
                      )
                    }
                  />
                  <FormField
                    label="Doctor or Provider Name"
                    value={confirmationForm.providerName}
                    onChange={(value) =>
                      updateConfirmationField("providerName", value)
                    }
                  />
                  <FormField
                    label="Why You Need This Treatment"
                    value={confirmationForm.whyTreatmentNeeded}
                    onChange={(value) =>
                      updateConfirmationField("whyTreatmentNeeded", value)
                    }
                    isTextArea
                  />
                </div>

                <label className="mt-6 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-700">
                  <input
                    type="checkbox"
                    checked={isConfirmed}
                    onChange={(event) => {
                      setIsConfirmed(event.target.checked);
                      setNextStepMessage("");
                    }}
                    className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#2563EB]"
                  />
                  I reviewed this information and confirm it is correct.
                </label>

                <button
                  type="button"
                  disabled={!isConfirmed || isDraftingAppeal}
                  onClick={handleContinueToAppealDraft}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#2563EB] px-6 py-3 text-base font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none sm:w-auto"
                >
                  {isDraftingAppeal
                    ? "Drafting your appeal letter..."
                    : "Continue to Appeal Draft"}
                </button>

                {isDraftingAppeal ? (
                  <p className="mt-4 text-sm font-medium text-blue-700">
                    Drafting your appeal letter...
                  </p>
                ) : null}

                {nextStepMessage ? (
                  <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {nextStepMessage}
                  </p>
                ) : null}
              </div>

              {appealLetter ? (
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-slate-950">
                        Appeal Letter Draft
                      </h3>
                      <p className="mt-2 text-base leading-7 text-slate-600">
                        Review this draft carefully before sending it to your
                        insurance company.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-5 font-serif text-base leading-8 text-slate-800">
                    {appealLetter}
                  </div>

                  <p className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium leading-6 text-blue-900">
                    {ATTACHMENTS_NOTE}
                  </p>

                  <p className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-600">
                    {APPEAL_DISCLAIMER}
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleCopyLetter}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                      Copy Letter
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleEditDetails}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                      Edit Details
                    </button>
                    <button
                      type="button"
                      onClick={handleUploadAnotherFile}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                      Start Over
                    </button>
                  </div>

                  {copyMessage ? (
                    <p className="mt-4 text-sm font-medium text-slate-600">
                      {copyMessage}
                    </p>
                  ) : null}

                  {pdfMessage ? (
                    <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {pdfMessage}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  isTextArea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isTextArea?: boolean;
}) {
  const sharedClassName =
    "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
      {label}
      {isTextArea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className={sharedClassName}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={sharedClassName}
        />
      )}
    </label>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold leading-7 text-slate-950">
        {value}
      </p>
    </div>
  );
}
