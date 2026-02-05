import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Shield, DollarSign, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background">
        <div className="container py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Affordable Criminal Defense Assistance
              </h1>
              <p className="text-lg text-muted-foreground">
                If you believe you were unlawfully imprisoned or need criminal defense help, Criminal Defence 305 offers low-cost assistance to help you navigate the legal system.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to="/case-submission">Submit Your Case</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/how-it-works">Learn How It Works</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/assets/generated/cd305-hero.dim_1600x600.png"
                alt="Criminal Defence 305"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Why Choose Criminal Defence 305?</h2>
          <p className="text-lg text-muted-foreground">
            We're committed to making legal assistance accessible and affordable
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <Scale className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Expert Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Professional assistance to help you understand your legal situation and options
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <DollarSign className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Low-Cost Services</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Affordable pricing with flexible payment options to fit your budget
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Clock className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Quick Response</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Fast case review and response to help you move forward quickly
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Secure Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your information is protected with secure authentication and encryption
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Submit your case today and take the first step toward justice
          </p>
          <Button asChild size="lg">
            <Link to="/case-submission">Submit Your Case Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
