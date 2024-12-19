'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createTransaction, fetchCategories } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import { getToken } from '@/lib/tokens';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowBigLeft } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

export default function NewPage() {
    const [amount, setAmount] = useState<number>(0);
    const [type, setType] = useState<'income' | 'expense'>('income');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]); 
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const userId = useAuth();

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await fetchCategories();
                setCategories(data); 
            } catch {
                setError('Failed to load categories');
            }
        }

        loadCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = getToken();
        if (!token) {
            setError('Not authenticated');
            return;
        }

        try {
            await createTransaction(
                { type, amount, categoryId: categoryId !== null ? categoryId : undefined, userId },
                token
            );
            router.push('/transactions');
        } catch (error) {
            setError('Failed to create transaction');
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Create Transaction</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="Enter amount"
                        className='w-[350px]'
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="type">Transaction Type</Label>
                    <div>
                        <Select
                            value={type}
                            onValueChange={(value) => setType(value as 'income' | 'expense')}
                        >
                            <SelectTrigger
                                id="type"
                                className="w-[350px] flex justify-between items-center px-4 py-2 border rounded-md"
                            >
                                <span className="text-gray-500">
                                    {type || "Select an option"}
                                </span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                        value={categoryId !== null ? categoryId.toString() : ''} // Convert number to string
                        onValueChange={(value) => setCategoryId(Number(value))} // Convert string back to number
                    >
                        <SelectTrigger
                            id="category"
                            className="w-[350px] flex justify-between items-center px-4 py-2 border rounded-md"
                        >
                            <span className="text-gray-500">
                                {categoryId
                                    ? categories.find((c) => c.id === categoryId)?.name
                                    : 'Select a category'}
                            </span>
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-between mt-11">
                    <Link href="/transactions" className="text-blue-400">
                        <Button className="bg-blue-400 text-white">
                            <ArrowBigLeft size={16} className="mr-2" />
                            Back 
                        </Button>
                    </Link>

                    <Button type="submit" className="bg-blue-400 text-white">
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
}
