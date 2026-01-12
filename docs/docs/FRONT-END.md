# FRONT-END.md É?î HFRE Signal Scan (Free Taster)

## 1. Purpose

Provide a simple public web experience where a visitor completes a Company Signal Scan form, submits it, views a formatted É?ocustomer-safeÉ?? report, and receives an emailed copy.  
Provide a restricted Admin Dashboard (max 3 admin users) to view submissions, manage prompts, delete user data, and review basic analytics.

The agent flow to be mirrored is **Start (form input) É≈' Signal Scan LLM Agent É≈' JSON result**, as defined in the provided AgentFlow JSON. å^?fileciteå^'turn4file4å^?

---

## 2. Tech Stack

- React (Vite)
- React Router
- Fetch/Axios for API calls
- Form validation: React Hook Form (recommended) or Formik
- UI: Tailwind or MUI (choose one; keep minimal for taster)
- Optional: react-markdown (if rendering report sections as markdown)

---

## 3. Routes and Pages

### 3.1 Public routes

#### `/` É?î Company Signal Scan Form
Form fields must match the agent flow inputs: å^?fileciteå^'turn4file9å^?
- Contact Name (`name`) É?î string
- Email (`email`) É?î string (validate email format)
- Company Name (`company_name`) É?î string
- Website (`homepage_url`) É?î string (validate URL format)
- Product or Solution (`product_name`) É?î string
- Product or Solution page (`product_page_url`) É?î string (validate URL format)

Form behaviours:
- Client-side validation with clear inline messages.
- Submit button disabled while submitting.
- On success, route to `/results/:publicId` and show success toast/banner (É?oReport generatedÉ??).
- On failure, show error state with retry.

#### `/results/:publicId` É?î Customer Report Viewer
Primary purpose:
- Render the **customer_report** in a readable way (headings, spacing, typography).
- Do **not** render internal_report on public routes.
- Provide É?oDownloadÉ?? (optional) and É?oEmail me a copyÉ?? status indicator.

Data loading:
- GET `GET /api/public/results/:publicId` (public, tokenized/unguessable publicId).
- Display:
  - Company name
  - Customer report
  - Confidence level from metadata (High/Medium/Low)
  - Timestamp

Formatting rules:
- Section headings in `customer_report` must be rendered plainly without É?oSTEPÉ??/step numbers, consistent with the prompt constraints. å^?fileciteå^'turn4file14å^?

Empty / invalid:
- If publicId invalid or expired: show a friendly É?oReport not foundÉ?? page.

---

### 3.2 Admin routes

#### `/admin/login` É?î Admin Login
Requirements:
- Admin access limited to **max 3 unique emails**.
- Uses a **fixed hard-coded password** (stored encrypted/hashed on server).
- UI:
  - Email input
  - Password input
  - Login button
  - Errors: invalid credentials, not authorised email, locked-out (if enabled)

Session approach:
- Use secure httpOnly cookie session or JWT in httpOnly cookie (preferred).
- No É?oremember meÉ?? required.

#### `/admin` É?î Dashboard (shell layout)
Navigation (minimum):
- Submissions
- Prompts
- Users / Data deletion
- Analytics

#### `/admin/submissions` É?î Submissions List
Capabilities:
- Paginated table/list of submissions (latest first)
- Search by company name and/or email
- Filter by date range (optional)

Columns:
- Created date/time
- Company name
- Contact email
- Status: `pending | complete | failed`
- Confidence level (if complete)

Row click É≈' `/admin/submissions/:id`

#### `/admin/submissions/:id` É?î Submission Detail
Must display:
- Full user input (all form fields)
- Full outcomes:
  - customer_report
  - internal_report (admin only)
  - metadata
- Delivery status:
  - É?oCustomer email sentÉ?? / É?oOwner notification email sentÉ?? timestamps
  - Error info (if failed)

Actions:
- Delete this submission
- Delete this userÉ?Ts data (bulk delete by email) (confirm modal)
- Re-send customer email (optional, controlled)

#### `/admin/prompts` É?î Prompt Manager (CRUD)
Prompts to manage:
- **System prompts**
- **User prompts**

