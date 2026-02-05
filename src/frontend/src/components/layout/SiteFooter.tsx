import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Criminal Defence 305</h3>
            <p className="text-sm text-muted-foreground">
              Providing affordable criminal defense assistance to those who need it most.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground">
                Services
              </Link>
              <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                How It Works
              </Link>
              <Link to="/case-submission" className="text-sm text-muted-foreground hover:text-foreground">
                Submit Case
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact & Disclaimer
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Legal Notice</h3>
            <p className="text-sm text-muted-foreground">
              This service provides assistance but does not constitute legal advice. Consult with a licensed attorney for your specific situation.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © 2026. Built with <Heart className="h-4 w-4 fill-current text-red-500" /> using{' '}
            <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
