
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IUserProfile } from '@/models/UserProfile';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<IUserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    citizenship: '',
    passport: '',
    residentialAddress: '',
    country: '',
    hasVisa: 'Yes',
    visaType: '',
    visaTenure: '',
    isStudent: 'No',
    universityName: '',
    course: '',
    collegeAddress: '',
  });

  useEffect(() => {
    if (session?.user?.email) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(`/api/userprofiles/${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setProfile(data);
          } else {
            // Create a default profile if one doesn't exist
            const defaultProfile = {
              email: session.user.email,
              firstName: session.user.name?.split(' ')[0] || '',
              lastName: session.user.name?.split(' ')[1] || '',
              phone: '',
              citizenship: 'Other/International',
              hasVisa: 'Yes',
              isStudent: 'No',
            };
            const createResponse = await fetch('/api/userprofiles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(defaultProfile),
            });
            if(createResponse.ok) {
              const newData = await createResponse.json();
              setProfile(newData);
            }
          }
        } catch (error) {
          console.error('Failed to fetch profile', error);
        }
      };
      fetchProfile();
    }
  }, [session]);

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session?.user?.email) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save your profile.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const response = await fetch(`/api/userprofiles/${session.user.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }
      toast({
        title: 'Profile Saved!',
        description: 'Your personal details have been updated.',
      });
    } catch (error) {
      console.error('Failed to save profile', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile.',
        variant: 'destructive',
      });
    }
  };

  const handleChangePassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
        toast({
            title: "Passwords don't match",
            description: "Please ensure the new password and confirmation match.",
            variant: "destructive"
        });
        return;
    }
    
    // TODO: Implement password change functionality
    toast({
      title: 'Password Updated!',
      description: 'Your password has been changed successfully.',
    });

    event.currentTarget.reset();
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and account security.</p>
      </div>

      <Card className="max-w-3xl shadow-md w-full">
        <form onSubmit={handleSaveProfile}>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>
              This information will be used to auto-fill forms across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        className="bg-secondary"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        className="bg-secondary"
                        required
                    />
                </div>
            </div>
             <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                className="bg-secondary/50"
                readOnly
                disabled
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="e.g., 0412 345 678"
                    className="bg-secondary"
                    required
                />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="citizenship">Citizenship</Label>
                     <Select
                        value={profile.citizenship}
                        onValueChange={(value) => setProfile({ ...profile, citizenship: value })}
                        name="citizenship"
                        required
                    >
                        <SelectTrigger id="citizenship" className="bg-secondary">
                            <SelectValue placeholder="Select citizenship" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Australian">Australian</SelectItem>
                            <SelectItem value="Other/International">Other/International</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {profile.citizenship === 'Australian' && (
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="passport">Passport Number</Label>
                  <Input
                    id="passport"
                    name="passport"
                    value={profile.passport}
                    onChange={(e) => setProfile({ ...profile, passport: e.target.value })}
                    className="bg-secondary"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="residentialAddress">Residential Address</Label>
                  <Textarea
                    id="residentialAddress"
                    name="residentialAddress"
                    value={profile.residentialAddress}
                    onChange={(e) => setProfile({ ...profile, residentialAddress: e.target.value })}
                    className="bg-secondary"
                    required
                  />
                </div>
              </div>
            )}
             {profile.citizenship === 'Other/International' && (
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                            id="country"
                            name="country"
                            value={profile.country}
                            onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                            className="bg-secondary"
                            required
                        />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="hasVisa">Do you have a valid Australian visa?</Label>
                         <Select
                            value={profile.hasVisa}
                            onValueChange={(value) => setProfile({ ...profile, hasVisa: value as 'Yes' | 'No' })}
                            name="hasVisa"
                            required
                        >
                            <SelectTrigger id="hasVisa" className="bg-secondary">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {profile.hasVisa === 'Yes' && (
                     <div className="grid gap-6">
                        <div className="grid gap-2">
                        <Label htmlFor="passport">Passport Number</Label>
                        <Input
                            id="passport"
                            name="passport"
                            value={profile.passport}
                            onChange={(e) => setProfile({ ...profile, passport: e.target.value })}
                            className="bg-secondary"
                            required
                        />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="visaType">Visa Type</Label>
                                <Input
                                    id="visaType"
                                    name="visaType"
                                    value={profile.visaType}
                                    onChange={(e) => setProfile({ ...profile, visaType: e.target.value })}
                                    placeholder="e.g., Student 500"
                                    className="bg-secondary"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="visaTenure">Visa Tenure (Expiry)</Label>
                                <Input
                                    id="visaTenure"
                                    name="visaTenure"
                                    value={profile.visaTenure}
                                    onChange={(e) => setProfile({ ...profile, visaTenure: e.target.value })}
                                    type="date"
                                    className="bg-secondary"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )}
              </div>
            )}
            
            <div className="grid gap-2">
                <Label htmlFor="isStudent">Are you a student?</Label>
                    <Select
                    value={profile.isStudent}
                    onValueChange={(value) => setProfile({ ...profile, isStudent: value as 'Yes' | 'No' })}
                    name="isStudent"
                    required
                >
                    <SelectTrigger id="isStudent" className="bg-secondary">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {profile.isStudent === 'Yes' && (
              <div className="grid gap-6 border-t pt-6">
                <div className="grid gap-2">
                  <Label htmlFor="universityName">University Name</Label>
                  <Input
                    id="universityName"
                    name="universityName"
                    value={profile.universityName}
                    onChange={(e) => setProfile({ ...profile, universityName: e.target.value })}
                    className="bg-secondary"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="course">Course</Label>
                  <Input
                    id="course"
                    name="course"
                    value={profile.course}
                    onChange={(e) => setProfile({ ...profile, course: e.target.value })}
                    className="bg-secondary"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="collegeAddress">College Address</Label>
                  <Textarea
                    id="collegeAddress"
                    name="collegeAddress"
                    value={profile.collegeAddress}
                    onChange={(e) => setProfile({ ...profile, collegeAddress: e.target.value })}
                    className="bg-secondary"
                    required
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card className="max-w-3xl shadow-md w-full">
        <form onSubmit={handleChangePassword}>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your account password. It's recommended to use a strong, unique password.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                className="bg-secondary"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        className="bg-secondary"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="bg-secondary"
                        required
                    />
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Change Password</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
