# Specification

## Summary
**Goal:** Add per-case legal document storage, an in-app reference library, and a guided template-based draft motion workflow tied to case submissions.

**Planned changes:**
- Add backend support to store/retrieve/delete user-uploaded legal documents linked to a case submission, enforcing ownership/admin access rules.
- Add backend support to store/retrieve/delete generated draft motion documents linked to a case submission, enforcing the same authorization rules.
- Implement a backend-managed Reference Library: admin CRUD for reference entries (title, body, optional metadata) and user-facing list/search/view APIs.
- Add frontend Reference Library page for users to browse/search/read entries, and an admin-only UI to manage reference entries.
- Add admin-managed motion templates (placeholders + required fields) and a frontend “Draft Motion” wizard to select a submission, choose a template, fill fields, optionally include reference entries, preview, and save the draft to the backend.
- Add frontend UI to upload, list, view, and delete submission documents, including clear file size/type limit messaging.
- Add navigation/routes for Reference Library, Submission Documents, and Draft Motions, while keeping existing submission/payment/admin flows working and requiring login where appropriate.
- Add clear disclaimer text on all draft-related user screens stating outputs are informational and must be reviewed by a qualified attorney before filing.

**User-visible outcome:** Authenticated users can manage documents per case submission, search/read a reference library, and generate/save/reopen draft motions via a guided template flow; admins can manage reference entries and motion templates, and users can only access their own documents/drafts.
