import { useEffect, useState } from 'react';
import { useIsStripeConfigured, useSetStripeConfiguration, useIsCallerAdmin } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSetup() {
  const { data: isConfigured, isLoading: configLoading } = useIsStripeConfigured();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const setConfig = useSetStripeConfiguration();

  const [showSetup, setShowSetup] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [allowedCountries, setAllowedCountries] = useState('US,CA,GB');

  useEffect(() => {
    if (!configLoading && !adminLoading && isAdmin && !isConfigured) {
      setShowSetup(true);
    }
  }, [isConfigured, isAdmin, configLoading, adminLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!secretKey.trim()) {
      toast.error('Please enter your Stripe secret key');
      return;
    }

    const countries = allowedCountries.split(',').map(c => c.trim()).filter(c => c);
    if (countries.length === 0) {
      toast.error('Please enter at least one country code');
      return;
    }

    try {
      await setConfig.mutateAsync({
        secretKey: secretKey.trim(),
        allowedCountries: countries,
      });
      
      toast.success('Stripe configuration saved successfully');
      setShowSetup(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save Stripe configuration');
      console.error(error);
    }
  };

  if (configLoading || adminLoading || !isAdmin) {
    return null;
  }

  return (
    <Dialog open={showSetup} onOpenChange={setShowSetup}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Configure Stripe Payment</DialogTitle>
          <DialogDescription>
            Enter your Stripe credentials to enable card payments
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Card payments require Stripe configuration. Get your API keys from the Stripe Dashboard.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="secretKey">Stripe Secret Key</Label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_test_..."
              required
            />
            <p className="text-sm text-muted-foreground">
              Your Stripe secret key (starts with sk_test_ or sk_live_)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="countries">Allowed Countries</Label>
            <Input
              id="countries"
              value={allowedCountries}
              onChange={(e) => setAllowedCountries(e.target.value)}
              placeholder="US,CA,GB"
              required
            />
            <p className="text-sm text-muted-foreground">
              Comma-separated country codes (e.g., US,CA,GB)
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={setConfig.isPending}>
            {setConfig.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Configuration'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
