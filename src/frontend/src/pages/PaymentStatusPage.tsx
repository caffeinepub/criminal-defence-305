import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetSubmission } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, FileText, Scale } from 'lucide-react';
import { SubmissionStatus } from '../backend';

export default function PaymentStatusPage() {
  const navigate = useNavigate();
  const [submissionId, setSubmissionId] = useState('');
  const [searchId, setSearchId] = useState<string | null>(null);

  const { data: submission, isLoading, error } = useGetSubmission(searchId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionId.trim()) {
      setSearchId(submissionId.trim());
    }
  };

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Check Case Status</h1>
          <p className="text-lg text-muted-foreground">
            Enter your submission ID to view your case status
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Submission ID Lookup</CardTitle>
            <CardDescription>
              Enter the submission ID you received when you submitted your case
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="submissionId">Submission ID</Label>
                <Input
                  id="submissionId"
                  value={submissionId}
                  onChange={(e) => setSubmissionId(e.target.value)}
                  placeholder="Enter your submission ID"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Check Status
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Unable to find a submission with that ID. Please check the ID and try again.
              </p>
            </CardContent>
          </Card>
        )}

        {submission && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Case Status</CardTitle>
                    <CardDescription>Submission ID: {submission.id}</CardDescription>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-sm">{formatDate(submission.timestamp)}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p className="text-sm capitalize">{submission.paymentMethod.replace('inPersonCash', 'Cash at Store')}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Case Details</p>
                  <p className="text-sm text-muted-foreground">{submission.details}</p>
                </div>

                {submission.status === SubmissionStatus.pendingPayment && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm font-medium">Action Required</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Please complete payment to begin case review.
                    </p>
                  </div>
                )}

                {submission.status === SubmissionStatus.processing && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm font-medium">In Progress</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your case is being reviewed. We'll update the status once the review is complete.
                    </p>
                  </div>
                )}

                {submission.status === SubmissionStatus.completed && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm font-medium">Review Complete</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your case review is complete. Check your email for detailed guidance.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                onClick={() => navigate({ to: `/submissions/${submission.id}/documents` })}
              >
                <FileText className="mr-2 h-4 w-4" />
                View Documents
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: `/submissions/${submission.id}/draft-motions` })}
              >
                <Scale className="mr-2 h-4 w-4" />
                Draft Motions
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
