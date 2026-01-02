'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const logoutUser = async () => {
      await apiClient.logout();
      router.replace('/users');
    };

    logoutUser();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg font-medium">Logging you out...</p>
    </div>
  );
};

export default LogoutPage;
