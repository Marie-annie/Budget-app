'use client';

import { useEffect, useState } from 'react';
import { fetchTransactions } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/tokens';

interface Transaction {
  id:        number;
  type:      string;
  amount:    number;
  createdAt: Date;
  user:      User;
  category:  Category;
}
 
interface Category {
  id:        number;
  name:      string;
  createdAt: Date;
}

interface User {
  id:           number;
  username:     string;
  email:        string;
  passwordHash: string;
  role:         string;
  createdAt:    Date;
}

export default function TransactionsPage() {
  useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Not authenticated');
        }

        const data = await fetchTransactions(token);
        setTransactions(data || []);
      } catch (error: any) {
        setError('Failed to load transactions');

        if (error.message === 'Not authenticated') {
          router.push('/login');
        }
      }
    }

    loadTransactions();
  }, [router]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (transactions.length === 0) {
    return <div>No transactions found</div>;
  }

  return (
    <div className=''>
      <Navbar/>
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Transactions</h1>
        <div className="flex justify-end mx-2 mb-4">
          <Link href="/transactions/new" className="flex items-center">
            <Button className="text-white bg-blue-400">
              <PlusCircle size={16} className="mr-2" />
              Create Transaction
            </Button>
          </Link>
        </div>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">S/N</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction.id} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{transaction.type}</td>
                <td className="border p-2">{transaction.amount.toFixed(2)}</td>
                <td className="border p-2">{transaction.category?.name}</td>
                <td className="border p-2">{new Date(transaction.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}