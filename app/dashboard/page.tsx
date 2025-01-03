'use client';

import { useEffect, useState } from 'react';
import { fetchDashboardSummary } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import { getToken, getUserId } from '@/lib/tokens';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { BarChartComponent } from '@/components/BarChart';
import { PieChartComponent } from '@/components/PieChart';

export default function DashboardPage() {
  useAuth(); 
  const router = useRouter();
  
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, totalSavings: 0, totalBalance: 0 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        const token = getToken();
        const userId = getUserId(); 

        if (!token) {
          throw new Error('Not authenticated');
        }

        if (userId === null) {
          throw new Error('User ID is null');
        }

        const data = await fetchDashboardSummary(token);
        setSummary(data || { totalIncome: 0, totalExpenses: 0, totalSavings: 0, totalBalance: 0 });

      } catch {
        setError('Failed to load summary');
        
        if (error === 'Not authenticated') {
          router.push('/login');
        }
      } finally {
        setLoading(false); 
      }
    }

    loadSummary();
  }, [router, error]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>; 
  }

  return (
    <div className='bg-gray min-h-screen'>
      <Navbar />
      <h1 className="text-2xl font-bold mb-4 p-4">Dashboard Summary</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
        <Card className="p-4 rounded shadow">
          <p className="font-semibold">Total Income</p>
          <p className="text-green-500">{summary.totalIncome}TZS</p>
        </Card>
        <Card className="p-4 rounded shadow">
          <p className="font-semibold">Total Expenses</p>
          <p className="text-red-500">{summary.totalExpenses}TZS</p>
        </Card>
        <Card className="p-4 rounded shadow">
          <p className="font-semibold">Total Savings</p>
          <p className="text-blue-500">{summary.totalSavings}TZS</p>
        </Card>
        <Card className="p-4 rounded shadow">
          <p className="font-semibold">Total Balance</p>
          <p className="text-yellow-500">{summary.totalBalance}TZS</p>
        </Card>
      </div>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2">
          <BarChartComponent />
        </div>
        <div className="w-full md:w-1/2 px-2">
          <PieChartComponent />
        </div>
      </div>
    </div>
  );
}
