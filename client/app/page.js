// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function Home() {
//   const router = useRouter();
//   const [isHydrated, setIsHydrated] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       router.push('/dashboard');
//     } else {
//       router.push('/auth/login');
//     }
//     setIsHydrated(true);
//   }, [router]);

//   // Show loading state during hydration
//   if (!isHydrated) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold mb-4">Vendor SaaS</h1>
//           <p className="text-gray-600">Redirecting...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold mb-4">Vendor SaaS</h1>
//         <p className="text-gray-600">Redirecting...</p>
//       </div>
//     </div>
//   );
// }

// export default function Home() {
//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold mb-4">Vendor SaaS</h1>
//         <p className="text-gray-600">Redirecting...</p>
//       </div>
//     </div>
//   );
// }


'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 🔥 Check login using backend (cookie will be sent automatically)
        await authAPI.getProfile();
        router.push('/dashboard');
      } catch (error) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Loading UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Vendor SaaS</h1>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return null;
}