
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type CommunityEvent } from '@/app/(app)/event-management/page';

export default function EventsPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Community Events</h1>
        <p className="text-muted-foreground">
          Get involved and meet new people.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="shadow-md flex flex-col">
            <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow grid gap-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
