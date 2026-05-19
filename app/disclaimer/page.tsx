import LegalPage from "../legal-page";

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      intro="Please read this before using ClaimFighter."
    >
      <p>
        ClaimFighter helps users understand insurance denial letters and draft
        appeal letters. We are not a law firm, we are not doctors, and we do not
        provide legal, medical, or insurance advice. Users are responsible for
        reviewing all information before sending an appeal. For complex cases,
        consult a licensed attorney, healthcare provider, insurance
        professional, or patient advocate.
      </p>
    </LegalPage>
  );
}
