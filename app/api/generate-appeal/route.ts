type GenerateAppealRequest = {
  patientName?: unknown;
  insurerName?: unknown;
  denialReason?: unknown;
  denialType?: unknown;
  appealDeadline?: unknown;
  treatmentOrServiceDenied?: unknown;
  providerName?: unknown;
  whyTreatmentNeeded?: unknown;
};

function toStringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function fallback(value: string, fallbackValue: string) {
  return value || fallbackValue;
}

function today() {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date());
}

export async function POST(request: Request) {
  let body: GenerateAppealRequest;

  try {
    body = (await request.json()) as GenerateAppealRequest;
  } catch {
    return Response.json({ error: "Invalid appeal draft request." }, { status: 400 });
  }

  const patientName = toStringValue(body.patientName);
  const insurerName = toStringValue(body.insurerName);
  const denialReason = toStringValue(body.denialReason);
  const treatmentOrServiceDenied = toStringValue(body.treatmentOrServiceDenied);
  const providerName = toStringValue(body.providerName);
  const whyTreatmentNeeded = toStringValue(body.whyTreatmentNeeded);

  if (!treatmentOrServiceDenied) {
    return Response.json(
      { error: "Please enter the treatment or service denied." },
      { status: 400 },
    );
  }

  if (!providerName) {
    return Response.json(
      { error: "Please enter the doctor or provider name." },
      { status: 400 },
    );
  }

  if (!whyTreatmentNeeded) {
    return Response.json(
      { error: "Please explain why this treatment is needed." },
      { status: 400 },
    );
  }

  const letter = `${today()}

To:
${fallback(insurerName, "[Insurance Company]")}

Subject: Appeal of Denied Claim for ${fallback(
    treatmentOrServiceDenied,
    "[Treatment or Service Denied]",
  )}

Dear Claims Review Department,

I am writing to formally appeal the denial of coverage for ${fallback(
    treatmentOrServiceDenied,
    "[Treatment or Service Denied]",
  )}.

According to the denial information, the claim was denied for the following reason:
${fallback(denialReason, "[Denial Reason]")}

I respectfully request that this decision be reviewed again. My provider, ${fallback(
    providerName,
    "[Doctor or Provider Name]",
  )}, recommended this treatment/service because:
${fallback(whyTreatmentNeeded, "[Why You Need This Treatment]")}

This treatment/service is important for my care and recovery. I am asking the insurance company to reconsider the denial and review any supporting medical records, provider notes, and other documents included with this appeal.

If more information is needed, please contact me or my healthcare provider.

Thank you for your time and review.

Sincerely,

${fallback(patientName, "[Patient Name]")}`;

  return Response.json({ letter });
}
