import { PublicHeaderClient } from "@/components/public-header-client";
import { getCmsMenus } from "@/lib/cms-store";

export async function PublicNavigation() {
  const publicNavigation = await getCmsMenus("header");
  const mobileNavigation = await getCmsMenus("mobile");

  return <PublicHeaderClient items={publicNavigation} mobileItems={mobileNavigation.length ? mobileNavigation : publicNavigation} />;
}