Requirements:
- Add/Edit/Delete prompts.
- Support versioning minimally:
  - `name`, `type` (system|user), `content`, `active` boolean, timestamps.
- É?oActive promptÉ?? selection:
  - Only one active system prompt and one active user prompt at a time (recommended).
  - Changes affect subsequent scans only (no retroactive rewrite).

#### `/admin/users` É?î User Data Deletion
Minimum:
- Search by email
- Show user summary: number of submissions, first/last submission date
- Action: delete user + all associated submissions + analytics records (confirm modal)

#### `/admin/analytics` É?î Basic Analytics
Display analytics captured per submission (minimum):
- IP address
- User agent string (browser)
- Derived browser/device summary (optional)
- Referrer (optional)
- Locale/Accept-Language (optional)
- Timestamp

Views:
- Aggregated dashboard:
  - Total submissions (last 7/30 days)
  - Conversion: form submit É≈' report generated
  - Top browsers/devices (basic grouping)
- Drill-down:
  - Click submission É≈' see analytics record

---

\#\#\ 4\.\ UI\ Components\ and\ Patterns\r\n\r\nReference:\ client/docs/docs/FRONT-END-STYLE-GUIDE\.md\ defines\ the\ full\ design\ system,\ component\ catalog,\ theming,\ and\ asset\ usage\.

### 4.1 Shared components
- `PageLayout` (header/footer)
- `AdminLayout` (sidebar + content)
- `FormField` primitives (label, input, error message)
- `Button`, `Spinner`, `Alert`, `ConfirmModal`
- `DataTable` (or list with pagination)

### 4.2 Report rendering component
- Parse `customer_report` into sections.
Options:
1) Keep `customer_report` as pre-formatted text and display with typography + `<pre>`-like wrapping.
2) Server returns structured sections `{title, body}`; frontend renders semantic blocks. (Recommended for future.)

For the v1 taster, implement option 1 but keep the component interface compatible with option 2.

---

## 5. Client-side Data Model

### 5.1 Public submission payload
```json
{
  "name": "string",
  "email": "string",
  "company_name": "string",
  "homepage_url": "string",
  "product_name": "string",
  "product_page_url": "string"
}
```

### 5.2 Public result payload (from API)
```json
{
  "publicId": "string",
  "company": "string",
  "customer_report": "string",
  "metadata": {
    "confidence_level": "High | Medium | Low",
    "source_scope": "Public website only",
    "shareability": { "customer_safe": true, "internal_only": true }
  },
  "createdAt": "ISO-8601"
}
```

Admin detail payload additionally includes `internal_report` and operational metadata.

---

## 6. API Client Contract (Frontend Expectations)

Public:
- `POST /api/public/scans` É≈' returns `{ publicId }`
- `GET /api/public/results/:publicId` É≈' returns public result model

Admin:
- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `GET /api/admin/submissions`
- `GET /api/admin/submissions/:id`
- `DELETE /api/admin/submissions/:id`
- `DELETE /api/admin/users/:email`
- `GET /api/admin/prompts`
- `POST /api/admin/prompts`
- `PUT /api/admin/prompts/:id`
- `DELETE /api/admin/prompts/:id`
- `GET /api/admin/analytics` (aggregate)
- `GET /api/admin/analytics/:submissionId` (detail)

---

## 7. Non-Functional Requirements

- Accessibility: labels tied to inputs; keyboard navigable.
- Performance: results page should render on a single request; avoid re-fetch loops.
- Security: do not expose internal_report on public endpoints or UI.
- Privacy:
  - Show an explicit note that IP/browser telemetry is captured for service improvement.
  - Provide basic É?oDelete my dataÉ?? request path (could be email-based in v1).

---

## 8. Acceptance Checklist (Frontend)

- Public form fields match the agent flow and validate correctly. å^?fileciteå^'turn4file9å^?
- Submission triggers generation and routes to results page.
- Results page displays only customer-safe report. å^?fileciteå^'turn4file14å^?
- Admin login gates all /admin routes; only 3 allowed emails can login.
- Admin dashboard supports: view submissions + outcomes, manage prompts, delete user data, view analytics.
