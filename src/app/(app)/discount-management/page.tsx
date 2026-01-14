
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

export type Discount = {
    id: string;
    vendorName: string;
    offerDetails: string;
    expiryDate: string;
};

const defaultDiscounts: Discount[] = [
    { id: 'DISC001', vendorName: 'Bombay Talkies', offerDetails: '10% off bill > $50', expiryDate: '2024-12-31' },
    { id: 'DISC002', vendorName: 'Aussie Grains', offerDetails: 'Free coffee with any breakfast meal', expiryDate: '2024-10-31' },
];

export default function DiscountManagementPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const storedDiscounts = localStorage.getItem('discounts');
    if (storedDiscounts) {
      setDiscounts(JSON.parse(storedDiscounts));
    } else {
        setDiscounts(defaultDiscounts);
        localStorage.setItem('discounts', JSON.stringify(defaultDiscounts));
    }
  }, []);

  const handleCreateDiscount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newDiscount: Discount = {
      id: `DISC-${Date.now()}`,
      vendorName: formData.get('vendorName') as string,
      offerDetails: formData.get('offerDetails') as string,
      expiryDate: formData.get('expiryDate') as string,
    };

    const updatedDiscounts = [...discounts, newDiscount];
    setDiscounts(updatedDiscounts);
    localStorage.setItem('discounts', JSON.stringify(updatedDiscounts));
    setDialogOpen(false);
  };


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Discount Management</h1>
        <p className="text-muted-foreground">
          Create and manage all partner discounts.
        </p>
      </div>

       <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>All Discounts</CardTitle>
                <CardDescription>
                    An overview of all active and upcoming discounts.
                </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                    <PlusCircle />
                    Create Offer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Discount Offer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateDiscount}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="vendorName" className="text-right">
                        Vendor Name
                      </Label>
                      <Input id="vendorName" name="vendorName" className="col-span-3 bg-secondary" required />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="offerDetails" className="text-right">
                        Offer Details
                      </Label>
                      <Textarea id="offerDetails" name="offerDetails" className="col-span-3 bg-secondary" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="expiryDate" className="text-right">
                        Expiry Date
                      </Label>
                      <Input id="expiryDate" name="expiryDate" type="date" className="col-span-3 bg-secondary" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Offer</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Offer Details</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell>
                      <div className="font-medium">{discount.vendorName}</div>
                    </TableCell>
                    <TableCell>{discount.offerDetails}</TableCell>
                    <TableCell>{discount.expiryDate}</TableCell>
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
