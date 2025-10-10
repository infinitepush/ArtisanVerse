'use client';
import { Loader2 } from 'lucide-react'; // Ensure this is correctly imported
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from 'react-dom';
import { authenticateArtisan } from '@/lib/actions';
import Link from 'next/link';

function LoginButton() {
  const { pending } = useFormStatus();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = (event) => {
    if (pending) {
      event.preventDefault();
      return;
    }
    setIsLoading(true);
  };

  return (
    <Button className="w-full" aria-disabled={pending || isLoading} onClick={handleClick}>
      {(pending || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
      Log in
    </Button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticateArtisan, undefined);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Artisan Login</CardTitle>
            <CardDescription className="text-lg">Access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={dispatch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required />
              </div>
              <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
              >
                {errorMessage && (
                  <>
                    <p className="text-sm text-red-500">{errorMessage}</p>
                  </>
                )}
              </div>
              <LoginButton />
            </form>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup-artisan" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
