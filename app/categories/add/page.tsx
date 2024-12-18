"use client";

import React from 'react';
import { useAuth } from '@/lib/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/tokens';
import { createCategory } from '@/lib/api';
import { ArrowBigLeft, PlusCircle } from 'lucide-react';

export default function AddPage() {
    useAuth();
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = getToken();
        if (!token) {
            setError('Not authenticated');
            return;
        }

        try {
            await createCategory({
                name,
                type: ''
            });
            router.push('/categories'); // Redirect to the category list
        } catch (error) {
            setError('Failed to create category');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-8">
            <h1 className='font-bold text-2xl mb-4'>Add Category</h1>

                {error && <div className="text-red-500">{error}</div>}

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className="mb-4">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-[350px]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="type">Category Type</Label>
                        <Select value={type} onValueChange={(value) => setType(value)}>
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
                   
                    <div className="flex justify-between mt-11">
                        <Link href="/categories" className="text-blue-400">
                            <Button className="bg-blue-400 text-white">
                                <ArrowBigLeft size={16} className="mr-2" />
                                Back 
                            </Button>
                        </Link>
    
                        <Button type="submit" className="bg-blue-400 text-white">
                            <PlusCircle size={16} className="mr-2" />
                            Save
                        </Button>
                    </div>
                </form>
        </div>
    );
}
