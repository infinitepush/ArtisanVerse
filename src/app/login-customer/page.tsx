'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginCustomerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/login-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({ variant: "destructive", title: "Login Failed", description: result.message || "Invalid credentials." });
      } else {
        toast({ title: "Login Successful", description: "Redirecting to your dashboard..." });
        router.push('/dashboard-customer');
        router.refresh(); 
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Login Failed", description: "A network error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-sm px-4 py-12 md:px-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline">Customer Log In</CardTitle>
          <CardDescription className="text-lg">Access your account and start shopping.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="customer@example.com" required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required disabled={isLoading} />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log In
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Not a customer yet?{' '}
            <Link href="/signup-customer" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
