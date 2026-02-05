import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';

export default function ContactDisclaimerPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Contact & Legal Disclaimer</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with us and understand our service limitations
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Reach out to us for questions or support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">support@criminaldefence305.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">(305) 555-0100</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">Miami, Florida</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>When you can reach us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Monday - Friday</span>
                <span className="text-sm text-muted-foreground">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Saturday</span>
                <span className="text-sm text-muted-foreground">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Sunday</span>
                <span className="text-sm text-muted-foreground">Closed</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Response time: We typically respond to inquiries within 1-2 business days.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-destructive/50">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-6 w-6 text-destructive" />
              <div>
                <CardTitle className="text-destructive">Important Legal Disclaimer</CardTitle>
                <CardDescription>Please read carefully before using our services</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="mb-2 font-semibold text-foreground">Not Legal Advice</h3>
              <p>
                Criminal Defence 305 provides assistance and guidance but does not constitute legal advice or legal representation. We are not a law firm and our services do not create an attorney-client relationship.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-foreground">Consult an Attorney</h3>
              <p>
                For specific legal advice regarding your case, you should consult with a qualified attorney licensed to practice law in your jurisdiction. Our services are designed to help you understand your situation and prepare for legal consultation, not to replace professional legal counsel.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-foreground">No Guarantees</h3>
              <p>
                We cannot guarantee any specific outcome or result from using our services. Each legal case is unique and outcomes depend on many factors beyond our control.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-foreground">Confidentiality</h3>
              <p>
                While we take reasonable measures to protect your information, communications with Criminal Defence 305 are not protected by attorney-client privilege. Do not share information you wish to keep confidential until you have established a relationship with a licensed attorney.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-foreground">Limitation of Liability</h3>
              <p>
                Criminal Defence 305 and its operators shall not be liable for any damages arising from the use of our services or reliance on information provided through our platform.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
