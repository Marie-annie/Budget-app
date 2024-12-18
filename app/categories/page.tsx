"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { fetchCategories } from '@/lib/api';
import Link from 'next/link';
import { PlusCircle, TrashIcon } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

export default function CategoriesPage() {
    useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch {
                setError('Unable to load categories. Please try again later.');
            }
        }

        loadCategories();
    }, []);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (categories.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="">
            <Navbar />
            <div className="max-w-5xl mx-auto p-8">
                <h1 className="font-bold text-2xl mb-4">Categories List</h1>
                <div className="flex justify-end p-5 mx-2">
                    <Link href="/categories/add">
                        <Button className="text-white bg-blue-400">
                            <PlusCircle size={16} className="mr-2" />
                            Create Category
                        </Button>
                    </Link>
                </div>
    
                
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">S/N</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <tr key={category.id} className="text-center">
                                    <td className="border p-2">{index + 1}</td>
                                    <td className="border p-2">{category.name}</td>
                                    <td className="border p-2">
                                        <Button className="text-white bg-blue-400">
                                            <TrashIcon size={16} className="mr-2" />
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
