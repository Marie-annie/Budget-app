'use client';

import { useEffect, useState } from 'react';
import { fetchTransactions, fetchCategories } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  categoryId: number | null;
  categoryName: string | null;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await fetchTransactions();
        console.log(data);
        setTransactions(data);
      } catch (err) {
        setError('Failed to load transactions');
      }
    }

    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
      }
    }

    loadTransactions();
    loadCategories();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (transactions.length === 0) {
    return <div>No transactions found</div>;
  }

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return 'N/A';
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : 'N/A';
  };

  return (
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

      {error && <div className="text-red-500">{error}</div>}

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
              <td className="border p-2">${transaction.amount.toFixed(2)}</td>
              <td className="border p-2">{getCategoryName(transaction.categoryId)}</td>
              <td className="border p-2">{new Date(transaction.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
