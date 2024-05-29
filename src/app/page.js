'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Chuyển hướng sang trang /home sau khi component được render
    router.push('/home');
  }, [router]);

  return <div>Redirecting...</div>;
}