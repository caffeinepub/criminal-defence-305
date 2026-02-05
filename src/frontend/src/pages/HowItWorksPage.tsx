import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { FileText, CreditCard, Search, CheckCircle } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: FileText,
      title: 'Submit Your Case',
      description: 'Create an account and provide details about your situation. Include relevant information about your case, arrest, or imprisonment.',
      action: 'Start by submitting your case details through our secure online form.',
    },
    {
      icon: CreditCard,
      title: 'Choose Payment Method',
      description: 'Select from multiple payment options including credit/debit card, PayPal, Cash App, or cash payment at approved stores.',
      action: 'Complete payment using your preferred method to begin the review process.',
    },
    {
      icon: Search,
      title: 'Case Review',
      description: 'Our team reviews your case details and assesses your situation. We analyze the information you provided and identify potential issues.',
      action: 'We typically complete initial reviews within 3-5 business days.',
    },
    {
      icon: CheckCircle,
      title: 'Receive Guidance',
      description: 'Get professional guidance on your legal options, next steps, and recommendations. We provide clear explanations and actionable advice.',
      action: 'Access your case status and guidance through your secure account.',
    },
  ];

  return (
    <div className="container py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">How It Works</h1>
        <p className="text-lg text-muted-foreground">
          Getting help is simple. Follow these four easy steps to get started.
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-sm font-medium text-muted-foreground">
                      Step {index + 1}
                    </div>
                    <CardTitle className="text-2xl">{step.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-20">
                <CardDescription className="mb-3 text-base">{step.description}</CardDescription>
                <p className="text-sm font-medium">{step.action}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Ready to Begin?</h2>
        <p className="mb-6 text-muted-foreground">
          Start your case submission now and take the first step toward getting help
        </p>
        <Button asChild size="lg">
          <Link to="/case-submission">Submit Your Case</Link>
        </Button>
      </div>

      <div className="mt-12 rounded-lg border border-border bg-muted/30 p-8">
        <h3 className="mb-4 text-xl font-bold">What to Prepare</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Details about your arrest or imprisonment</li>
          <li>• Dates and locations of relevant events</li>
          <li>• Names of involved parties (if known)</li>
          <li>• Any documentation you have (case numbers, court documents, etc.)</li>
          <li>• Your contact information for follow-up</li>
        </ul>
      </div>
    </div>
  );
}
