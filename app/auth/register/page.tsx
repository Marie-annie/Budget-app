'use client';

import { useState } from 'react';
import { registerUser } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', passwordHash: '', role: 'user | admin' });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await registerUser(form);
      router.push('/auth/login');
    } catch{
      setError('Failed to register');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-11">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
        className="w-full mb-4 px-4 py-2 border rounded"
      />
      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        className="w-full mb-4 px-4 py-2 border rounded"
      />  

      <Input
        type="password"
        placeholder="Password"
        value={form.passwordHash}
        onChange={(e) => setForm({ ...form, passwordHash: e.target.value })}
        required
        className="w-full mb-4 px-4 py-2 border rounded"
      />
      <Button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Register</Button>
    </form>
  );
}
