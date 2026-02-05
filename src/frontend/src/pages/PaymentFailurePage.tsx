import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <Card className="border-destructive/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-3xl">Payment Cancelled</CardTitle>
            <CardDescription className="text-base">
              Your payment was not completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-border bg-muted/30 p-6">
              <p className="text-sm text-muted-foreground">
                Your payment was cancelled or failed to process. No charges have been made to your account. You can try again or choose a different payment method.
              </p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/payments">Try Again</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/payment-status">Check Case Status</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/">Return to Home</Link>
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Need help? Contact our support team for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
