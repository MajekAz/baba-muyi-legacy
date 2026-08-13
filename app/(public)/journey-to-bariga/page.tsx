import { permanentRedirect } from "next/navigation";
import { biographyChapterTargets } from "@/lib/public-route-targets";

export default function JourneyToBarigaPage() {
  permanentRedirect(biographyChapterTargets.journeyToBariga);
}
