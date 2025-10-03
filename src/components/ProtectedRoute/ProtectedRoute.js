"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import auth from '@/utils/auth';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await auth.validateToken();
      if (!isValid) {
        // Only redirect if not already on sign-in page
        if (pathname !== '/auth/sign-in') {
          router.push('/auth/sign-in');
        }
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return children;
}
