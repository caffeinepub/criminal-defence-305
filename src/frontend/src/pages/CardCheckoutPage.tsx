import { useEffect, useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useCreateCheckoutSession } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import PaymentSetup from '../components/stripe/PaymentSetup';

export default function CardCheckoutPage() {
  const search = useSearch({ strict: false }) as { submissionId?: string };
  const submissionId = search.submissionId;
  const createCheckoutSession = useCreateCheckoutSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!submissionId) {
      toast.error('No submission ID found');
      return;
    }

    setIsProcessing(true);
    try {
      const items = [
        {
          productName: 'Criminal Defense Case Review',
          productDescription: `Case review service for submission ${submissionId}`,
          priceInCents: BigInt(9900),
          currency: 'usd',
          quantity: BigInt(1),
        },
      ];

      const session = await createCheckoutSession.mutateAsync(items);
      
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      window.location.href = session.url;
    } catch (error: any) {
      setIsProcessing(false);
      toast.error(error.message || 'Failed to create checkout session');
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
      <PaymentSetup />
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Card Payment</h1>
          <p className="text-lg text-muted-foreground">
            Complete your payment securely with Stripe
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Submission ID: <code className="font-mono font-semibold">{submissionId}</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-border bg-muted/30 p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-medium">Criminal Defense Case Review</span>
                <span className="text-2xl font-bold">$99.00</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Includes comprehensive case review, legal guidance, and recommendations
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">What's Included:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Detailed case assessment and analysis</li>
                <li>• Professional legal guidance</li>
                <li>• Recommendations for next steps</li>
                <li>• Document preparation assistance</li>
                <li>• Referral services when needed</li>
              </ul>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCheckout}
              disabled={isProcessing || createCheckoutSession.isPending}
            >
              {isProcessing || createCheckoutSession.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay $99.00 with Card
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Secure payment powered by Stripe. Your payment information is encrypted and secure.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
