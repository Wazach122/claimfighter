export function ShieldCheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3.25 5.75 5.6v5.2c0 4.25 2.55 8.1 6.25 9.95 3.7-1.85 6.25-5.7 6.25-9.95V5.6L12 3.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m8.9 12 2.05 2.05 4.15-4.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function HipaaBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-[#639922] bg-[#EAF3DE] px-[14px] py-2">
      <ShieldCheckIcon className="h-[18px] w-[18px] shrink-0 text-[#3B6D11]" />
      <div className="text-left leading-none">
        <p className="text-xs font-medium leading-4 text-[#27500A]">
          HIPAA Compliant
        </p>
        <p className="text-[10px] leading-3 text-[#3B6D11]">
          Data encrypted &amp; secure
        </p>
      </div>
    </div>
  );
}
