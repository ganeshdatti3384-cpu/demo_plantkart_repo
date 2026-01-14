
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { IVehicle } from '@/models/Vehicle';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { type UserProfile } from '@/types';

export type VehicleBooking = {
  id: string;
  vehicleId: string;
  vendorName: string;
  vehicleName: string;
  userName: string;
  startDate: string;
  duration: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
}

export default function VehiclesPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [vehicles, setVehicles] = useState<IVehicle[]>([]);
    const [isBookDialogOpen, setBookDialogOpen] = useState(false);
    const [isEnquireDialogOpen, setEnquireDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | null>(null);
    const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);


    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('/api/vehicles');
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error('Failed to fetch vehicles', error);
                toast({
                    title: 'Error',
                    description: 'Failed to fetch vehicles.',
                    variant: 'destructive',
                });
            }
        };

        const fetchUserProfile = () => {
             const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
             const userEmail = 'guest@aussieassist.com';
             const userData = storedUsers.find((u: any) => u.email === userEmail);
             if(userData) {
                 setCurrentUserProfile(userData);
             }
        }

        fetchVehicles();
        fetchUserProfile();
    }, [toast]);

    const handleBookNow = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedVehicle || !currentUserProfile) return;
        
        const formData = new FormData(event.currentTarget);
        const newBooking: VehicleBooking = {
            id: `VBK-${Date.now()}`,
            vehicleId: selectedVehicle.id,
            vendorName: selectedVehicle.vendorName,
            vehicleName: `${selectedVehicle.name} ${selectedVehicle.vehicleModel}`,
            userName: `${currentUserProfile.firstName} ${currentUserProfile.lastName}`,
            startDate: formData.get('startDate') as string,
            duration: `${formData.get('duration')} days`,
            status: 'Pending'
        };

        const existingBookings = JSON.parse(localStorage.getItem('vehicleBookings') || '[]');
        localStorage.setItem('vehicleBookings', JSON.stringify([...existingBookings, newBooking]));

        toast({
            title: "Booking Request Sent!",
            description: `Your request for the ${selectedVehicle.name} ${selectedVehicle.vehicleModel} has been sent to the vendor.`,
        });

        setBookDialogOpen(false);
    };

    const handleEnquire = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        toast({
            title: "Inquiry Sent!",
            description: `Your message about the ${selectedVehicle?.name} ${selectedVehicle?.vehicleModel} has been sent.`,
        });
        setEnquireDialogOpen(false);
    }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
         <div>
            <h1 className="text-3xl font-bold font-headline">Car Rentals & Sales</h1>
            <p className="text-muted-foreground">Rent or buy your next vehicle with ease.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {vehicles.length > 0 ? vehicles.map((item) => {
            return (
                <Card key={item.id} className="flex flex-col shadow-md">
                    {item.images.length > 0 && (
                        <div className="relative aspect-video">
                        <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="rounded-t-lg object-cover"
                        />
                        <Badge className="absolute top-3 right-3">{item.type}</Badge>
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className="text-xl">{item.name} {item.vehicleModel} ({item.year})</CardTitle>
                        <CardDescription>Listed by {item.vendorName}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="flex items-baseline">
                             <span className="text-2xl font-bold">
                                ${item.pricePerDay}
                            </span>
                           <span className="text-sm text-muted-foreground">/day</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Dialog open={isBookDialogOpen && selectedVehicle?.id === item.id} onOpenChange={(isOpen) => { if (!isOpen) setSelectedVehicle(null); setBookDialogOpen(isOpen); }}>
                            <DialogTrigger asChild>
                                <Button className="w-full" onClick={() => setSelectedVehicle(item)}>Rent Now</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Book {item.name} {item.vehicleModel}</DialogTitle>
                                    <DialogDescription>Please provide your desired rental dates.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleBookNow}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="startDate">Start Date</Label>
                                            <Input id="startDate" name="startDate" type="date" className="bg-secondary" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="duration">Duration (days)</Label>
                                            <Input id="duration" name="duration" type="number" min="1" defaultValue="1" className="bg-secondary" required />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Send Booking Request</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>
            )
        }) : (
             <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16">
                <p className="text-muted-foreground">No available vehicles listed yet. Check back soon!</p>
            </div>
        )}
      </div>
    </div>
  );
}
