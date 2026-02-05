import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, FileText, Scale } from 'lucide-react';
import { toast } from 'sonner';

export default function CaseSubmissionConfirmationPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { submissionId?: string };
  const submissionId = search.submissionId;

  const copyToClipboard = () => {
    if (submissionId) {
      navigator.clipboard.writeText(submissionId);
      toast.success('Submission ID copied to clipboard');
    }
  };

  if (!submissionId) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>No Submission Found</CardTitle>
            <CardDescription>
              Please submit a case first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/case-submission' })}>
              Submit a Case
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">Case Submitted Successfully</CardTitle>
            <CardDescription className="text-base">
              Your case has been received and will be reviewed by our team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Your Submission ID</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-lg font-mono font-semibold">{submissionId}</code>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Save this ID to check your case status later
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Next Steps:</h3>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Complete payment using your selected payment method</li>
                <li>Upload any supporting documents for your case</li>
                <li>Our team will review your case within 3-5 business days</li>
                <li>Access draft motions and legal references to support your case</li>
              </ol>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                onClick={() => navigate({ to: `/submissions/${submissionId}/documents` })}
              >
                <FileText className="mr-2 h-4 w-4" />
                Upload Documents
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: `/submissions/${submissionId}/draft-motions` })}
              >
                <Scale className="mr-2 h-4 w-4" />
                Draft Motions
              </Button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button 
                className="flex-1" 
                onClick={() => navigate({ to: '/payments', search: { submissionId } })}
              >
                Proceed to Payment
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate({ to: '/payment-status' })}
              >
                Check Status Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
