"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import auth from '@/utils/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await auth.validateToken();
      if (isValid) {
        router.push('/dashboard');
      } else {
        router.push('/auth/sign-in');
      }
    };

    checkAuth();
  }, [router]);

  return null; // or a loading spinner
}