
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
import { useState, useEffect } from 'react';
import { type LoanApplication } from '@/app/(app)/loan-application/page';
import { Badge } from '@/components/ui/badge';

export default function LoanApplicationManagementPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);

  useEffect(() => {
    const storedApplications = localStorage.getItem('loanApplications');
    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    }
  }, []);


  return (
    <div className="flex flex-col gap-8">
       <div>
        <h1 className="text-3xl font-bold font-headline">Loan Application Management</h1>
        <p className="text-muted-foreground">
          View all submitted loan applications for your reference.
        </p>
      </div>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Submitted Loan Applications</CardTitle>
            <CardDescription>
              This is a view-only list of all loan applications. No actions can be taken from this screen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Loan Amount</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length > 0 ? (
                  applications
                    .map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">
                            {req.profile.firstName} {req.profile.lastName}
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span>{req.profile.email}</span>
                                <span className="text-muted-foreground">{req.profile.phone}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                          ${parseInt(req.loanAmount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {req.loanPurpose}
                        </TableCell>
                         <TableCell>
                          <Badge variant="secondary">{req.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No loan applications submitted yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
