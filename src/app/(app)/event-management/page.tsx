
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
import { Textarea } from '@/components/ui/textarea';

export type CommunityEvent = {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
};

const defaultEvents: CommunityEvent[] = [
    { id: 'EVT001', title: 'Diwali Celebration 2024', description: 'Join us for a festival of lights, food, and music.', date: '2024-11-01', time: '6:00 PM', location: 'Parramatta Park' },
    { id: 'EVT002', title: 'Migrant Job Fair', description: 'Connect with employers looking for diverse talent.', date: '2024-09-20', time: '10:00 AM', location: 'Sydney Town Hall' },
];

export default function EventManagementPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
        setEvents(defaultEvents);
        localStorage.setItem('events', JSON.stringify(defaultEvents));
    }
  }, []);

  const handleCreateEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newEvent: CommunityEvent = {
      id: `EVT-${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      location: formData.get('location') as string,
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setDialogOpen(false);
  };


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Event Management</h1>
        <p className="text-muted-foreground">
          Create and manage all community events.
        </p>
      </div>

       <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>All Events</CardTitle>
                <CardDescription>
                    An overview of all past and upcoming community events.
                </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                    <PlusCircle />
                    Create Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Community Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateEvent}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input id="title" name="title" className="col-span-3 bg-secondary" required />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea id="description" name="description" className="col-span-3 bg-secondary" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input id="date" name="date" type="date" className="col-span-3 bg-secondary" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="time" className="text-right">
                        Time
                      </Label>
                      <Input id="time" name="time" type="time" className="col-span-3 bg-secondary" required />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Location
                      </Label>
                      <Input id="location" name="location" className="col-span-3 bg-secondary" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Event</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Title</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="font-medium">{event.title}</div>
                    </TableCell>
                    <TableCell>{event.date} at {event.time}</TableCell>
                    <TableCell>{event.location}</TableCell>
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
