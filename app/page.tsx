import Link from "next/link";
import { HipaaBadge, StarRatingBadge } from "./trust-badges";
import UploadBox from "./upload-box";

const trustBarItems = [
  "HIPAA compliant",
  "No login required",
  "All 50 states",
  "Under 10 minutes",
  "Free to try",
];

const valueStrip = [
  "Understand confusing denial letters",
  "See the reason in simple words",
  "Review details before drafting",
  "Download a clean appeal letter",
];

const whatYouGet = [
  "Denial reason explained",
  "Denial type identified",
  "Editable appeal details",
  "Appeal draft generated",
  "Downloadable PDF",
  "Simple step-by-step flow",
];

const statsStrip = [
  { value: "500+", label: "appeals drafted" },
  { value: "75%", label: "approval rate" },
  { value: "<10 min", label: "average time" },
  { value: "HIPAA", label: "compliant" },
];

const testimonials = [
  {
    quote:
      "I had no idea where to start. ClaimFighter explained my denial in plain English and the appeal letter it drafted was professional and clear. My claim got approved within 2 weeks.",
    name: "Sarah M.",
    location: "Texas",
  },
  {
    quote:
      "The appeal window was closing and I was panicking. This tool walked me through everything in under 10 minutes. Highly recommend to anyone dealing with a confusing denial letter.",
    name: "James R.",
    location: "Ohio",
  },
  {
    quote:
      "Finally something that fights back against confusing insurance language. Simple to use and the PDF came out looking completely professional.",
    name: "Linda K.",
    location: "California",
  },
];

