import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useSubmitPaymentReference } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { ReferenceType } from '../backend';

export default function PayPalInstructionsPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { submissionId?: string };
  const submissionId = search.submissionId;
  const submitReference = useSubmitPaymentReference();

  const [transactionId, setTransactionId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!submissionId) {
      toast.error('No submission ID found');
      return;
    }

    if (!transactionId.trim()) {
      toast.error('Please enter your PayPal transaction ID');
      return;
    }

    try {
      await submitReference.mutateAsync({
        submissionId,
        referenceType: ReferenceType.paypalTransactionId,
        referenceValue: transactionId,
      });
      
      toast.success('Payment reference submitted successfully');
      navigate({ to: '/payment-status' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit payment reference');
      console.error(error);
    }
  };

  if (!submissionId) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Missing Submission ID</CardTitle>
            <CardDescription>
              Please submit a case first before proceeding to payment.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">PayPal Payment Instructions</h1>
          <p className="text-lg text-muted-foreground">
            Follow these steps to complete your payment via PayPal
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Instructions</CardTitle>
            <CardDescription>
              Submission ID: <code className="font-mono font-semibold">{submissionId}</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-6">
              <h3 className="mb-3 font-semibold">Step 1: Send Payment</h3>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Log in to your PayPal account</li>
                <li>Send <strong className="text-foreground">$99.00 USD</strong> to: <strong className="text-foreground">payments@criminaldefence305.com</strong></li>
                <li>In the note field, include your submission ID: <code className="font-mono">{submissionId}</code></li>
                <li>Complete the payment</li>
              </ol>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-6">
              <h3 className="mb-3 font-semibold">Step 2: Submit Transaction ID</h3>
              <p className="text-sm text-muted-foreground">
                After completing the payment, enter your PayPal transaction ID below. You can find this in your PayPal transaction history.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submit Transaction ID</CardTitle>
            <CardDescription>
              Enter your PayPal transaction ID to confirm payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transactionId">PayPal Transaction ID</Label>
                <Input
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g., 1AB23456CD789012E"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  This is typically a 17-character code found in your PayPal transaction details
                </p>
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Once submitted, we'll verify your payment and begin reviewing your case
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full" disabled={submitReference.isPending}>
                {submitReference.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Transaction ID'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
