
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

export type PickupRequest = {
    id: string;
    profile: UserProfile;
    flightNumber: string;
    arrivalDate: string;
    arrivalTime: string;
    passengers: string;
    dropoffAddress: string;
    status: string;
}

export default function AirportPickupPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load existing requests from localStorage
    const storedRequests = localStorage.getItem('pickupRequests');
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
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
    
    const newRequest: PickupRequest = {
        id: `REQ-${Date.now()}`,
        profile: currentUserProfile,
        flightNumber: formData.get('flightNumber') as string,
        arrivalDate: formData.get('arrivalDate') as string,
        arrivalTime: formData.get('arrivalTime') as string,
        passengers: formData.get('passengers') as string,
        dropoffAddress: formData.get('dropoffAddress') as string,
        status: 'Pending',
    };

    if (!currentUserProfile.firstName || !newRequest.flightNumber || !newRequest.arrivalDate || !newRequest.arrivalTime || !newRequest.dropoffAddress) {
        toast({
            title: 'Missing Information',
            description: 'Please fill out all required fields.',
            variant: 'destructive'
        });
        return;
    }

    const updatedRequests = [...requests, newRequest];
    setRequests(updatedRequests);
    localStorage.setItem('pickupRequests', JSON.stringify(updatedRequests));

    toast({
        title: 'Request Submitted!',
        description: 'Your airport pickup request has been sent for processing.'
    });

    event.currentTarget.reset();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Request Airport Pickup
        </h1>
        <p className="text-muted-foreground">
          Secure your transport from the airport to your accommodation.
        </p>
      </div>
      <Card className="max-w-3xl shadow-md w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Pickup Details</CardTitle>
            <CardDescription>
              Fill in your flight and destination details to arrange for a pickup.
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
                  <Label htmlFor="flightNumber">Flight Number</Label>
                  <Input
                    id="flightNumber"
                    name="flightNumber"
                    placeholder="e.g., QF400"
                    className="bg-secondary"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="arrivalDate">Arrival Date</Label>
                  <Input id="arrivalDate" name="arrivalDate" type="date" className="bg-secondary" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="arrivalTime">Arrival Time</Label>
                  <Input id="arrivalTime" name="arrivalTime" type="time" className="bg-secondary" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="passengers">Number of Passengers</Label>
                <Input
                  id="passengers"
                  name="passengers"
                  type="number"
                  min="1"
                  placeholder="1"
                  className="bg-secondary"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dropoffAddress">Drop-off Address</Label>
                <Textarea
                  id="dropoffAddress"
                  name="dropoffAddress"
                  placeholder="123 Example St, Sydney, NSW 2000"
                  className="bg-secondary"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Request Pickup</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