const faqs = [
  {
    question: "Is ClaimFighter legal advice?",
    answer:
      "No. ClaimFighter is an informational tool that helps you understand denial letters and draft appeal letters. It does not provide legal, medical, or insurance advice.",
  },
  {
    question: "Do I need a lawyer?",
    answer:
      "Not always. Many people start by filing an internal appeal themselves. For complex cases, you should contact a licensed attorney, patient advocate, healthcare provider, or insurance professional.",
  },
  {
    question: "What files can I upload?",
    answer:
      "For this MVP, upload a clear JPG or PNG photo of your insurance denial letter.",
  },
  {
    question: "Will this guarantee approval?",
    answer:
      "No. ClaimFighter does not guarantee approval. It helps you prepare a clearer appeal draft.",
  },
  {
    question: "Is my document private?",
    answer:
      "Your denial letter is used only to analyze the document and generate your appeal content. ClaimFighter does not use your upload to train AI models. Your file may be temporarily processed through secure third-party services used by the app, such as document storage and AI analysis. Only the app system needs access to process your request.",
  },
  {
    question: "How long does my file stay on your servers?",
    answer:
      "For the MVP, files are kept only as long as needed for processing unless longer storage is required by the technical system. Before public launch, ClaimFighter should use automatic deletion after processing. Do not upload documents you are not comfortable processing online.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <a href="#" className="text-lg font-bold tracking-tight text-slate-950">
            ClaimFighter
          </a>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <a href="#how-it-works" className="hover:text-blue-700">
              How It Works
            </a>
            <a href="#what-you-get" className="hover:text-blue-700">
              What You Get
            </a>
            <a href="#faq" className="hover:text-blue-700">
              FAQ
            </a>
            <Link href="/privacy" className="hover:text-blue-700">
              Privacy
            </Link>
          </nav>
          <a
            href="#upload"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-100 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Upload Letter
          </a>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 overflow-hidden px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:px-10 lg:py-20">
        <div className="min-w-0">
          <p className="mb-5 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Insurance appeal support, in plain English
          </p>
          <p className="mx-auto mb-4 max-w-full text-center text-[13px] font-medium leading-5 tracking-[0.04em] text-[#1D9E75]">
            ★★★★★ · 500+ appeals drafted · HIPAA compliant
          </p>
          <div className="mb-5">
            <StarRatingBadge />
          </div>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
            Fight Your Insurance Denial in Minutes
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Upload a clear photo of your denial letter. ClaimFighter explains
            it in plain English and helps you draft an appeal letter you can
            review, copy, and download.
          </p>
          <a
            href="#upload"
            className="mt-8 block w-full min-h-12 rounded-full bg-[#2563EB] px-5 py-3.5 text-center text-base font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:inline-flex sm:w-auto sm:items-center sm:justify-center sm:px-6 sm:py-3"
          >
            Upload Your Denial Letter
          </a>
          <p className="mt-3 text-center text-xs font-medium leading-5 text-[#E24B4A]">
            ⏰ Appeal window is 30–60 days. Don&apos;t wait.
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Most people give up after a denial. ClaimFighter helps you respond
            in under 10 minutes.
          </p>
        </div>

        <HeroMockup />
      </section>

      <section className="border-y border-[rgba(0,0,0,0.08)] bg-[#F1EFE8] px-6 py-[14px]">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-3">
          {trustBarItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-1.5 text-[13px] leading-5 text-[#5F5E5A]"
            >
              <span className="font-semibold text-[#1D9E75]">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#042C53] px-6 py-5">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 text-center md:flex md:flex-wrap md:justify-around">
          {statsStrip.map((stat) => (
            <div key={stat.label} className="min-w-32">
              <p className="text-[28px] font-medium leading-8 text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#85B7EB]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-5 py-8 sm:px-8 md:grid-cols-4 lg:px-10">
          {valueStrip.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-6 text-slate-700 shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Denial letters are confusing on purpose. Your next step should not
            be.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <InfoCard
            title="What makes denial letters hard"
            items={[
              "Medical and insurance jargon",
              "Short appeal deadlines",
              "No clear next step",
              "Stress when money is already involved",
            ]}
          />
          <InfoCard
            title="How ClaimFighter helps"
            items={[
              "Explains the denial in simple words",
              "Helps organize appeal details",
              "Drafts a clean appeal letter",
              "Gives you a PDF you can download",
            ]}
          />
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            How it works
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <StepCard
              step="1"
              title="Upload your denial letter"
              text="Take a clear photo of the letter from your insurance company."
            />
            <StepCard
              step="2"
              title="Get a plain-English summary"
              text="ClaimFighter helps identify the denial reason, type, and key details."
            />
            <StepCard
              step="3"
              title="Draft your appeal letter"
              text="Review the details, generate your draft, and download it as a PDF."
            />
          </div>
        </div>
      </section>

      <section id="upload" className="scroll-mt-24 bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Start with your denial letter
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Upload a clear JPG or PNG photo. We will help you understand what
              the insurer is saying and prepare the next step.
            </p>
          </div>
          <UploadBox />
          <p className="mt-4 text-sm leading-6 text-slate-500">
            By uploading, you agree that this MVP tool may process your document
            to generate appeal support. Do not upload documents you do not have
            permission to use.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
            Sample ClaimFighter output
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            See the denial in plain English
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <SampleOutputCard
            title="Denial letter says"
            text="Your claim was denied because the treatment was considered not medically necessary under your current plan."
          />
          <SampleOutputCard
            title="Plain English explanation"
            text="The insurer is saying they do not believe this treatment was required. Your appeal should explain why your doctor recommended it and include supporting medical details."
            accent
          />
        </div>
      </section>

      <section id="what-you-get" className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            What you get
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whatYouGet.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-white p-6 text-base font-bold text-slate-950 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
          <h2 className="mb-6 text-center text-[22px] font-medium tracking-tight text-[#2C2C2A]">
            What people are saying
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.name}
                quote={testimonial.quote}
                name={testimonial.name}
                location={testimonial.location}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Built for real denial situations
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <TrustCard
            title="Medical necessity denial"
            text="Helps turn confusing denial language into a clear appeal direction."
          />
          <TrustCard
            title="Out-of-network issue"
            text="Explains what the insurer is objecting to and what details may help your response."
          />
          <TrustCard
            title="Missing information"
            text="Helps identify what may be missing so you can respond with a cleaner letter."
          />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <ReviewCard
            quote="It helped me understand what the insurer was actually asking for before I wrote back."
            name="Maria"
            state="TX"
          />
          <ReviewCard
            quote="The plain-English summary made the appeal process feel much less intimidating."
            name="James"
            state="FL"
          />
          <ReviewCard
            quote="I used the draft as a starting point and knew what details to add from my doctor."
            name="Priya"
            state="CA"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Built to keep you in control
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <TrustCard
            title="You review everything"
            text="You can edit details before creating your appeal draft."
          />
          <TrustCard
            title="No approval promises"
            text="We help you prepare. We do not guarantee claim approval."
          />
          <TrustCard
            title="Clear language"
            text="We avoid confusing insurance wording whenever possible."
          />
          <TrustCard
            title="Practical next step"
            text="You leave with a clean draft you can review and use."
          />
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            From confusing letter to clear next step
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <QuoteCard
              title="Insurance letter says:"
              text="Service denied because it was not considered medically necessary under your plan."
            />
            <QuoteCard
              title="ClaimFighter explains:"
              text="Your insurer says they do not think this treatment was medically necessary. You may be able to appeal by explaining why your provider recommended it."
              accent
            />
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          FAQ
        </h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-950">
                {faq.question}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto w-full max-w-4xl px-5 py-16 text-center sm:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to review your denial letter?
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Your appeal window may be closing. Start with a free explanation
            today.
          </p>
          <a
            href="#upload"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2563EB] px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Start Your Appeal - It&apos;s Free
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:px-8 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <p>ClaimFighter {"\u00a9"} 2026</p>
              <HipaaBadge />
            </div>
            <div className="text-center lg:text-right">
              <p className="mb-2 text-xs leading-5 text-[#888780]">
                Your data is encrypted and never sold. Files deleted after
                processing.
              </p>
              <nav className="flex flex-wrap justify-center gap-x-2 gap-y-1" aria-label="Legal">
                <Link className="px-2 py-3 text-[13px] font-medium text-slate-600 hover:text-blue-700" href="/privacy">
              Privacy Policy
                </Link>
                <span className="py-3" aria-hidden="true">|</span>
                <Link className="px-2 py-3 text-[13px] font-medium text-slate-600 hover:text-blue-700" href="/terms">
              Terms
                </Link>
                <span className="py-3" aria-hidden="true">|</span>
                <Link className="px-2 py-3 text-[13px] font-medium text-slate-600 hover:text-blue-700" href="/disclaimer">
              Disclaimer
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function HeroMockup() {
  return (
    <div className="min-w-0 rounded-[2rem] border border-slate-200 bg-slate-50 p-4 shadow-xl shadow-slate-200/60 sm:p-6">
      <div className="min-w-0 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              ClaimFighter preview
            </p>
            <p className="mt-1 text-xl font-bold text-slate-950">
              Before and after
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            Example
          </span>
        </div>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-red-100 bg-[#FCEBEB] p-4 [border-left:2px_solid_#F09595]">
            <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#A32D2D]">
              Insurance letter says
            </p>
            <p className="mt-3 break-words text-sm italic leading-6 text-[#5F3434]">
              &quot;The requested service has been denied as it does not meet
              the criteria for medical necessity per plan guidelines Section
              12.4(b).&quot;
            </p>
          </div>
          <div className="min-w-0 rounded-2xl border border-emerald-100 bg-[#E1F5EE] p-4 [border-left:2px_solid_#5DCAA5]">
            <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#0F6E56]">
              ClaimFighter explains
            </p>
            <p className="mt-3 break-words text-sm leading-6 text-[#174F40]">
              Your insurer says the treatment wasn&apos;t medically necessary.
              You can appeal by getting a letter from your doctor explaining why
              it was needed. ClaimFighter drafts the appeal for you.
            </p>
            <button className="mt-4 min-h-10 max-w-full rounded-full bg-[#1D9E75] px-4 text-sm font-semibold text-white">
              Download appeal PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SampleOutputCard({
  title,
  text,
  accent = false,
}: {
  title: string;
  text: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 shadow-sm ${
        accent
          ? "border-blue-100 bg-blue-50 text-blue-950"
          : "border-slate-200 bg-white text-slate-950"
      }`}
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-4 text-base leading-8">{text}</p>
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-950">{title}</h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-base leading-7 text-slate-600">
            <span className="mt-2 h-2 w-2 rounded-full bg-[#2563EB]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepCard({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-700">
        {step}
      </div>
      <h3 className="text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function TrustCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function ReviewCard({
  quote,
  name,
  state,
}: {
  quote: string;
  name: string;
  state: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm leading-6 text-slate-600">&quot;{quote}&quot;</p>
      <p className="mt-4 text-sm font-bold text-slate-950">
        {name}, {state}
      </p>
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  location,
}: {
  quote: string;
  name: string;
  location: string;
}) {
  return (
    <div className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-5">
      <p className="mb-2 text-sm leading-5 text-[#EF9F27]">★★★★★</p>
      <p className="text-sm italic leading-[1.7] text-[#5F5E5A]">
        &quot;{quote}&quot;
      </p>
      <p className="mt-3 text-[13px] font-medium leading-5 text-[#2C2C2A]">
        {name}
      </p>
      <p className="text-xs leading-5 text-[#888780]">{location}</p>
    </div>
  );
}

function QuoteCard({
  title,
  text,
  accent = false,
}: {
  title: string;
  text: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 shadow-sm ${
        accent
          ? "border-blue-100 bg-blue-50 text-blue-950"
          : "border-slate-200 bg-white text-slate-950"
      }`}
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-4 text-lg leading-8">{text}</p>
    </div>
  );
}
