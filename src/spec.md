# Specification

## Summary
**Goal:** Build the “Criminal Defence 305” website with informational pages, a case submission flow, and a payment step (Stripe card checkout, PayPal/Cash App instructions + reference capture, and cash-at-store payment code/receipt).

**Planned changes:**
- Create a branded “Criminal Defence 305” frontend with navigable pages: Home, Services, How It Works, Case Submission, Payments, Contact/Disclaimer (English).
- Apply a consistent professional legal-aid theme (not blue/purple-dominant) across navigation, typography, forms, and layout.
- Implement case intake form with basic validation; submit to backend, store submission, and show confirmation with a unique submission ID and next steps.
- Add payment flow tied to a case submission with method selection: Card, PayPal, Cash App, Cash at Store; create and store a payment record linked to the submission.
- Implement Stripe-based card payment flow with success/cancel/failure handling and corresponding payment status updates.
- Provide PayPal and Cash App instruction screens and collect a user-entered payment reference; store it and update status to “Reference Submitted” (or equivalent).
- Implement Cash at Store flow: generate unique payment code and printable receipt view (app name, payment ID, amount if applicable, code, timestamp, instructions); store code and support “I have paid” acknowledgement to set status “User Reported Paid”.
- Add a payment status page retrievable by case submission ID (or payment ID) showing statuses such as Pending, Instructions Provided, Reference Submitted, Paid, Cancelled, User Reported Paid.
- Add generated static brand assets (logo and hero/banner) in `frontend/public/assets/generated` and render them in the UI (logo in header and hero/banner on Home).

**User-visible outcome:** Visitors can learn about Criminal Defence 305 services, submit a case and receive a submission ID, choose a payment method (Stripe card checkout or instruction-based PayPal/Cash App with reference, or cash-at-store code/receipt), and check payment status using their submission/payment ID.
