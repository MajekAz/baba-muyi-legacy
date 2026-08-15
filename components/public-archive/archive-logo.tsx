import Image from "next/image";
import { flagshipArchiveBrand } from "@/lib/brand";

type ArchiveLogoProps = {
  className?: string;
  compact?: boolean;
};

export function ArchiveLogo({ className = "", compact = false }: ArchiveLogoProps) {
  return (
    <span
      className={`inline-flex min-w-0 items-center gap-3 sm:gap-4 ${className}`}
    >
      <span className="relative block size-14 shrink-0 sm:size-16 xl:size-[4.75rem]">
        <Image
          alt="Tioluwalase Majekodunmi crest"
          className="object-contain object-left"
          fill
          priority
          sizes="(min-width: 1280px) 76px, (min-width: 640px) 64px, 56px"
          src={flagshipArchiveBrand.assets.mark}
        />
      </span>
      <span className={`min-w-0 ${compact ? "max-[360px]:sr-only" : ""}`}>
        <span className="block whitespace-normal font-serif text-lg font-semibold leading-[1.02] tracking-normal text-archive-gold sm:text-2xl xl:text-[1.75rem]">
          {flagshipArchiveBrand.name}
        </span>
        {!compact ? (
          <span className="mt-1 hidden text-[0.66rem] font-black uppercase leading-none tracking-[0.18em] text-white/72 xl:block xl:text-xs">
            {flagshipArchiveBrand.descriptor}
          </span>
        ) : null}
      </span>
    </span>
  );
}
