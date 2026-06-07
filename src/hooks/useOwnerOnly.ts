import { useApp } from "@/lib/appContext";

/** Returns true if the current user is a BUSINESS_OWNER */
export function useIsOwner() {
  const { role } = useApp();
  return role === "BUSINESS_OWNER";
}
