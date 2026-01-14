
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Plane, Home, Car, TrendingUp } from 'lucide-react';


const stats = [
  { title: 'Total Users', value: '1,250', icon: Users, change: '+15.2%' },
  { title: 'Pickup Requests', value: '82', icon: Plane, change: '+22 pending' },
  { title: 'Accommodations', value: '45', icon: Home, change: '+5 pending' },
  { title: 'Listed Vehicles', value: '120', icon: Car, change: '+10 new' },
];


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, Admin!</h1>
        <p className="text-muted-foreground">
          Here's a summary of your platform's activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
