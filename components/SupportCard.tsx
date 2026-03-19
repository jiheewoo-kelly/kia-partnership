import Link from "next/link";

interface SupportCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

export default function SupportCard({
  title,
  description,
  href,
  icon,
  external,
}: SupportCardProps) {
  const className =
    "group bg-cream/60 border border-gray-100 rounded-2xl p-8 hover:border-blue/20 hover:shadow-sm transition-all block";

  const content = (
    <>
      <div className="w-12 h-12 bg-blue/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue/15 transition-colors">
        {icon}
      </div>
      <h3 className="text-base font-bold text-main mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      <div className="mt-5 text-sm font-semibold text-blue flex items-center gap-1">
        신청하기
        <svg
          className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
