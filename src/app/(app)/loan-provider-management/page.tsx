
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export type LoanProvider = {
  id: string;
  name: string;
  email: string;
  contactPerson: string;
  status: 'Active' | 'Inactive';
};

const defaultProviders: LoanProvider[] = [
    { id: 'PROV001', name: 'Aussie Finance Group', email: 'contact@aussiefinance.com', contactPerson: 'John Smith', status: 'Active' },
    { id: 'PROV002', name: 'SecureLend Australia', email: 'support@securelend.au', contactPerson: 'Jane Doe', status: 'Inactive' },
];

export default function LoanProviderManagementPage() {
  const [providers, setProviders] = useState<LoanProvider[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedProviders = localStorage.getItem('loanProviders');
    if (storedProviders) {
      setProviders(JSON.parse(storedProviders));
    } else {
        setProviders(defaultProviders);
        localStorage.setItem('loanProviders', JSON.stringify(defaultProviders));
    }
  }, []);

  const handleCreateProvider = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newProvider: LoanProvider = {
      id: `PROV-${Date.now()}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      contactPerson: formData.get('contactPerson') as string,
      status: 'Active',
    };

    const updatedProviders = [...providers, newProvider];
    setProviders(updatedProviders);
    localStorage.setItem('loanProviders', JSON.stringify(updatedProviders));
    setDialogOpen(false);
    toast({ title: 'Provider Created', description: `${newProvider.name} has been added.` });
  };
  
  const handleStatusChange = (providerId: string, newStatus: LoanProvider['status']) => {
    const updatedProviders = providers.map(p => 
        p.id === providerId ? { ...p, status: newStatus } : p
    );
    setProviders(updatedProviders);
    localStorage.setItem('loanProviders', JSON.stringify(updatedProviders));
    toast({
        title: "Status Updated",
        description: `Provider status changed to ${newStatus}.`
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Loan Provider Management</h1>
        <p className="text-muted-foreground">
          Create and manage all loan providers.
        </p>
      </div>

       <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>All Loan Providers</CardTitle>
                <CardDescription>
                    An overview of all loan providers on the platform.
                </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                    <PlusCircle />
                    Create Provider
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Loan Provider</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateProvider}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Provider Name
                      </Label>
                      <Input id="name" name="name" className="col-span-3 bg-secondary" required />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Provider Email
                      </Label>
                      <Input id="email" name="email" type="email" className="col-span-3 bg-secondary" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contactPerson" className="text-right">
                        Contact Person
                      </Label>
                      <Input id="contactPerson" name="contactPerson" className="col-span-3 bg-secondary" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Provider</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact Person</TableHead>
                   <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div className="font-medium">{provider.name}</div>
                    </TableCell>
                    <TableCell>{provider.email}</TableCell>
                    <TableCell>{provider.contactPerson}</TableCell>
                    <TableCell>
                      <Badge variant={provider.status === 'Active' ? 'default' : 'secondary'}>
                        {provider.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusChange(provider.id, 'Active')}>
                              Mark as Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(provider.id, 'Inactive')}>
                              Mark as Inactive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
