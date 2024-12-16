import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: number;
  // Add other fields as needed
}

export function useAuth() {
  const [userId, setUserId] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      router.push('/auth/login'); // Redirect to login if not authenticated
    } else {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error('Invalid token:', error);
        router.push('/auth/login'); // Redirect to login if token is invalid
      }
    }
  }, [router]);

  return userId;
}