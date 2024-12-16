'use client';

import { useState } from 'react';
import { loginUser } from '@/lib/api';
import { setToken } from '@/lib/tokens';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const { access_token } = await loginUser(form);
      setToken(access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-11">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
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
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        className="w-full mb-4 px-4 py-2 border rounded"
      />
      <Button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Login</Button>
    </form>
  );
}
