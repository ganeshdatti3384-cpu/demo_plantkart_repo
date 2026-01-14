
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Car, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IVendorVehicle } from '@/models/VendorVehicle';

export default function VendorDashboardPage() {
    const { toast } = useToast();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [listingType, setListingType] = useState('For Rent');
    const [vehicles, setVehicles] = useState<IVendorVehicle[]>([]);
    const [currentVendor, setCurrentVendor] = useState<string>("John's Wheels"); // Mock current vendor

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(`/api/vendor-vehicles?vendorName=${currentVendor}`);
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
        fetchVehicles();
    }, [currentVendor, toast]);

    const handleAddVehicle = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const newVehicleData = {
            vendorName: currentVendor,
            listingType: formData.get('listingType') as 'For Rent' | 'For Sale',
            make: formData.get('make') as string,
            model: formData.get('model') as string,
            year: parseInt(formData.get('year') as string, 10),
            transmission: formData.get('transmission') as 'Auto' | 'Manual',
            kms: parseInt(formData.get('kms') as string, 10),
            images: [],
            status: 'Active',
            bookings: 0,
            dailyRate: formData.get('dailyRate') ? parseInt(formData.get('dailyRate') as string, 10) : undefined,
            weeklyRate: formData.get('weeklyRate') ? parseInt(formData.get('weeklyRate') as string, 10) : undefined,
            monthlyRate: formData.get('monthlyRate') ? parseInt(formData.get('monthlyRate') as string, 10) : undefined,
            kmLimit: formData.get('kmLimit') as string | undefined,
            salePrice: formData.get('salePrice') ? parseInt(formData.get('salePrice') as string, 10) : undefined,
            regoExpiry: formData.get('regoExpiry') as string | undefined,
            condition: formData.get('condition') as 'New' | 'Used' | 'Demo' | undefined,
        };

        try {
            const response = await fetch('/api/vendor-vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVehicleData),
            });

            if (!response.ok) {
                throw new Error('Failed to add vehicle');
            }

            const newVehicle = await response.json();
            setVehicles(prev => [...prev, newVehicle]);
            setDialogOpen(false);
            toast({ title: 'Vehicle Added!', description: `${newVehicle.make} ${newVehicle.model} has been listed.` });
        } catch (error) {
            console.error('Failed to add vehicle', error);
            toast({
                title: 'Error',
                description: 'Failed to add vehicle.',
                variant: 'destructive',
            });
        }
    };
    
    const handleStatusChange = async (vehicleId: string, newStatus: IVendorVehicle['status']) => {
        try {
            const response = await fetch(`/api/vendor-vehicles/${vehicleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            setVehicles(prev => 
                prev.map(v => v.id === vehicleId ? { ...v, status: newStatus } : v)
            );

            toast({
                title: "Status Updated",
                description: `Vehicle status changed to ${newStatus}.`
            });
        } catch (error) {
            console.error('Failed to update status', error);
            toast({
                title: 'Error',
                description: 'Failed to update status.',
                variant: 'destructive',
            });
        }
    };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Manage your car rentals and sales.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle />
                    Add New Vehicle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>List a New Vehicle</DialogTitle>
                    <DialogDescription>Fill in the details to add a vehicle to your fleet.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddVehicle}>
                    <ScrollArea className="max-h-[70vh]">
                    <div className="grid gap-4 py-4 px-4">
                        <div className="grid gap-2">
                            <Label htmlFor="listingType">Listing Type</Label>
                            <Select name="listingType" value={listingType} onValueChange={setListingType}>
                                <SelectTrigger id="listingType" className="bg-secondary">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="For Rent">For Rent</SelectItem>
                                    <SelectItem value="For Sale">For Sale</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="grid gap-2"><Label htmlFor="make">Make</Label><Input id="make" name="make" required className="bg-secondary"/></div>
                             <div className="grid gap-2"><Label htmlFor="model">Model</Label><Input id="model" name="model" required className="bg-secondary"/></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="grid gap-2"><Label htmlFor="year">Year</Label><Input id="year" name="year" type="number" required className="bg-secondary"/></div>
                             <div className="grid gap-2"><Label htmlFor="kms">Kilometers</Label><Input id="kms" name="kms" type="number" required className="bg-secondary"/></div>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="photos">Vehicle Photos</Label>
                            <Input id="photos" name="photos" type="file" multiple className="bg-secondary"/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="transmission">Transmission</Label>
                             <Select name="transmission" defaultValue="Auto">
                                <SelectTrigger id="transmission" className="bg-secondary"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Auto">Auto</SelectItem><SelectItem value="Manual">Manual</SelectItem></SelectContent>
                            </Select>
                        </div>

                        {listingType === 'For Rent' ? (
                            <div className="grid gap-4 pt-4 border-t">
                                <h3 className="font-semibold text-foreground">Rental Details</h3>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="grid gap-2"><Label htmlFor="dailyRate">Daily Rate ($)</Label><Input id="dailyRate" name="dailyRate" type="number" className="bg-secondary"/></div>
                                    <div className="grid gap-2"><Label htmlFor="weeklyRate">Weekly Rate ($)</Label><Input id="weeklyRate" name="weeklyRate" type="number" className="bg-secondary"/></div>
                                    <div className="grid gap-2"><Label htmlFor="monthlyRate">Monthly Rate ($)</Label><Input id="monthlyRate" name="monthlyRate" type="number" className="bg-secondary"/></div>
                                </div>
                                <div className="grid gap-2"><Label htmlFor="kmLimit">Kilometer Limit</Label><Input id="kmLimit" name="kmLimit" placeholder="e.g., Unlimited or 500km/week" className="bg-secondary"/></div>
                            </div>
                        ) : (
                            <div className="grid gap-4 pt-4 border-t">
                                <h3 className="font-semibold text-foreground">Sale Details</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="grid gap-2"><Label htmlFor="salePrice">Sale Price ($)</Label><Input id="salePrice" name="salePrice" type="number" required className="bg-secondary"/></div>
                                    <div className="grid gap-2"><Label htmlFor="regoExpiry">Reg. Expiry</Label><Input id="regoExpiry" name="regoExpiry" type="date" className="bg-secondary"/></div>
                                </div>
                                <div className="grid gap-2">
                                     <Label htmlFor="condition">Condition</Label>
                                     <Select name="condition" defaultValue="Used">
                                        <SelectTrigger id="condition" className="bg-secondary"><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Used">Used</SelectItem>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="Demo">Demo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>
                    </ScrollArea>
                    <DialogFooter className="pt-4 border-t">
                        <Button type="submit">Add Vehicle</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Car /> My Vehicle Listings</CardTitle>
          <CardDescription>
            An overview of all your listed vehicles.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Bookings</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {vehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                        <TableCell className="font-medium whitespace-nowrap">{vehicle.make} {vehicle.model} ({vehicle.year})</TableCell>
                        <TableCell>{vehicle.listingType}</TableCell>
                        <TableCell>
                            <Badge variant={vehicle.status === 'Active' ? 'default' : vehicle.status === 'Sold' || vehicle.status === 'Rented' ? 'secondary' : 'destructive'}>
                                {vehicle.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium">{vehicle.bookings > 0 ? vehicle.bookings : '-'}</TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(vehicle.id, 'Active')}>
                                Mark as Available
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(vehicle.id, 'Rented')}>
                                Mark as Rented
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(vehicle.id, 'Sold')}>
                                Mark as Sold
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
