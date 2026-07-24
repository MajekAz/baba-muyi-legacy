import { PlatformShell } from "@/components/legacyhub/platform-shell";

export default function PlatformLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <PlatformShell>{children}</PlatformShell>;
}
