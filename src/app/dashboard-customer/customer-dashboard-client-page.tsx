'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';

export default function CustomerDashboardClientPage({ customer }: { customer: User }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login-customer');
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            My Profile
          </CardTitle>
          <CardDescription>Your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm">
            <p className="font-medium text-muted-foreground">Name</p>
            <p>{customer.name}</p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-muted-foreground">Email</p>
            <p>{customer.email}</p>
          </div>
          <Button variant="outline" className="w-full">Edit Profile</Button>
          <Button variant="destructive" className="w-full" onClick={handleLogout}>Log Out</Button>
        </CardContent>
      </Card>
    </div>
  );
}
