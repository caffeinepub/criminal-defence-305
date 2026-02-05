import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Smartphone, DollarSign, Store } from 'lucide-react';
import { PaymentMethod } from '../backend';

export default function PaymentsPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { submissionId?: string };
  const submissionId = search.submissionId;

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    if (!submissionId) {
      navigate({ to: '/payment-status' });
      return;
    }

    switch (method) {
      case PaymentMethod.card:
        navigate({ to: '/card-checkout', search: { submissionId } });
        break;
      case PaymentMethod.paypal:
        navigate({ to: '/paypal-instructions', search: { submissionId } });
        break;
      case PaymentMethod.cashapp:
        navigate({ to: '/cashapp-instructions', search: { submissionId } });
        break;
      case PaymentMethod.inPersonCash:
        navigate({ to: '/cash-store-receipt', search: { submissionId } });
        break;
    }
  };

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Payment Options</h1>
          <p className="text-lg text-muted-foreground">
            Choose your preferred payment method to complete your case submission
          </p>
          {submissionId && (
            <p className="mt-2 text-sm text-muted-foreground">
              Submission ID: <code className="font-mono font-semibold">{submissionId}</code>
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="cursor-pointer transition-all hover:border-primary" onClick={() => handlePaymentMethodSelect(PaymentMethod.card)}>
            <CardHeader>
              <CreditCard className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Credit/Debit Card</CardTitle>
              <CardDescription>
                Pay securely with your credit or debit card through Stripe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Pay with Card</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:border-primary" onClick={() => handlePaymentMethodSelect(PaymentMethod.paypal)}>
            <CardHeader>
              <Smartphone className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>PayPal</CardTitle>
              <CardDescription>
                Send payment via PayPal and submit your transaction ID
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Pay with PayPal</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:border-primary" onClick={() => handlePaymentMethodSelect(PaymentMethod.cashapp)}>
            <CardHeader>
              <DollarSign className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Cash App</CardTitle>
              <CardDescription>
                Send payment via Cash App and submit your username
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Pay with Cash App</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:border-primary" onClick={() => handlePaymentMethodSelect(PaymentMethod.inPersonCash)}>
            <CardHeader>
              <Store className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Cash at Store</CardTitle>
              <CardDescription>
                Get a payment code to pay cash at approved retail locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Get Payment Code</Button>
            </CardContent>
          </Card>
        </div>

        {!submissionId && (
          <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6 text-center">
            <p className="text-muted-foreground">
              Don't have a submission ID? You can check your case status or submit a new case.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="outline" onClick={() => navigate({ to: '/payment-status' })}>
                Check Status
              </Button>
              <Button onClick={() => navigate({ to: '/case-submission' })}>
                Submit New Case
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
