import LegalPage from "../legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This page explains how the ClaimFighter MVP handles uploaded denial letters and related information."
    >
      <p>
        Users upload insurance denial letters so ClaimFighter can process the
        document, help explain it in plain English, and generate appeal support.
      </p>
      <p>
        Uploaded files are used only to analyze the letter and generate appeal
        support. We do not sell user data.
      </p>
      <p>
        ClaimFighter does not provide legal or medical advice. Users should not
        upload documents they do not have permission to use.
      </p>
      <p>
        Uploaded files are processed through Cloudinary and Gemini API. This MVP
        does not create user accounts yet.
      </p>
      <p>
        Users can contact us for deletion requests. Since this MVP does not yet
        include user accounts, please include enough information for us to locate
        the uploaded file if you request deletion.
      </p>
    </LegalPage>
  );
}
