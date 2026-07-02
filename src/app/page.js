"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { LoadingOverlay } from "@infinibay/harbor"
import auth from "@/utils/auth"
import { createDebugger } from "@/utils/debug"
import { selectUser, fetchCurrentUser } from "@/state/slices/auth"
import { landingRouteForRole } from "@/lib/roles"

const debug = createDebugger('frontend:pages:home')

/**
 * Home page — validates the token and redirects by role:
 *  - Operator (ADMIN / SUPER_ADMIN)   → /overview
 *  - End-user (USER)                   → /workspace
 *  - Anyone else / invalid token       → /auth/sign-in
 *
 * While the check runs we show a LoadingOverlay (never a blank screen). When
 * the token is valid but the persisted user hasn't rehydrated yet, we fetch
 * the current user BEFORE deciding the target so a valid session is never
 * bounced to sign-in. All redirects use router.replace so the transient
 * landing page never lands in history (Back would otherwise re-trigger it).
 */
export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      debug.info('auth', 'Validating token on home page')
      const isValid = await auth.validateToken();
      if (cancelled) return;
      if (!isValid) {
        debug.warn('auth', 'Token validation failed, redirecting to sign-in')
        router.replace('/auth/sign-in');
        return;
      }

      // Token is valid. Resolve the user's role before routing: the persisted
      // redux user may be missing/not-yet-rehydrated, in which case its role is
      // null and landingRouteForRole() would wrongly send a valid session to
      // sign-in. Fetch the current user first when we don't have a role yet.
      let resolvedUser = user;
      if (!resolvedUser?.role) {
        try {
          resolvedUser = await dispatch(fetchCurrentUser()).unwrap();
        } catch (error) {
          debug.error('routing', 'Failed to fetch current user after valid token', error);
        }
        if (cancelled) return;
      }

      const target = landingRouteForRole(resolvedUser);
      debug.info('routing', 'Redirecting by role', { role: resolvedUser?.role, target });
      router.replace(target);
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [router, dispatch, user]);

  return <LoadingOverlay label="Signing you in…" />;
}
