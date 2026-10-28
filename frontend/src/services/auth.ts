import { isMockApiEnabled } from "@/lib/env";
import { mockLogin } from "@/lib/mock/services";
import type { SessionUser } from "@/types";

/**
 * Authentication follows the backend contract only.
 * docs/api-contracts.md is not published, so live login is not implemented
 * and no token format is invented. Mock login is UI-only.
 */
export async function login(email: string, password: string): Promise<SessionUser> {
  if (isMockApiEnabled()) {
    return mockLogin(email, password);
  }
  throw new Error(
    "Live authentication is not wired. Publish docs/api-contracts.md with the login request, response, and token behaviour before connecting this form.",
  );
}
