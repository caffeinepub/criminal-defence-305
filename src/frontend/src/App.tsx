import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import CaseSubmissionPage from './pages/CaseSubmissionPage';
import CaseSubmissionConfirmationPage from './pages/CaseSubmissionConfirmationPage';
import PaymentsPage from './pages/PaymentsPage';
import PaymentStatusPage from './pages/PaymentStatusPage';
import ContactDisclaimerPage from './pages/ContactDisclaimerPage';
import CardCheckoutPage from './pages/CardCheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import PayPalInstructionsPage from './pages/PayPalInstructionsPage';
import CashAppInstructionsPage from './pages/CashAppInstructionsPage';
import CashAtStoreReceiptPage from './pages/CashAtStoreReceiptPage';
import AdminPage from './pages/AdminPage';
import ProfileSetupModal from './components/auth/ProfileSetupModal';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <ProfileSetupModal />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: ServicesPage,
});

const howItWorksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/how-it-works',
  component: HowItWorksPage,
});

const caseSubmissionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/case-submission',
  component: CaseSubmissionPage,
});

const caseConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/case-confirmation',
  component: CaseSubmissionConfirmationPage,
});

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payments',
  component: PaymentsPage,
});

const paymentStatusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-status',
  component: PaymentStatusPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactDisclaimerPage,
});

const cardCheckoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/card-checkout',
  component: CardCheckoutPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

const paypalInstructionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/paypal-instructions',
  component: PayPalInstructionsPage,
});

const cashappInstructionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cashapp-instructions',
  component: CashAppInstructionsPage,
});

const cashStoreReceiptRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cash-store-receipt',
  component: CashAtStoreReceiptPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  servicesRoute,
  howItWorksRoute,
  caseSubmissionRoute,
  caseConfirmationRoute,
  paymentsRoute,
  paymentStatusRoute,
  contactRoute,
  cardCheckoutRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  paypalInstructionsRoute,
  cashappInstructionsRoute,
  cashStoreReceiptRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
