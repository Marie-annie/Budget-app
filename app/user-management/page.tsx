'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Download, Trash2Icon } from 'lucide-react';
import { fetchUsers } from '@/lib/api';
import { useEffect, useState } from 'react';

interface User {
  id:           number;
  username:     string;
  email:        string;
  passwordHash: string;
  role:         string;
  createdAt:    Date;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await fetchUsers();
                console.log(data);
                setUsers(data);
            } catch {
                setError('Failed to load users');
            }
        }

        loadUsers();
    }, []);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (users.length === 0) {
        return <div>No users found</div>;
    }

  return (
    <div className=''>
        <Navbar />
      <div className='max-w-5xl mx-auto p-8'>
        <h1 className='text-2xl font-bold mb-4'>Users</h1>
        <div className='flex justify-end mb-4'>
            <Button>
              <Download className='w-6 h-6 mr-2' />
              Export
            </Button>
          </div>

          <table className='w-full border-collapse border'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='text-left p-2'>S/N</th>
                <th className='text-left p-2'>Username</th>
                <th className='text-left p-2'>Email</th>
                <th className='text-left p-2'>Role</th>
                <th className='text-left p-2'>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className='border-b'>
                  <td className='p-2'>{index + 1}</td>
                  <td className='p-2'>{user.username}</td>
                  <td className='p-2'>{user.email}</td>
                  <td className='p-2'>{user.role}</td>
                  <td className='p-2'>
                      <Button className='text-white bg-blue-400'>
                        <Trash2Icon className='w-6 h-6 mr-2' />
                        Delete
                      </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
      </div>
    </div>
  );
}