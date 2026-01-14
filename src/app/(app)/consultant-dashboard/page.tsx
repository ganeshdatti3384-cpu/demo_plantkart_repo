
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Video, PlusCircle, X, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

export type Booking = {
    id: string;
    clientName: string;
    avatar: string;
    consultantName?: string;
    service: string;
    date: string;
    time: string;
    status: string;
    meetLink?: string;
}

export type TimeSlot = {
  id: string;
  time: string;
};

export type DayAvailability = {
  active: boolean;
  slots: TimeSlot[];
};

export type Availability = {
  [day: string]: DayAvailability;
};


export const upcomingBookings: Booking[] = [
    { id: 'BOK001', clientName: 'Aarav Sharma', avatar: 'https://picsum.photos/seed/p1/100/100', service: 'Visa Application Review', date: '2024-08-15', time: '10:30', status: 'Confirmed', meetLink: 'https://meet.google.com/abc-def-ghi' },
    { id: 'BOK002', clientName: 'Saanvi Patel', avatar: 'https://picsum.photos/seed/p2/100/100', service: 'PR Pathway Strategy', date: '2024-08-16', time: '14:00', status: 'Confirmed', meetLink: 'https://meet.google.com/jkl-mno-pqr' },
    { id: 'BOK003', clientName: 'Rohan Mehta', avatar: 'https://picsum.photos/seed/p3/100/100', service: 'Post-Study Work Visa', date: '2024-08-18', time: '11:00', status: 'Pending Payment' },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const getDefaultAvailability = (): Availability => {
    const availability: Availability = {};
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

type SlotCreationMode = 'multiple' | 'single';

export default function ConsultantDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability>(getDefaultAvailability());
  const [isAvailabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const { toast } = useToast();
  const [creationModes, setCreationModes] = useState<{[key: string]: SlotCreationMode}>(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: 'multiple' }), {})
  );

  useEffect(() => {
    const user = { name: 'Dr. Evelyn Reed' }; 
    setCurrentUser(user.name);

    const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    const consultantBookings = allBookings.filter((b: Booking) => b.consultantName === user.name);
    
    if (consultantBookings.length === 0 && allBookings.every(b => b.consultantName !== user.name)) {
        const defaultBookingsForConsultant = upcomingBookings.map(b => ({ ...b, consultantName: user.name }));
        setBookings(defaultBookingsForConsultant);
        const otherBookings = allBookings.filter((b: Booking) => b.consultantName !== user.name);
        localStorage.setItem('bookings', JSON.stringify([...otherBookings, ...defaultBookingsForConsultant]));
    } else {
        setBookings(consultantBookings);
    }

    const storedAvailability = localStorage.getItem(`availability_${user.name}`);
    if (storedAvailability) {
        setAvailability(JSON.parse(storedAvailability));
    } else {
        localStorage.setItem(`availability_${user.name}`, JSON.stringify(availability));
    }
  }, []);

  const handleCompleteBooking = (bookingId: string) => {
    const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updatedBookings = allBookings.map(b => 
        b.id === bookingId ? { ...b, status: 'Completed' } : b
    );
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    if(currentUser) {
        setBookings(updatedBookings.filter(b => b.consultantName === currentUser));
    }
    toast({ title: "Meeting Completed", description: "The booking has been moved to your completed list." });
  };


  const handleAvailabilitySave = () => {
    if(currentUser) {
        localStorage.setItem(`availability_${currentUser}`, JSON.stringify(availability));
        setAvailabilityDialogOpen(false);
        toast({
            title: "Availability Saved",
            description: "Your weekly schedule has been updated."
        });
    }
  }

  const handleDayActiveChange = (day: string, active: boolean) => {
    setAvailability(prev => ({
        ...prev,
        [day]: { ...prev[day], active }
    }));
  };

  const handleAddSlot = (day: string, time: string) => {
    if (!time) return;
    setAvailability(prev => {
        const newSlots = [...(prev[day]?.slots || []), { id: `slot-${Date.now()}`, time }];
        newSlots.sort((a, b) => a.time.localeCompare(b.time));
        return {
            ...prev,
            [day]: { ...(prev[day] || { active: true, slots: [] }), slots: newSlots }
        };
    });
  };

  const handleAddMultipleSlots = (day: string, startTime: string, endTime: string, duration: number) => {
    if (!startTime || !endTime || !duration) {
        toast({ title: "Missing Information", description: "Please provide start time, end time, and duration.", variant: "destructive"});
        return;
    }

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const newSlots: TimeSlot[] = [];

    let current = start;
    while(current < end) {
        newSlots.push({
            id: `slot-${day}-${current.getHours()}-${current.getMinutes()}`,
            time: current.toTimeString().substring(0, 5)
        });
        current = new Date(current.getTime() + duration * 60000);
    }
    
    setAvailability(prev => {
        const updatedSlots = [...(prev[day]?.slots || []), ...newSlots];
        // Remove duplicates and sort
        const uniqueSlots = Array.from(new Set(updatedSlots.map(s => s.time)))
                                .map(time => updatedSlots.find(s => s.time === time)!);
        uniqueSlots.sort((a, b) => a.time.localeCompare(b.time));
        
        return {
            ...prev,
            [day]: { ...(prev[day] || { active: true, slots: [] }), slots: uniqueSlots }
        };
    });
  };


  const handleRemoveSlot = (day: string, slotId: string) => {
    setAvailability(prev => ({
        ...prev,
        [day]: {
            ...prev[day],
            slots: (prev[day]?.slots || []).filter(slot => slot.id !== slotId)
        }
    }));
  };
  
  const today = new Date().toISOString().split('T')[0];
  const upcomingBookingsList = bookings.filter(b => b.date > today && b.status === 'Confirmed');
  const todaysMeetings = bookings.filter(b => b.date === today && b.status === 'Confirmed');
  const completedBookings = bookings.filter(b => b.status === 'Completed' || b.date < today);


  const BookingTable = ({ bookings, isToday = false, isCompleted = false }: { bookings: Booking[], isToday?: boolean, isCompleted?: boolean }) => (
    <div className="w-full overflow-x-auto">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bookings.length > 0 ? bookings.sort((a,b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()).map((booking) => (
                <TableRow key={booking.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                    <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                            <AvatarImage src={booking.avatar} alt={booking.clientName} />
                            <AvatarFallback>{booking.clientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{booking.clientName}</span>
                    </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{booking.service}</TableCell>
                    <TableCell className="whitespace-nowrap">{new Date(booking.date + 'T00:00:00').toLocaleDateString('en-AU', {day: '2-digit', month: 'short', year: 'numeric'})} at {new Date(`1970-01-01T${booking.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</TableCell>
                    <TableCell>
                    <Badge variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'Completed' ? 'secondary' : 'destructive'}>
                        {booking.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        {isToday && (
                            <div className="flex items-center justify-end gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <a href={booking.meetLink} target="_blank" rel="noopener noreferrer">
                                        <Video className="mr-2 h-4 w-4"/>
                                        Join Meeting
                                    </a>
                                </Button>
                                <Button variant="default" size="sm" onClick={() => handleCompleteBooking(booking.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4"/>
                                    Mark as Complete
                                </Button>
                            </div>
                        )}
                        {!isToday && !isCompleted && (
                            <Button asChild variant="outline" size="sm" disabled={booking.status !== 'Confirmed'}>
                                <a href={booking.meetLink} target="_blank" rel="noopener noreferrer">
                                    <Video className="mr-2 h-4 w-4"/>
                                    Join Meeting
                                </a>
                            </Button>
                        )}
                        {isCompleted && (
                            <Button variant="ghost" size="sm" disabled>
                            Completed
                            </Button>
                        )}
                    </TableCell>
                </TableRow>
                )) : (
                    <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No bookings found in this category.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Consultant Dashboard</h1>
          <p className="text-muted-foreground">Manage your consultations and availability.</p>
        </div>
         <Dialog open={isAvailabilityDialogOpen} onOpenChange={setAvailabilityDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <CalendarDays />
                    Set Availability
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Set Your Weekly Availability</DialogTitle>
                    <DialogDescription>
                        Define your specific time slots for each day. This will repeat weekly.
                    </DialogDescription>
                </DialogHeader>
                 <ScrollArea className="max-h-[70vh] w-full">
                    <Tabs defaultValue="Monday" className="w-full py-4 pr-4">
                        <TabsList className="flex-wrap h-auto">
                            {daysOfWeek.map(day => (
                                <TabsTrigger key={day} value={day}>{day.substring(0,3)}</TabsTrigger>
                            ))}
                        </TabsList>
                        {daysOfWeek.map(day => (
                            <TabsContent key={day} value={day}>
                                <div className="grid gap-6 pt-4">
                                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label>Available on {day}s</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Turn this on to accept bookings for this day.
                                            </p>
                                        </div>
                                        <Switch
                                            checked={availability[day]?.active}
                                            onCheckedChange={(checked) => handleDayActiveChange(day, checked)}
                                        />
                                    </div>
                                    {availability[day]?.active && (
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                    <Label>Slot Creation Mode:</Label>
                                                    <div className="flex items-center space-x-2">
                                                        <Button variant={creationModes[day] === 'multiple' ? 'secondary' : 'ghost'} size="sm" onClick={() => setCreationModes(prev => ({ ...prev, [day]: 'multiple'}))}>Multiple</Button>
                                                        <Button variant={creationModes[day] === 'single' ? 'secondary' : 'ghost'} size="sm" onClick={() => setCreationModes(prev => ({ ...prev, [day]: 'single'}))}>Single</Button>
                                                    </div>
                                                </div>

                                                {creationModes[day] === 'multiple' ? (
                                                    <form className="p-4 border rounded-lg space-y-4" onSubmit={(e) => {
                                                        e.preventDefault();
                                                        const formData = new FormData(e.currentTarget);
                                                        const startTime = formData.get('startTime') as string;
                                                        const endTime = formData.get('endTime') as string;
                                                        const duration = parseInt(formData.get('duration') as string, 10);
                                                        handleAddMultipleSlots(day, startTime, endTime, duration);
                                                    }}>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="grid gap-1.5">
                                                                <Label>Start Time</Label>
                                                                <Input name="startTime" type="time" className="bg-secondary" />
                                                            </div>
                                                            <div className="grid gap-1.5">
                                                                <Label>End Time</Label>
                                                                <Input name="endTime" type="time" className="bg-secondary" />
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-1.5">
                                                            <Label>Slot Duration</Label>
                                                            <Select name="duration" defaultValue="30">
                                                                <SelectTrigger className="bg-secondary">
                                                                    <SelectValue placeholder="Select duration" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="30">30 minutes</SelectItem>
                                                                    <SelectItem value="60">1 hour</SelectItem>
                                                                    <SelectItem value="90">1 hour 30 minutes</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <Button type="submit" size="sm" className="w-full">
                                                            <PlusCircle className="h-4 w-4 mr-2"/>
                                                            Generate Slots
                                                        </Button>
                                                    </form>
                                                ) : (
                                                    <form className="p-4 border rounded-lg flex items-end gap-2" onSubmit={(e) => {
                                                        e.preventDefault();
                                                        const timeInput = e.currentTarget.elements.namedItem('time') as HTMLInputElement;
                                                        handleAddSlot(day, timeInput.value);
                                                        timeInput.value = '';
                                                    }}>
                                                        <div className="grid gap-1.5 flex-grow">
                                                            <Label htmlFor={`time-${day}`}>Add Single Slot</Label>
                                                            <Input id={`time-${day}`} name="time" type="time" className="bg-secondary" />
                                                        </div>
                                                        <Button type="submit" size="sm">
                                                            <PlusCircle className="h-4 w-4 mr-2"/>
                                                            Add
                                                        </Button>
                                                    </form>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium mb-2 sticky top-0 bg-card/80 backdrop-blur-sm pb-2">Available Slots for {day}</h4>
                                                <ScrollArea className="h-60">
                                                    <div className="flex flex-wrap gap-2 pr-4">
                                                        {availability[day]?.slots && availability[day].slots.length > 0 ? availability[day].slots.map(slot => (
                                                            <div key={slot.id} className="flex items-center gap-2 bg-secondary rounded-md pl-3 pr-1 py-1">
                                                                <span className="text-sm">
                                                                    {new Date(`1970-01-01T${slot.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                                </span>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveSlot(day, slot.id)}>
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        )) : (
                                                            <p className="text-xs text-muted-foreground p-4 text-center w-full">No slots added for {day}. Use the form to add availability.</p>
                                                        )}
                                                    </div>
                                                </ScrollArea>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </ScrollArea>
                <DialogFooter>
                    <Button onClick={handleAvailabilitySave}>Save Availability</Button>
                </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>
            Manage all your scheduled and completed consultation sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Tabs defaultValue="today" className="w-full">
                <TabsList className="w-full sm:w-auto grid grid-cols-1 sm:grid-cols-3">
                    <TabsTrigger value="today">Today ({todaysMeetings.length})</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming ({upcomingBookingsList.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="today" className="pt-4">
                     <BookingTable bookings={todaysMeetings} isToday={true} />
                </TabsContent>
                <TabsContent value="upcoming" className="pt-4">
                    <BookingTable bookings={upcomingBookingsList} />
                </TabsContent>
                <TabsContent value="completed" className="pt-4">
                    <BookingTable bookings={completedBookings} isCompleted={true} />
                </TabsContent>
           </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

    
