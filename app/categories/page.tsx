"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { fetchCategories } from '@/lib/api';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { PlusCircle, PlusIcon } from 'lucide-react';

export default function CategoriesPage() {
    useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err: any) {
                console.error('Failed to fetch categories:', err.message);
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
            <div className="p-8">
                <h2 className="font-bold text-left">Categories List</h2>
                <div className="flex justify-end p-5 mx-2">
                    <Link href="/categories/add">
                        <Button className="text-white bg-blue-400">
                            <PlusCircle size={16} className="mr-2" />
                            Create Category
                        </Button>
                    </Link>
                </div>
    
                <div className="bg-white shadow-md rounded p-4">
                    <Table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="text-center">S/N</th>
                                <th className="text-center">Name</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <tr key={category.id} className="border-b">
                                    <td className="text-center">{index + 1}</td>
                                    <td className="text-center">{category.name}</td>
                                    <td className="text-center">
                                        <Link href={`/categories/${category.id}`}>
                                            <Button className="text-white bg-blue-400">View</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
