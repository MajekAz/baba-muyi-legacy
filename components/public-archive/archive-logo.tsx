import Image from "next/image";
import { flagshipArchiveBrand } from "@/lib/brand";

type ArchiveLogoProps = {
  className?: string;
  compact?: boolean;
  inverse?: boolean;
};

export function ArchiveLogo({ className = "", compact = false, inverse = true }: ArchiveLogoProps) {
  return (
    <span
      aria-label={flagshipArchiveBrand.assets.alt}
      className={`inline-flex min-w-0 items-center gap-3 ${className}`}
      role="img"
    >
      <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-archive-gold/45 bg-archive-navy/80 sm:size-14">
        <Image
          alt=""
          className="h-full w-full object-cover object-top"
          height={512}
          priority
          src={flagshipArchiveBrand.assets.mark}
          width={398}
        />
      </span>
      <span aria-hidden="true" className="grid min-w-0 gap-0.5">
        <span
          className={`truncate font-serif text-[1.22rem] font-semibold leading-none tracking-wide sm:text-[1.48rem] ${
            inverse ? "text-archive-gold" : "text-archive-navy"
          }`}
        >
          {flagshipArchiveBrand.name}
        </span>
        {!compact ? (
          <span className={`truncate text-[0.58rem] font-black uppercase tracking-[0.14em] sm:text-[0.68rem] ${inverse ? "text-white/70" : "text-slate-600"}`}>
            {flagshipArchiveBrand.descriptor}
          </span>
        ) : null}
      </span>
    </span>
  );
}
