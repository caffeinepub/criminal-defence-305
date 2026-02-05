import { useIsCallerAdmin, useGetAllSubmissions } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { SubmissionStatus } from '../backend';
import PaymentSetup from '../components/stripe/PaymentSetup';

export default function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: submissions, isLoading: submissionsLoading } = useGetAllSubmissions();

  if (adminLoading) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: SubmissionStatus) => {
    const statusMap = {
      [SubmissionStatus.pendingPayment]: { label: 'Pending Payment', variant: 'secondary' as const },
      [SubmissionStatus.paid]: { label: 'Paid', variant: 'default' as const },
      [SubmissionStatus.processing]: { label: 'Processing', variant: 'default' as const },
      [SubmissionStatus.completed]: { label: 'Completed', variant: 'default' as const },
      [SubmissionStatus.failed]: { label: 'Failed', variant: 'destructive' as const },
    };
    const config = statusMap[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container py-16">
      <PaymentSetup />
      
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Manage case submissions and system configuration
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Case Submissions</CardTitle>
          <CardDescription>
            {submissions?.length || 0} total submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : submissions && submissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-mono text-xs">{submission.id.slice(0, 8)}...</TableCell>
                    <TableCell>{formatDate(submission.timestamp)}</TableCell>
                    <TableCell className="capitalize">
                      {submission.paymentMethod.replace('inPersonCash', 'Cash at Store')}
                    </TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {submission.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-8 text-center text-muted-foreground">No submissions yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
