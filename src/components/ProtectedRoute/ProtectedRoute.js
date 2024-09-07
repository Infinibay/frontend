"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import auth from '@/utils/auth';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await auth.validateToken();
      if (!isValid) {
        router.push('/auth/sign-in');
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return children;
}
