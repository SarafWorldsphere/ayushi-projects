'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if the user has an authentication token
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // If logged in, send them to the working dashboard route
      router.push('/dashboard');
    } else {
      // If not logged in, send them to the login page
      router.push('/login');
    }
  }, [router]);

  // Show a clean loading screen while the app decides where to route the user
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFFDF8]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 relative animate-pulse rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-orange-100 flex items-center justify-center text-3xl">
          🍔
        </div>
        <p className="text-gray-500 font-medium tracking-wide">Loading VIGO Feast...</p>
      </div>
    </div>
  );
}