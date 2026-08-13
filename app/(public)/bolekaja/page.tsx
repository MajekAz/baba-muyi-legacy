import { permanentRedirect } from "next/navigation";
import { biographyChapterTargets } from "@/lib/public-route-targets";

export default function BolekajaPage() {
  permanentRedirect(biographyChapterTargets.transportLegacy);
}
