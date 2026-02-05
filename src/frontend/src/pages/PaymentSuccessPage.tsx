import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">Payment Successful</CardTitle>
            <CardDescription className="text-base">
              Your payment has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-border bg-muted/30 p-6">
              <h3 className="mb-3 font-semibold">What Happens Next?</h3>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Your case will be reviewed by our team within 3-5 business days</li>
                <li>We'll analyze your situation and prepare recommendations</li>
                <li>You'll receive detailed guidance via email</li>
                <li>Check your case status anytime using your submission ID</li>
              </ol>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/payment-status">Check Case Status</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">Return to Home</Link>
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              A confirmation email has been sent to your registered email address.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
