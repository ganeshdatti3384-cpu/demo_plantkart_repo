
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { type UserProfile } from '@/types';

export type LoanApplication = {
    id: string;
    profile: UserProfile;
    loanAmount: string;
    loanPurpose: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export default function LoanApplicationPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load existing applications from localStorage
    const storedApplications = localStorage.getItem('loanApplications');
    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    }

    // Load current user profile
    const userEmail = 'guest@aussieassist.com';
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userData = storedUsers.find((u: any) => u.email === userEmail);
    if (userData) {
      setCurrentUserProfile({
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ')[1] || '',
        email: userData.email,
        phone: userData.phone || '',
        citizenship: userData.citizenship || '',
        passport: userData.passport || '',
        residentialAddress: userData.residentialAddress || '',
        country: userData.country || '',
        visaType: userData.visaType || '',
        visaTenure: userData.visaTenure || '',
        isStudent: userData.isStudent || 'No',
        universityName: userData.universityName || '',
        course: userData.course || '',
        collegeAddress: userData.collegeAddress || '',
      });
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUserProfile) {
        toast({
            title: 'Profile Not Found',
            description: 'Please complete your profile first.',
            variant: 'destructive'
        });
        return;
    }
    const formData = new FormData(event.currentTarget);
    
    const newApplication: LoanApplication = {
        id: `LOAN-${Date.now()}`,
        profile: currentUserProfile,
        loanAmount: formData.get('loanAmount') as string,
        loanPurpose: formData.get('loanPurpose') as string,
        status: 'Pending',
    };

    if (!newApplication.loanAmount || !newApplication.loanPurpose) {
        toast({
            title: 'Missing Information',
            description: 'Please fill out all required fields.',
            variant: 'destructive'
        });
        return;
    }

    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('loanApplications', JSON.stringify(updatedApplications));

    toast({
        title: 'Application Submitted!',
        description: 'Your loan application has been sent. Our team will contact you in 24-48 hours.'
    });

    event.currentTarget.reset();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Apply for a Loan
        </h1>
        <p className="text-muted-foreground">
          Fill out the form below to apply for a personal or educational loan.
        </p>
      </div>
      <Card className="max-w-3xl shadow-md w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Loan Application Form</CardTitle>
            <CardDescription>
              Your personal details are pre-filled. Please provide the loan details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    value={currentUserProfile ? `${currentUserProfile.firstName} ${currentUserProfile.lastName}` : ''}
                    className="bg-secondary/50" 
                    readOnly 
                    disabled
                  />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    value={currentUserProfile ? currentUserProfile.email : ''}
                    className="bg-secondary/50" 
                    readOnly 
                    disabled
                  />
                </div>
              </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={currentUserProfile ? currentUserProfile.phone : ''}
                    className="bg-secondary/50" 
                    readOnly 
                    disabled
                  />
                </div>
              <div className="grid gap-2">
                  <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                  <Input
                    id="loanAmount"
                    name="loanAmount"
                    type="number"
                    placeholder="e.g., 5000"
                    className="bg-secondary"
                    required
                  />
                </div>
              <div className="grid gap-2">
                <Label htmlFor="loanPurpose">Purpose of Loan</Label>
                <Textarea
                  id="loanPurpose"
                  name="loanPurpose"
                  placeholder="e.g., University fees, car purchase, rental bond..."
                  className="bg-secondary"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit Application</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
