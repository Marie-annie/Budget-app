'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import UserImage from "@/public/Rectangle 11.png";
import { CircleUserRound } from 'lucide-react';
import { fetchUserById, updateUser } from '@/lib/api';

export default function Profile () {
    const userId = useAuth();  
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUserData = async () => {
            if (userId) {
                try {
                    const data = await fetchUserById(userId);
                    setUsername(data.username);
                    setEmail(data.email);
                } catch {
                    setError("Failed to load user data");
                }
            }
        };

        loadUserData();
    }, [userId]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const handleProfileClick = () => {
        setIsProfileDialogOpen(true);
    }
  
    const handleCloseProfileDialog = () => {
      setIsProfileDialogOpen(false);
    }

    const handleSaveProfile = async () => {
        try {
            await updateUser(userId, { username, email });
            handleCloseProfileDialog();
        } catch {
            setError("Failed to save profile");
        }
    };
    
    return (
        <div className='profile'> 
            <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                <DialogTrigger asChild>
                    <CircleUserRound className="w-6 h-6 hover:cursor-pointer" onClick={handleProfileClick}/>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                            <Image
                                src={UserImage}
                                alt="User Profile"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Username
                            </Label>
                            <Input 
                            id="username" 
                            value={username} 
                            className="col-span-3" 
                            onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input 
                            id="email" 
                            value={email} 
                            className="col-span-3" 
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveProfile}>Save changes</Button>
                        <Button onClick={handleCloseProfileDialog}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
