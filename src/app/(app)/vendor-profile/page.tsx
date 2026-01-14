
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
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type VendorProfile = {
  garageName: string;
  address: string;
};

export default function VendorProfilePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<VendorProfile>({ garageName: '', address: '' });
  const [currentVendor, setCurrentVendor] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you'd get the current vendor from the session.
    const vendorName = "John's Wheels"; // Mocking vendor name
    setCurrentVendor(vendorName);

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const vendorData = storedUsers.find((u: any) => u.name === vendorName);
    
    if (vendorData) {
      setProfile({
        garageName: vendorData.garageName || vendorName,
        address: vendorData.address || '',
      });
    }
  }, []);

  const handleSaveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentVendor) return;

    const formData = new FormData(event.currentTarget);
    const updatedProfile = {
      garageName: formData.get('garageName') as string,
      address: formData.get('address') as string,
    };

    // Find the vendor in the users array and update their details
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = storedUsers.map((user: any) => {
      if (user.name === currentVendor) {
        return { ...user, ...updatedProfile };
      }
      return user;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setProfile(updatedProfile);

    toast({
      title: 'Profile Saved!',
      description: 'Your business details have been updated.',
    });
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
    
    // In a real app, this would make an API call to update the password
    toast({
      title: 'Password Updated!',
      description: 'Your password has been changed successfully.',
    });

    event.currentTarget.reset();
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Vendor Profile</h1>
        <p className="text-muted-foreground">Manage your public business information and account security.</p>
      </div>

      <Card className="max-w-3xl shadow-md w-full">
        <form onSubmit={handleSaveProfile}>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
            <CardDescription>
              This information will be visible to users on your vehicle listings.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="garageName">Garage Name</Label>
              <Input
                id="garageName"
                name="garageName"
                value={profile.garageName}
                onChange={(e) => setProfile({ ...profile, garageName: e.target.value })}
                className="bg-secondary"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="123 Example St, Sydney, NSW 2000"
                className="bg-secondary"
                required
              />
            </div>
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
