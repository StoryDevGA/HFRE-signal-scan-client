# Frontend Implementation Plan (HFRE Signal Scan)

1) Project setup and core tooling
- Confirm React (Vite) setup, routing, and API client utility (fetch/axios).
- Add shared UI primitives (Button, Alert, Spinner, FormField, ConfirmModal).

2) Public form page (/)
- Build form matching required inputs: name, email, company_name, homepage_url, product_name, product_page_url.
- Add client-side validation (email and URL formats).
- Submit to POST /api/public/scans and route to results on success.
- Handle loading, error, and retry states.

3) Results page (/results/:publicId)
- Fetch GET /api/public/results/:publicId with loading and error states.
- Render company name, customer_report, confidence level, createdAt.
- Ensure customer_report headings render plainly with no step labels.
- Add not-found view for invalid/expired publicId.

4) Admin auth (/admin/login)
- Build login form (email, password) with error handling.
- Store session via httpOnly cookie (no client storage).
- Guard admin routes; redirect to login on 401.

5) Admin layout shell (/admin)
- Create AdminLayout with navigation: Submissions, Prompts, Users, Analytics.
- Add route guards and session check.

6) Submissions list (/admin/submissions)
- Paginated list with search and status filter.
- Columns: createdAt, company_name, email, status, confidence level.
- Row navigation to detail.

7) Submission detail (/admin/submissions/:id)
- Display inputs, customer_report, internal_report, metadata, email status, analytics.
- Actions: delete submission, delete user data by email, optional resend email.

8) Prompt manager (/admin/prompts)
- CRUD for system and user prompts.
- Enforce one active prompt per type in UI.

9) User deletion (/admin/users)
- Search by email, show summary, confirm delete of all submissions + analytics.

10) Analytics (/admin/analytics)
- Aggregated metrics (counts, conversion, top browsers/devices).
- Drill-down to submission analytics detail.

11) Report rendering component
- Implement customer_report renderer with paragraph and heading detection.
- Keep interface extensible for future structured sections.

12) Accessibility and UX polish
- Labels tied to inputs, keyboard navigation, inline errors.
- Clear banners/toasts for success/failure.

13) Testing and QA
- Form validation tests, route guard tests, and results rendering tests.
- Manual pass for admin flows and public report rendering.
