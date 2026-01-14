'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('google', { callbackUrl: '/' });
      if (result?.error) {
        toast({ title: 'Error', description: 'Failed to sign in with Google', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An error occurred', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({ title: 'Error', description: 'Invalid credentials', variant: 'destructive' });
      } else {
        router.push('/');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An error occurred', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: otpEmail }),
      });
      if (response.ok) {
        setOtpSent(true);
        toast({ title: 'OTP sent', description: 'Check your email for the OTP' });
      } else {
        const error = await response.json();
        toast({ title: 'Error', description: error.message || 'Failed to send OTP', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send OTP', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('otp', {
        email: otpEmail,
        otp,
        redirect: false,
      });
      if (result?.ok) {
        router.push('/dashboard');
        toast({ title: 'Success', description: 'Logged in successfully' });
      } else {
        toast({ title: 'Error', description: result?.error || 'Invalid OTP', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to verify OTP', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Choose your sign-in method</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="google" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="google">Google</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="otp">OTP</TabsTrigger>
            </TabsList>
            <TabsContent value="google">
              <Button onClick={handleGoogleSignIn} disabled={isLoading} className="w-full">
                Sign in with Google
              </Button>
            </TabsContent>
            <TabsContent value="password">
              <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  Sign In
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="otp">
              <div className="space-y-4">
                {!otpSent ? (
                  <>
                    <div>
                      <Label htmlFor="otpEmail">Email</Label>
                      <Input
                        id="otpEmail"
                        type="email"
                        value={otpEmail}
                        onChange={(e) => setOtpEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button onClick={handleSendOTP} disabled={isLoading} className="w-full">
                      Send OTP
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    <Button onClick={handleVerifyOTP} disabled={isLoading} className="w-full">
                      Verify OTP
                    </Button>
                    <Button variant="outline" onClick={() => setOtpSent(false)} className="w-full">
                      Back
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-center">
            <a href="/signup" className="text-sm text-blue-600 hover:underline">
              Don't have an account? Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}