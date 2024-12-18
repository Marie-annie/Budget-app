'use client';

import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import { getToken, clearToken, getUserRole } from '@/lib/tokens';
import Profile from '@/components/Profile';


export default function Navbar() {
  const router = useRouter();
  const isLoggedIn = !!getToken();
  const userRole = getUserRole();


  function handleLogout() {
    clearToken();
    router.push('/');
  }

  return (
    <nav className="bg-gray-800 text-white py-6">
      <div className="flex justify-between items-center px-4">
        <Link href="/" className="text-lg font-bold">
          Budget App
        </Link>
        <ul className="flex space-x-4">
          {isLoggedIn ? (
            <>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/transactions">Transactions</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              {userRole === 'admin' && (
                <li><Link href="/user-management">User Management</Link></li>
              )}
              <li>
                <Profile />
              </li>
              <li><button onClick={handleLogout} className="text-red-500">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link href="/auth/register">Register</Link></li>
              <li><Link href="/auth/login">Login</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}