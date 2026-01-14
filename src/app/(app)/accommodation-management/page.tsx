
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { type ViewingRequest } from '../accommodation/page';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type UserProfile } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type Accommodation = {
    id: string;
    title: string;
    address: string;
    price: string;
    period: 'day' | 'week' | 'month';
    beds: number;
    baths: number;
    imageUrl: string;
    status: 'Available' | 'Rented' | 'Unavailable';
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
};

export default function AccommodationManagementPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [viewingRequests, setViewingRequests] = useState<ViewingRequest[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userEmail = 'guest@aussieassist.com';
      try {
        const profileResponse = await fetch(`/api/userprofiles/${encodeURIComponent(userEmail)}`);
        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          setCurrentUserProfile(userData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }

      try {
        const accommodationsResponse = await fetch('/api/accommodations');
        if (accommodationsResponse.ok) {
          const allAccommodations = await accommodationsResponse.json();
          const userAccommodations = allAccommodations.filter((acc: Accommodation) => acc.ownerEmail === userEmail);
          setAccommodations(userAccommodations);
        }
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      }

      try {
        const requestsResponse = await fetch('/api/viewingrequests');
        if (requestsResponse.ok) {
          const requests = await requestsResponse.json();
          setViewingRequests(requests);
        }
      } catch (error) {
        console.error('Error fetching viewing requests:', error);
      }
    };
    fetchData();
  }, [isDialogOpen]);

  const handleAddProperty = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentUserProfile) {
        toast({ title: 'Profile needed', description: 'Please complete your profile to list a property.', variant: 'destructive' });
        return;
    }
    
    const formData = new FormData(event.currentTarget);
    const newProperty: Accommodation = {
      id: `acc-${Date.now()}`,
      title: formData.get('title') as string,
      address: formData.get('address') as string,
      price: formData.get('price') as string,
      period: formData.get('period') as 'day' | 'week' | 'month',
      beds: parseInt(formData.get('beds') as string, 10),
      baths: parseInt(formData.get('baths') as string, 10),
      imageUrl: '/uploads/default-accommodation.jpg', // Default image, can be updated with upload
      status: 'Available',
      ownerName: formData.get('ownerName') as string,
      ownerEmail: formData.get('ownerEmail') as string,
      ownerPhone: formData.get('ownerPhone') as string,
    };

    try {
      const response = await fetch('/api/accommodations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProperty),
      });
      if (response.ok) {
        const createdProperty = await response.json();
        setAccommodations(prev => [...prev, createdProperty]);
        setDialogOpen(false);
        toast({ title: 'Property Listed!', description: 'Your property is now live on the marketplace.' });
      } else {
        toast({ title: 'Error', description: 'Failed to list property.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error creating property:', error);
      toast({ title: 'Error', description: 'Failed to list property.', variant: 'destructive' });
    }
  };
  
  const handleStatusChange = async (accommodationId: string, status: Accommodation['status']) => {
    try {
      const response = await fetch(`/api/accommodations/${accommodationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setAccommodations(prev => prev.map(acc => acc.id === accommodationId ? { ...acc, status } : acc));
        toast({
            title: "Status Updated",
            description: `Property marked as ${status}.`
        });
      } else {
        toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    }
  }

  const handleRequestStatusChange = async (requestId: string, status: ViewingRequest['status']) => {
    try {
      const response = await fetch(`/api/viewingrequests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        const updatedRequest = await response.json();
        setViewingRequests(prev => prev.map(req => req.id === requestId ? updatedRequest : req));
        toast({
            title: "Request Updated",
            description: `Viewing request status changed to ${status}.`
        });
      } else {
        toast({ title: 'Error', description: 'Failed to update request.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error updating request:', error);
      toast({ title: 'Error', description: 'Failed to update request.', variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Properties</h1>
        <p className="text-muted-foreground">Manage your properties and viewing requests.</p>
      </div>

       <Tabs defaultValue="requests">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">Viewing Requests ({viewingRequests.length})</TabsTrigger>
            <TabsTrigger value="properties">My Properties ({accommodations.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Viewing Requests</CardTitle>
                    <CardDescription>Review and respond to viewing requests from potential tenants.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property</TableHead>
                                <TableHead>Applicant</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {viewingRequests.length > 0 ? viewingRequests.map(req => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium">{req.accommodationTitle}</TableCell>
                                    <TableCell>{req.userName}</TableCell>
                                    <TableCell>{req.userEmail}</TableCell>
                                    <TableCell><Badge variant={req.status === 'Pending' ? 'default' : req.status === 'Confirmed' ? 'secondary' : 'destructive'}>{req.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleRequestStatusChange(req.id, 'Confirmed')}>Confirm Viewing</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleRequestStatusChange(req.id, 'Cancelled')}>Cancel Request</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">No viewing requests yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="properties">
            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>My Properties</CardTitle>
                        <CardDescription>Manage your listed properties.</CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                        <PlusCircle />
                        List a Property
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                        <DialogTitle>List a New Property</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to list your property on the marketplace.
                        </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddProperty}>
                        <ScrollArea className="max-h-[70vh]">
                        <div className="grid gap-4 py-4 px-4">
                            <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" className="bg-secondary" required />
                            </div>
                            <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" className="bg-secondary" required />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                <Label htmlFor="ownerName">Owner Name</Label>
                                <Input id="ownerName" name="ownerName" defaultValue={currentUserProfile ? `${currentUserProfile.firstName} ${currentUserProfile.lastName}` : ''} className="bg-secondary" required />
                                </div>
                                <div className="grid gap-2">
                                <Label htmlFor="ownerEmail">Owner Email</Label>
                                <Input id="ownerEmail" name="ownerEmail" type="email" defaultValue={currentUserProfile?.email} className="bg-secondary" required />
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                               <div className="grid gap-2">
                                <Label htmlFor="ownerPhone">Owner Phone</Label>
                                <Input id="ownerPhone" name="ownerPhone" type="tel" defaultValue={currentUserProfile?.phone} className="bg-secondary" required />
                                </div>
                                <div className="grid grid-cols-2 gap-2 items-end">
                                   <div className="grid gap-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input id="price" name="price" type="number" className="bg-secondary" required />
                                    </div>
                                    <Select name="period" defaultValue="week">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="day">/ Day</SelectItem>
                                            <SelectItem value="week">/ Week</SelectItem>
                                            <SelectItem value="month">/ Month</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                <Label htmlFor="beds">Beds</Label>
                                <Input id="beds" name="beds" type="number" className="bg-secondary" required />
                                </div>
                                <div className="grid gap-2">
                                <Label htmlFor="baths">Baths</Label>
                                <Input id="baths" name="baths" type="number" className="bg-secondary" required />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="images">Property Images</Label>
                                <Input id="images" name="images" type="file" multiple className="bg-secondary"/>
                            </div>
                        </div>
                        </ScrollArea>
                        <DialogFooter className="mt-4">
                            <Button type="submit">Add Property</Button>
                        </DialogFooter>
                        </form>
                    </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {accommodations.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell>${item.price}/{item.period}</TableCell>
                                <TableCell><Badge variant={item.status === 'Available' ? 'default' : 'secondary'}>{item.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'Rented')}>Mark as Rented</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'Available')}>Mark as Available</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
       </Tabs>
    </div>
  );
}
