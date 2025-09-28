"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import auth from "@/utils/auth"
import { createDebugger } from "@/utils/debug"

const debug = createDebugger('frontend:pages:home')

/**
 * Home page component that handles authentication validation and routing
 * Redirects authenticated users to computers page, others to sign-in
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      debug.info('auth', 'Validating token on home page')
      const isValid = await auth.validateToken();
      if (isValid) {
        debug.info('routing', 'Redirecting authenticated user to computers')
        router.push('/computers');
      } else {
        debug.warn('auth', 'Token validation failed, redirecting to sign-in')
        router.push('/auth/sign-in');
      }
    };

    checkAuth();
  }, [router]);

  return null; // or a loading spinner
}