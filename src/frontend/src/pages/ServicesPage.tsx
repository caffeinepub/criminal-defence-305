import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      title: 'Case Review & Analysis',
      description: 'Comprehensive review of your case details and circumstances',
      features: [
        'Detailed case assessment',
        'Identification of potential legal issues',
        'Review of arrest and detention records',
        'Analysis of evidence and documentation',
      ],
    },
    {
      title: 'Legal Guidance',
      description: 'Professional guidance on your legal options and next steps',
      features: [
        'Explanation of your rights',
        'Overview of legal procedures',
        'Guidance on court processes',
        'Recommendations for next steps',
      ],
    },
    {
      title: 'Document Preparation',
      description: 'Assistance with preparing necessary legal documents',
      features: [
        'Help with filing paperwork',
        'Document organization',
        'Form completion assistance',
        'Record gathering support',
      ],
    },
    {
      title: 'Referral Services',
      description: 'Connections to additional legal resources when needed',
      features: [
        'Attorney referrals',
        'Legal aid organization connections',
        'Court resource information',
        'Support service referrals',
      ],
    },
  ];

  return (
    <div className="container py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Our Services</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive criminal defense assistance at affordable rates
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {services.map((service, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-2xl">{service.title}</CardTitle>
              <CardDescription className="text-base">{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border bg-muted/30 p-8">
        <h2 className="mb-4 text-2xl font-bold">Important Notice</h2>
        <p className="text-muted-foreground">
          Criminal Defence 305 provides assistance and guidance but does not constitute legal representation or legal advice. We are not a law firm and do not replace the need for a licensed attorney. For specific legal advice regarding your case, please consult with a qualified attorney licensed to practice in your jurisdiction.
        </p>
      </div>
    </div>
  );
}
