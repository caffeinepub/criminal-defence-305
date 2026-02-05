import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useGetSubmission, useSubmitPaymentReference } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, Printer, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { ReferenceType } from '../backend';

export default function CashAtStoreReceiptPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { submissionId?: string };
  const submissionId = search.submissionId;
  const { data: submission, isLoading } = useGetSubmission(submissionId || null);
  const submitReference = useSubmitPaymentReference();

  const [paymentCode, setPaymentCode] = useState('');

  useEffect(() => {
    if (submissionId) {
      const code = `CD305-${submissionId.slice(0, 8).toUpperCase()}`;
      setPaymentCode(code);
    }
  }, [submissionId]);

  const handlePrint = () => {
    window.print();
  };

  const handleMarkAsPaid = async () => {
    if (!submissionId) {
      toast.error('No submission ID found');
      return;
    }

    try {
      await submitReference.mutateAsync({
        submissionId,
        referenceType: ReferenceType.storePaymentCode,
        referenceValue: paymentCode,
      });
      
      toast.success('Payment marked as completed');
      navigate({ to: '/payment-status' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark payment as completed');
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

  if (isLoading) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const formatDate = (timestamp?: bigint) => {
    if (!timestamp) return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <div className="mb-8 text-center print:hidden">
          <h1 className="mb-4 text-4xl font-bold">Cash Payment Receipt</h1>
          <p className="text-lg text-muted-foreground">
            Present this receipt at an approved store to complete your payment
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Criminal Defence 305</CardTitle>
            <CardDescription>Payment Receipt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="mb-2 text-sm font-medium text-muted-foreground">Payment Code</div>
              <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
                <code className="text-3xl font-bold tracking-wider">{paymentCode}</code>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Submission ID:</span>
                <code className="text-sm font-mono font-semibold">{submissionId}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount Due:</span>
                <span className="text-sm font-semibold">$99.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm">{formatDate(submission?.timestamp)}</span>
              </div>
            </div>

            <Separator />

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="mb-2 font-semibold">Payment Instructions:</h3>
              <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Print or save this receipt</li>
                <li>Visit an approved retail location</li>
                <li>Present this payment code to the cashier</li>
                <li>Pay $99.00 in cash</li>
                <li>Keep your receipt as proof of payment</li>
              </ol>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="mb-2 font-semibold">Approved Store Locations:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Miami Central - 123 Main St, Miami, FL</li>
                <li>• Downtown Branch - 456 Ocean Dr, Miami, FL</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 print:hidden">
              <Button onClick={handlePrint} variant="outline" className="w-full">
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button onClick={handleMarkAsPaid} className="w-full" disabled={submitReference.isPending}>
                {submitReference.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    I Have Paid
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground print:hidden">
              Click "I Have Paid" after completing your payment at the store
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
