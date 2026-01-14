
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
import { type Booking } from '@/app/(app)/consultant-dashboard/page';

const defaultUsers = [
    { id: 'USR003', name: 'Dr. Evelyn Reed', email: 'evelyn.reed@example.com', role: 'Consultant', joinDate: '2024-06-28', status: 'Active' },
    { id: 'USR004', name: 'Marcus Thorne', email: 'marcus.thorne@example.com', role: 'Consultant', joinDate: '2024-07-05', status: 'Active' },
];

type ConsultantUser = {
  id: string;
  name: string;
  email: string;
  role: 'Consultant';
  joinDate: string;
  status: 'Active' | 'Inactive';
  totalBookings: number;
  totalRevenue: number;
};

export default function ConsultantManagementPage() {
  const [users, setUsers] = useState<ConsultantUser[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');

    const consultantUsers = allUsers.filter((user: any) => user.role.toLowerCase() === 'consultant')
        .map((consultant: any) => {
            const consultantBookings = allBookings.filter(b => b.consultantName === consultant.name && b.status === 'Confirmed');
            const totalBookings = consultantBookings.length;
            const totalRevenue = totalBookings * 50; // Assuming $50 per session
            return { ...consultant, totalBookings, totalRevenue };
        });

    if (consultantUsers.length === 0) {
        const initialConsultants = defaultUsers.map(user => {
            const consultantBookings = allBookings.filter(b => b.consultantName === user.name && b.status === 'Confirmed');
            return {
                ...user,
                totalBookings: consultantBookings.length,
                totalRevenue: consultantBookings.length * 50,
            }
        });
        setUsers(initialConsultants as ConsultantUser[]);
        localStorage.setItem('users', JSON.stringify([...allUsers, ...initialConsultants]));
    } else {
        setUsers(consultantUsers);
    }
  }, []);

  const handleCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newUser: ConsultantUser = {
      id: `USR-${Date.now()}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: 'Consultant',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      totalBookings: 0,
      totalRevenue: 0,
    };
    
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    setDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Consultant Management</h1>
        <p className="text-muted-foreground">
          Create, view, and manage all Visa/PR consultants.
        </p>
      </div>

       <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>All Consultants</CardTitle>
                <CardDescription>
                    An overview of all consultants on the platform.
                </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                    <PlusCircle />
                    Create Consultant
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Consultant</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new consultant account. A temporary password will be sent.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateUser}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Full Name
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
                  <TableHead>Consultant</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell className="text-center font-medium">{user.totalBookings}</TableCell>
                    <TableCell className="text-right font-medium">${user.totalRevenue.toLocaleString()}</TableCell>
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
