import clsx from "clsx";
import Link from "next/link";

export function DottedPaperBackdrop({ isDark }: { isDark: boolean }) {
  const dotColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  const cornerBorderClass = isDark ? "border-white/20" : "border-black/10";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
        backgroundSize: "18px 18px",
        backgroundPosition: "-9px -9px",
      }}
    >
      <div
        className={clsx(
          "absolute right-2 top-2 h-10 w-10 rounded-tl-[22px] border-l-2 border-t-2",
          cornerBorderClass,
        )}
      />
    </div>
  );
}

export function InnerGrid({ isDark }: { isDark: boolean }) {
  const baseFillStyle = {
    backgroundImage: isDark
      ? "radial-gradient(circle at top, rgba(60,60,60,0.5), rgba(10,10,10,0.85))"
      : "radial-gradient(circle at top, rgba(255,255,255,0.95), rgba(215,215,215,0.85))",
  };

  const gridStyle = {
    backgroundImage: isDark
      ? "repeating-linear-gradient(0deg, transparent 0 29px, rgba(255,255,255,0.08) 29px 30px), repeating-linear-gradient(90deg, transparent 0 29px, rgba(255,255,255,0.08) 29px 30px)"
      : "repeating-linear-gradient(0deg, transparent 0 29px, rgba(96,96,96,0.22) 29px 30px), repeating-linear-gradient(90deg, transparent 0 29px, rgba(96,96,96,0.22) 29px 30px)",
  };

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={baseFillStyle} />
      <div className="absolute inset-0 opacity-30" style={gridStyle} />
    </div>
  );
}

export function NavItem({
  label,
  href,
  isDark,
}: {
  label: string;
  href: string;
  isDark: boolean;
}) {
  const itemClass = clsx(
    "w-full rounded-sm px-1 py-1.5 transition cursor-pointer",
    isDark ? "hover:bg-white/10" : "hover:bg-black/5",
  );

  return (
    <Link href={href}>
      <div className={itemClass}>{label}</div>
    </Link>
  );
}
