import Link from "next/link";

type LegalPageProps = {
  title: string;
  intro: string;
  children: React.ReactNode;
};

export default function LegalPage({ title, intro, children }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 lg:py-16">
        <nav className="flex items-center justify-between" aria-label="Main">
          <Link href="/" className="text-lg font-bold tracking-tight text-slate-950">
            ClaimFighter
          </Link>
          <Link
            href="/#upload"
            className="rounded-full border border-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
          >
            Upload
          </Link>
        </nav>

        <div className="mt-14">
          <p className="mb-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            ClaimFighter policy
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{intro}</p>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-6 text-base leading-8 text-slate-700">
            {children}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p>ClaimFighter © 2026</p>
          <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Legal">
            <Link className="font-medium text-slate-600 hover:text-blue-700" href="/privacy">
              Privacy Policy
            </Link>
            <span aria-hidden="true">|</span>
            <Link className="font-medium text-slate-600 hover:text-blue-700" href="/terms">
              Terms
            </Link>
            <span aria-hidden="true">|</span>
            <Link className="font-medium text-slate-600 hover:text-blue-700" href="/disclaimer">
              Disclaimer
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
