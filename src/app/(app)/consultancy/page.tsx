
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { type Booking, type Availability, type DayAvailability } from '@/app/(app)/consultant-dashboard/page';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Video } from 'lucide-react';
import { type UserProfile } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IConsultant } from '@/models/Consultant';

const getDefaultAvailability = (): Availability => {
    const availability: Availability = {};
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    daysOfWeek.forEach(day => {
        availability[day] = {
            active: !['Saturday', 'Sunday'].includes(day),
            slots: [
                { id: '1', time: '09:00' }, { id: '2', time: '09:30' },
                { id: '3', time: '10:00' }, { id: '4', time: '10:30' },
                { id: '5', time: '11:00' }, { id: '6', time: '11:30' },
                { id: '7', time: '14:00' }, { id: '8', time: '14:30' },
                { id: '9', time: '15:00' },
            ],
        };
    });
    return availability;
};

export default function ConsultancyPage() {
    const { toast } = useToast();
    const [consultants, setConsultants] = useState<IConsultant[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [currentConsultant, setCurrentConsultant] = useState<IConsultant | null>(null);
    const [userBookings, setUserBookings] = useState<Booking[]>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchConsultants = async () => {
            try {
                const response = await fetch('/api/consultants');
                const data = await response.json();
                setConsultants(data);
                if (data.length > 0) {
                    setCurrentConsultant(data[0]);
                }
            } catch (error) {
                console.error('Failed to fetch consultants', error);
                toast({
                    title: 'Error',
                    description: 'Failed to fetch consultants.',
                    variant: 'destructive',
                });
            }
        };
        fetchConsultants();
    }, [toast]);


    const availability: Availability | null = useMemo(() => {
        if (!currentConsultant) return null;
        const stored = typeof window !== 'undefined' ? localStorage.getItem(`availability_${currentConsultant.firstName}_${currentConsultant.lastName}`) : null;
        return stored ? JSON.parse(stored) : getDefaultAvailability();
    }, [currentConsultant]);
    
     const bookedSlots = useMemo(() => {
        if (typeof window === 'undefined' || !currentConsultant) return [];
        const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
        if (!selectedDate) return [];
        const dateStr = selectedDate.toISOString().split('T')[0];
        return allBookings
            .filter(b => b.consultantName === `${currentConsultant.firstName} ${currentConsultant.lastName}` && b.date === dateStr)
            .map(b => b.time);
    }, [selectedDate, currentConsultant, isDialogOpen]);

    const availableTimeSlots = useMemo(() => {
        if (!availability || !selectedDate) return [];

        const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
        const dayAvailability: DayAvailability = availability[dayOfWeek];

        if (!dayAvailability || !dayAvailability.active) return [];

        return dayAvailability.slots
            .map(slot => slot.time)
            .filter(time => !bookedSlots.includes(time));
            
    }, [availability, selectedDate, bookedSlots]);
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
            const userEmail = 'guest@aussieassist.com';
            const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const userData = storedUsers.find((u: any) => u.email === userEmail);
            if (userData) {
                setCurrentUserProfile(userData);
                const clientName = `${userData.name?.split(' ')[0]} ${userData.name?.split(' ')[1]}`;
                const currentUserBookings = allBookings.filter(b => b.clientName === clientName);
                setUserBookings(currentUserBookings);
            }
        }
    }, [isDialogOpen]);


    const handleBooking = (consultantName: string, service: string) => {
        if (!selectedDate || !selectedTime || !currentUserProfile) {
            toast({
                title: 'Incomplete Selection',
                description: 'Please select a date and time slot, and ensure your profile is complete.',
                variant: 'destructive',
            });
            return;
        }

        const newBooking: Booking = {
            id: `BOK-${Date.now()}`,
            clientName: `${currentUserProfile.firstName} ${currentUserProfile.lastName}`,
            avatar: 'https://picsum.photos/seed/p4/100/100',
            consultantName: consultantName,
            service: service,
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
            status: 'Confirmed',
            meetLink: `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`
        };

        const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const updatedBookings = [...existingBookings, newBooking];
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));

        setUserBookings(prev => [...prev, newBooking]);

        toast({
            title: 'Booking Confirmed!',
            description: `Your session with ${consultantName} is booked. A confirmation email with the Google Meet link has been sent.`
        });
        
        setSelectedTime(null);
        setDialogOpen(false);
    };

    const isDayDisabled = (date: Date): boolean => {
        if (date < new Date(new Date().setDate(new Date().getDate() - 1))) {
            return true;
        }
        if (!availability) return true;
        
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        return !availability[dayOfWeek] || !availability[dayOfWeek].active;
    };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Book a Consultation</h1>
        <p className="text-muted-foreground">Get expert advice to help you settle in smoothly.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {consultants.map((consultant) => {
          return (
            <Dialog key={consultant.id} open={isDialogOpen && currentConsultant?.id === consultant.id} onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setDialogOpen(false);
                    setSelectedTime(null);
                } else {
                    setCurrentConsultant(consultant);
                    setDialogOpen(true);
                }
            }}>
                <Card className="flex flex-col items-center justify-center p-6 text-center shadow-md">
                <CardHeader className="p-0 flex-grow">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                    <AvatarImage src={consultant.profileImage} alt={`${consultant.firstName} ${consultant.lastName}`} />
                    <AvatarFallback>{consultant.firstName.charAt(0)}{consultant.lastName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{consultant.firstName} {consultant.lastName}</CardTitle>
                    <CardDescription>{consultant.specialization.join(', ')}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex-grow">
                    
                </CardContent>
                <CardFooter className="p-0 mt-6 w-full">
                    <DialogTrigger asChild>
                        <Button className="w-full">View Availability</Button>
                    </DialogTrigger>
                </CardFooter>
                </Card>
                 <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Book a Session with {consultant.firstName} {consultant.lastName}</DialogTitle>
                        <DialogDescription>Select a date and time for your consultation.</DialogDescription>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-8 py-4">
                        <div className="flex justify-center">
                             <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                    setSelectedDate(date);
                                    setSelectedTime(null);
                                }}
                                className="rounded-md border"
                                disabled={isDayDisabled}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="font-semibold">
                                { selectedDate ? `Available Slots for ${selectedDate.toLocaleDateString()}` : 'Select a date' }
                            </h4>
                            <ScrollArea className="h-64">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pr-4">
                                    {availableTimeSlots.length > 0 ? (
                                        availableTimeSlots.map(time => (
                                            <Button
                                                key={time}
                                                variant={selectedTime === time ? 'default' : 'outline'}
                                                onClick={() => setSelectedTime(time)}
                                            >
                                                {new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </Button>
                                        ))
                                    ) : (
                                        <p className="col-span-3 text-sm text-muted-foreground">
                                            No available slots for this day. The consultant may be unavailable or fully booked. Please try another date.
                                        </p>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => handleBooking(`${consultant.firstName} ${consultant.lastName}`, consultant.specialization.join(', '))}
                            disabled={!selectedTime}
                        >
                            Confirm Booking for $50
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          );
        })}
      </div>
      
      {userBookings.length > 0 && (
         <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Your Upcoming Bookings</CardTitle>
                <CardDescription>Here are your scheduled consultation sessions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {userBookings.sort((a,b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()).map(booking => (
                    <div key={booking.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border bg-card gap-4">
                       <div className="flex-grow">
                            <p className="font-semibold">
                                {booking.service} with {booking.consultantName}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1"><CalendarIcon className="h-4 w-4"/> {new Date(booking.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span>
                                <span className="flex items-center gap-1"><Clock className="h-4 w-4"/> {new Date(`1970-01-01T${booking.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                            </div>
                       </div>
                       <div className="flex items-center gap-2">
                           <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}>{booking.status}</Badge>
                           {booking.status === 'Confirmed' && (
                                <Button asChild variant="outline" size="sm">
                                    <a href={booking.meetLink} target="_blank" rel="noopener noreferrer">
                                        <Video className="mr-2 h-4 w-4"/>
                                        Join Meeting
                                    </a>
                                </Button>
                           )}
                       </div>

                    </div>
                ))}
            </CardContent>
         </Card>
      )}

    </div>
  );
}
