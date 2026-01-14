
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
import { Ticket, QrCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type Discount } from '@/app/(app)/discount-management/page';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  
  useEffect(() => {
    const storedDiscounts = localStorage.getItem('discounts');
    if (storedDiscounts) {
      setDiscounts(JSON.parse(storedDiscounts));
    }
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Partner Discounts</h1>
        <p className="text-muted-foreground">
          Exclusive offers from our partners.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {discounts.map((discount) => (
          <Card key={discount.id} className="shadow-md flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                    <CardTitle>{discount.vendorName}</CardTitle>
                    <CardDescription>Expires: {new Date(discount.expiryDate).toLocaleDateString()}</CardDescription>
                </div>
                <Ticket className="text-primary"/>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-lg font-semibold">{discount.offerDetails}</p>
            </CardContent>
            <CardFooter>
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full">
                            <QrCode className="mr-2"/>
                            Claim Offer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xs">
                        <DialogHeader>
                        <DialogTitle>Claim Your Discount</DialogTitle>
                        <DialogDescription>
                            Show this QR code to the vendor to redeem your offer.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center p-4">
                            {/* In a real app, a QR code generation library would be used here */}
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DISC_${discount.id}`} alt="QR Code" />
                        </div>
                    </DialogContent>
                </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
