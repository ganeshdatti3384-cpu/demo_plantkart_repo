
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
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
import { type Vehicle } from '@/app/(app)/vendor-dashboard/page';

const defaultUsers = [
    { id: 'USR004', name: "John's Wheels", email: 'john@wheels.com', role: 'Vendor', joinDate: '2024-06-20', status: 'Active', garageName: "John's Wheels", address: "123 Auto Row, Sydney" },
    { id: 'USR005', name: 'Sydney Drive', email: 'contact@sydneydrive.com.au', role: 'Vendor', joinDate: '2024-07-01', status: 'Active', garageName: "Sydney Drive Rentals", address: "456 Car St, Melbourne" },
];

type User = {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Vendor' | 'Consultant' | 'Admin';
  joinDate: string;
  status: 'Active' | 'Inactive';
  garageName: string;
  address: string;
  totalVehicles: number;
  totalBookings: number;
  totalRevenue: number;
};

export default function VendorManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allVehicles: Vehicle[] = JSON.parse(localStorage.getItem('vehicles') || '[]');

    let vendorUsersData = storedUsers.filter((u: any) => u.role === 'Vendor');

    if (vendorUsersData.length === 0) {
        const otherUsers = storedUsers.filter((u: any) => u.role !== 'Vendor');
        localStorage.setItem('users', JSON.stringify([...otherUsers, ...defaultUsers]));
        vendorUsersData = defaultUsers;
    }

    const vendorsWithStats = vendorUsersData.map((vendor: any) => {
        const vendorVehicles = allVehicles.filter(v => v.vendorName === vendor.name);
        const totalVehicles = vendorVehicles.length;
        const totalBookings = vendorVehicles.reduce((acc, v) => acc + (v.bookings || 0), 0);
        
        const totalRevenue = vendorVehicles.reduce((acc, v) => {
             if (v.status === 'Sold' && v.salePrice) {
                return acc + v.salePrice;
            }
            if ((v.status === 'Rented' || v.status === 'Active') && v.dailyRate && v.bookings) {
                // Assuming each booking is for an average of 3 days for revenue calculation
                return acc + (v.bookings * v.dailyRate * 3);
            }
            return acc;
        }, 0);

        return { ...vendor, totalVehicles, totalBookings, totalRevenue };
    });

    setUsers(vendorsWithStats);

  }, [isDialogOpen]);

  const handleCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newUser = {
      id: `USR-${Date.now()}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: 'Vendor' as const,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active' as const,
      garageName: formData.get('name') as string, // Default garage name to business name
      address: '',
      totalVehicles: 0,
      totalBookings: 0,
      totalRevenue: 0,
    };

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setUsers(prev => [...prev, newUser]);
    setDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Vendor Management</h1>
        <p className="text-muted-foreground">
          Create, view, and manage all car rental vendors.
        </p>
      </div>

       <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>All Vendors</CardTitle>
                <CardDescription>
                    An overview of all car rental vendors on the platform.
                </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                    <PlusCircle />
                    Create Vendor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Vendor</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new vendor account. A temporary password will be sent.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateUser}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Business Name
                      </Label>
                      <Input id="name" name="name" className="col-span-3 bg-secondary" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input id="email" name="email" type="email" className="col-span-3 bg-secondary" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Account</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Vehicles</TableHead>
                  <TableHead className="text-center">Bookings</TableHead>
                   <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                     <TableCell className="text-center font-medium">{user.totalVehicles ?? 0}</TableCell>
                     <TableCell className="text-center font-medium">{user.totalBookings ?? 0}</TableCell>
                     <TableCell className="text-right font-medium">${(user.totalRevenue ?? 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Manage</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
