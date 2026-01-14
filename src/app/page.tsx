
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  const [role, setRole] = useState('user');
  const router = useRouter();

  useEffect(() => {
    // Clear role on revisiting the login page
    localStorage.removeItem('userRole');
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Save role to localStorage for other parts of the app to use
    localStorage.setItem('userRole', role);

    // Redirect based on role
    switch (role) {
      case 'admin':
        router.push('/dashboard');
        break;
      case 'vendor':
        router.push('/vendor-dashboard');
        break;
      case 'consultant':
        router.push('/consultant-dashboard');
        break;
      case 'user':
      default:
        // Regular users will be directed to the accommodation page as their primary dashboard
        router.push('/accommodation');
        break;
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
         <div className="mb-8 flex justify-center">
            <Logo />
         </div>
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
            <CardDescription>
              Select your role and log in to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  defaultValue="guest@aussieassist.com"
                  className="bg-secondary"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required defaultValue="password" className="bg-secondary"/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className="bg-secondary">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User (Student/Migrant)</SelectItem>
                    <SelectItem value="vendor">Vendor (Car Rental)</SelectItem>
                    <SelectItem value="consultant">Consultant (Visa/PR)</SelectItem>
                    <SelectItem value="admin">Admin (Super User)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full mt-4">
                Login
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="#" className="font-semibold text-primary">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
