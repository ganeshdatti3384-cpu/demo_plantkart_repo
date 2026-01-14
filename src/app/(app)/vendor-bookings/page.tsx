
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { type VehicleBooking } from '../vehicles/page';
import { type Vehicle } from '../vendor-dashboard/page';

const BookingTable = ({ bookings, onApprove }: { bookings: VehicleBooking[], onApprove?: (bookingId: string, vehicleId: string) => void }) => (
    <div className="w-full overflow-x-auto">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    {onApprove && <TableHead className="text-right">Action</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {bookings.length > 0 ? bookings.map(booking => (
                    <TableRow key={booking.id}>
                        <TableCell className="font-medium whitespace-nowrap">{booking.userName}</TableCell>
                        <TableCell className="whitespace-nowrap">{booking.vehicleName}</TableCell>
                        <TableCell className="whitespace-nowrap">{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{booking.duration}</TableCell>
                        <TableCell><Badge variant={booking.status === 'Pending' ? 'destructive' : 'default'}>{booking.status}</Badge></TableCell>
                        {onApprove && (
                            <TableCell className="text-right">
                                <Button size="sm" onClick={() => onApprove(booking.id, booking.vehicleId)}>Approve</Button>
                            </TableCell>
                        )}
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={onApprove ? 6 : 5} className="text-center text-muted-foreground">No bookings in this category.</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
);

export default function VendorBookingsPage() {
    const { toast } = useToast();
    const [bookings, setBookings] = useState<VehicleBooking[]>([]);
    const [currentVendor, setCurrentVendor] = useState<string | null>(null);

    useEffect(() => {
        const vendor = { name: "John's Wheels" }; 
        setCurrentVendor(vendor.name);

        const allBookings: VehicleBooking[] = JSON.parse(localStorage.getItem('vehicleBookings') || '[]');
        const vendorBookings = allBookings.filter(b => b.vendorName === vendor.name);
        setBookings(vendorBookings);

    }, []);

    const handleApproveBooking = (bookingId: string, vehicleId: string) => {
        // Update booking status
        const allBookings: VehicleBooking[] = JSON.parse(localStorage.getItem('vehicleBookings') || '[]');
        const updatedBookings = allBookings.map(b => b.id === bookingId ? { ...b, status: 'Confirmed' } : b);
        localStorage.setItem('vehicleBookings', JSON.stringify(updatedBookings));

        // Update vehicle status
        const allVehicles: Vehicle[] = JSON.parse(localStorage.getItem('vehicles') || '[]');
        const updatedVehicles = allVehicles.map(v => v.id === vehicleId ? { ...v, status: 'Rented' } : v);
        localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));

        // Update local state
        if (currentVendor) {
            setBookings(updatedBookings.filter(b => b.vendorName === currentVendor));
        }

        toast({
            title: "Booking Approved!",
            description: "The vehicle has been marked as Rented and removed from public listings."
        });
    }

    const pendingBookings = bookings.filter(b => b.status === 'Pending');
    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Manage Vehicle Bookings</h1>
                <p className="text-muted-foreground">Review and approve new rental requests.</p>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                    <CardDescription>These are new requests from users that need your approval.</CardDescription>
                </CardHeader>
                <CardContent>
                    <BookingTable bookings={pendingBookings} onApprove={handleApproveBooking} />
                </CardContent>
            </Card>

             <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Confirmed & Active Rentals</CardTitle>
                    <CardDescription>These are your vehicles currently out on rent.</CardDescription>
                </CardHeader>
                <CardContent>
                    <BookingTable bookings={confirmedBookings} />
                </CardContent>
            </Card>
        </div>
    );
}
