
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BedDouble, Bath, PlusCircle, Search, User, Mail, Phone } from 'lucide-react';
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
import { useState, useEffect, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { type UserProfile } from '@/types';
import { type Accommodation } from '../accommodation-management/page';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


export type ViewingRequest = {
    id: string;
    accommodationId: string;
    accommodationTitle: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
};

export default function AccommodationPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [filters, setFilters] = useState({
    keyword: '',
    beds: 'any',
    baths: 'any',
  });
  const { toast } = useToast();
  const [selectedProperty, setSelectedProperty] = useState<Accommodation | null>(null);
  const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch('/api/accommodations');
        if (response.ok) {
          const data = await response.json();
          setAccommodations(data);
        } else {
          console.error('Failed to fetch accommodations');
        }
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      }
    };
    fetchAccommodations();

    const fetchUserProfile = async () => {
      const userEmail = 'guest@aussieassist.com';
      try {
        const profileResponse = await fetch(`/api/userprofiles/${encodeURIComponent(userEmail)}`);
        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          setCurrentUserProfile(userData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleRequestViewing = async (accommodation: Accommodation) => {
    if (!currentUserProfile?.firstName) {
      toast({
        title: "Please complete your profile",
        description: "You need to have a complete profile to request viewings.",
        variant: "destructive"
      });
      return;
    }

    const newRequest: ViewingRequest = {
        id: `VR-${Date.now()}`,
        accommodationId: accommodation.id,
        accommodationTitle: accommodation.title,
        userName: `${currentUserProfile.firstName} ${currentUserProfile.lastName}`,
        userEmail: currentUserProfile.email,
        userPhone: currentUserProfile.phone,
        status: 'Pending'
    };

    try {
      const response = await fetch('/api/viewingrequests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest),
      });
      if (response.ok) {
        toast({
            title: "Viewing Requested!",
            description: `Your request to view "${accommodation.title}" has been sent.`
        });
      } else {
        toast({ title: 'Error', description: 'Failed to request viewing.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error requesting viewing:', error);
      toast({ title: 'Error', description: 'Failed to request viewing.', variant: 'destructive' });
    }
  }
  
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({...prev, [name]: value}));
  }
  
  const handleViewDetails = (accommodation: Accommodation) => {
    setSelectedProperty(accommodation);
    setDetailDialogOpen(true);
  }

  const filteredAccommodations = useMemo(() => {
    return accommodations
      .filter(a => a.status === 'Available')
      .filter(a => {
        const keywordMatch = filters.keyword.toLowerCase() 
          ? a.title.toLowerCase().includes(filters.keyword.toLowerCase()) || 
            a.address.toLowerCase().includes(filters.keyword.toLowerCase())
          : true;
        const bedsMatch = filters.beds !== 'any' ? a.beds >= parseInt(filters.beds, 10) : true;
        const bathsMatch = filters.baths !== 'any' ? a.baths >= parseInt(filters.baths, 10) : true;

        return keywordMatch && bedsMatch && bathsMatch;
      })
  }, [accommodations, filters]);


  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Accommodation Marketplace</h1>
            <p className="text-muted-foreground">Find your next home in Australia.</p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2 grid gap-2">
              <Label htmlFor="keyword">Search by Keyword</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="keyword"
                  name="keyword"
                  placeholder="e.g., 'Sydney', 'Modern', 'Spacious'"
                  className="pl-10"
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="beds">Min. Beds</Label>
              <Select name="beds" value={filters.beds} onValueChange={(value) => handleFilterChange('beds', value)}>
                  <SelectTrigger id="beds">
                      <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="baths">Min. Baths</Label>
               <Select name="baths" value={filters.baths} onValueChange={(value) => handleFilterChange('baths', value)}>
                  <SelectTrigger id="baths">
                      <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAccommodations.map((item) => (
          <Card key={item.id} className="shadow-md flex flex-col">
            <div className="relative aspect-video">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="rounded-t-lg object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <CardDescription>{item.address}</CardDescription>
              <CardDescription className="pt-2">Listed by: {item.ownerName}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 flex-grow">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">${item.price}</span>
                <span className="text-sm text-muted-foreground">/{item.period}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" />
                  <span>{item.beds} beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>{item.baths} baths</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2">
              <Button className="w-full" onClick={() => handleRequestViewing(item)}>Request Viewing</Button>
              <Button className="w-full" variant="outline" onClick={() => handleViewDetails(item)}>View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

       <Dialog open={isDetailDialogOpen} onOpenChange={setDetailDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedProperty?.title}</DialogTitle>
                    <DialogDescription>{selectedProperty?.address}</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <h3 className="font-semibold">Owner Contact Details</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedProperty?.ownerName}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                             <a href={`mailto:${selectedProperty?.ownerEmail}`} className="text-primary hover:underline">
                                {selectedProperty?.ownerEmail}
                            </a>
                        </div>
                         <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${selectedProperty?.ownerPhone}`} className="text-primary hover:underline">
                                {selectedProperty?.ownerPhone}
                            </a>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground pt-4">Contact the owner to discuss details or arrange a private viewing.</p>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}
