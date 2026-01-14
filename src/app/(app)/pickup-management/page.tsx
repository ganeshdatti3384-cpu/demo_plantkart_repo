
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
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { type PickupRequest } from '@/app/(app)/airport-pickup/page';
import { useToast } from '@/hooks/use-toast';

export default function PickupManagementPage() {
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedRequests = localStorage.getItem('pickupRequests');
    if (storedRequests) {
      setPickupRequests(JSON.parse(storedRequests));
    }
  }, []);

  const handleAssignDriver = (requestId: string) => {
    const updatedRequests = pickupRequests.map(req =>
      req.id === requestId ? { ...req, status: 'Approved' } : req
    );
    setPickupRequests(updatedRequests);
    localStorage.setItem('pickupRequests', JSON.stringify(updatedRequests));
    toast({
        title: "Driver Assigned!",
        description: "The pickup request has been approved and moved to the 'Approved' tab."
    });
  }

  const pendingRequests = pickupRequests.filter(r => r.status === 'Pending');

  return (
    <div className="flex flex-col gap-8">
       <div>
        <h1 className="text-3xl font-bold font-headline">Pickup Management</h1>
        <p className="text-muted-foreground">
          Assign drivers to new airport pickup requests.
        </p>
      </div>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Pending Airport Pickups</CardTitle>
            <CardDescription>Assign drivers to new pickup requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Flight</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.length > 0 ? (
                  pendingRequests
                    .map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.profile.firstName} {req.profile.lastName}</TableCell>
                        <TableCell>{req.flightNumber}</TableCell>
                        <TableCell>
                          {req.arrivalDate} at {req.arrivalTime}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => handleAssignDriver(req.id)}>Assign Driver</Button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No pending requests.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
