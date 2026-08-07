import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: "w-7 h-7", text: "text-lg" },
  md: { icon: "w-9 h-9", text: "text-xl" },
  lg: { icon: "w-12 h-12", text: "text-2xl" },
};

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const s = sizeMap[size];

  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div
        className={`${s.icon} rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[60%] h-[60%]"
        >
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4v18" />
          <path d="M19 21V11l-6-4" />
          <path d="M9 9v.01" />
          <path d="M9 12v.01" />
          <path d="M9 15v.01" />
          <path d="M9 18v.01" />
        </svg>
      </div>
      {showText && (
        <span className={`${s.text} font-bold tracking-tight`}>
          <span className="text-emerald-600">Citi</span>
          <span className="text-teal-700">Care</span>
        </span>
      )}
    </Link>
  );
}
