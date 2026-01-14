
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type Job } from '@/app/(app)/job-management/page';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          console.error('Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Job Board</h1>
        <p className="text-muted-foreground">
          Find part-time and full-time opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id} className="shadow-md flex flex-col">
            <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground text-sm pt-1">
                    <Building className="h-4 w-4" />
                    <span>{job.company}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow grid gap-2">
               <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                {job.tags.split(',').map(tag => (
                    <Badge key={tag} variant="secondary">{tag.trim()}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleApply(job.applyUrl)}>Apply Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
