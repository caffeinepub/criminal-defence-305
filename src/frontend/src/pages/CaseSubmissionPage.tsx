import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateCase } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentMethod } from '../backend';

export default function CaseSubmissionPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const createCase = useCreateCase();

  const [details, setDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.card);

  const isAuthenticated = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!details.trim()) {
      toast.error('Please provide case details');
      return;
    }

    try {
      const submissionId = await createCase.mutateAsync({
        details,
        paymentMethod,
      });
      
      toast.success('Case submitted successfully');
      navigate({ 
        to: '/case-confirmation', 
        search: { submissionId } 
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit case');
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              You must be logged in to submit a case. Please login using the button in the header.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Submit Your Case</h1>
          <p className="text-lg text-muted-foreground">
            Provide details about your situation so we can help you
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Case Information</CardTitle>
            <CardDescription>
              Please provide as much detail as possible about your case
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="details">Case Details *</Label>
                <Textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe your situation, including dates, locations, and any relevant details about your arrest or imprisonment..."
                  className="min-h-[200px]"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Include information about your arrest, charges, imprisonment, and why you believe it was unlawful
                </p>
              </div>

              <div className="space-y-3">
                <Label>Payment Method *</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={PaymentMethod.card} id="card" />
                    <Label htmlFor="card" className="font-normal">
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={PaymentMethod.paypal} id="paypal" />
                    <Label htmlFor="paypal" className="font-normal">
                      PayPal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={PaymentMethod.cashapp} id="cashapp" />
                    <Label htmlFor="cashapp" className="font-normal">
                      Cash App
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={PaymentMethod.inPersonCash} id="cash" />
                    <Label htmlFor="cash" className="font-normal">
                      Cash at Approved Store
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  After submitting your case, you'll be directed to complete payment using your selected method.
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full" disabled={createCase.isPending}>
                {createCase.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Case'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
