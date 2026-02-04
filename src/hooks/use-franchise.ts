import { useSelector } from "@legendapp/state/react";
import { sessionState } from "@/lib/config/session.config";

export function useFranchiseId(): string | null {
  const franchiseId = useSelector(() => sessionState.franchise_id.get());
  return franchiseId || null;
}
