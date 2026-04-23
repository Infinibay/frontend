"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import auth from "@/utils/auth"
import { createDebugger } from "@/utils/debug"
import { selectUser } from "@/state/slices/auth"
import { landingRouteForRole } from "@/lib/roles"

const debug = createDebugger('frontend:pages:home')

/**
 * Home page — validates the token and redirects by role:
 *  - Operator (ADMIN / SUPER_ADMIN)   → /overview
 *  - End-user (USER)                   → /workspace
 *  - Anyone else / invalid token       → /auth/sign-in
 */
export default function Home() {
  const router = useRouter();
  const user = useSelector(selectUser);

  useEffect(() => {
    const checkAuth = async () => {
      debug.info('auth', 'Validating token on home page')
      const isValid = await auth.validateToken();
      if (!isValid) {
        debug.warn('auth', 'Token validation failed, redirecting to sign-in')
        router.push('/auth/sign-in');
        return;
      }
      const target = landingRouteForRole(user);
      debug.info('routing', 'Redirecting by role', { role: user?.role, target });
      router.push(target);
    };

    checkAuth();
  }, [router, user]);

  return null;
}
