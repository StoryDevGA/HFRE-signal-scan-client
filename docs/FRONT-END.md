# FRONT-END.md - HFRE Signal Scan (Free Taster)

## 1. Purpose

Provide a simple public web experience where a visitor completes a Company Signal Scan form, submits it, views a formatted customer-safe report, and receives an emailed copy.  
Provide a restricted Admin Dashboard (max 3 admin users) to view submissions, manage prompts, delete user data, and review basic analytics.

The agent flow to be mirrored is **Start (form input) -> Signal Scan LLM Agent -> JSON result**, as defined in the AgentFlow JSON.

---

## 2. Tech Stack

- React (Vite), JavaScript (no TypeScript)
- React Router
- Fetch (preferred) or Axios for API calls
- Form validation: React Hook Form (recommended) or Formik
- UI: Tailwind or MUI (choose one; keep minimal for taster)
- Optional: react-markdown (if rendering report sections as markdown)

---

## 3. Routes and Pages

### 3.1 Public routes

#### `/` - Company Signal Scan Form
Form fields must match the agent flow inputs:
- Contact Name (`name`) - string
- Email (`email`) - string (validate email format)
- Company Name (`company_name`) - string
- Website (`homepage_url`) - string (validate URL format)
- Product or Solution (`product_name`) - string
- Product or Solution page (`product_page_url`) - string (validate URL format)

Form behaviors:
- Client-side validation with clear inline messages.
- Submit button disabled while submitting.
- On success, route to `/results/:publicId` and show success banner (Report generated).
- On failure, show error state with retry.

#### `/results/:publicId` - Customer Report Viewer
Primary purpose:
- Render the **customer_report** in a readable way (headings, spacing, typography).
- Do **not** render internal_report on public routes.
- Provide Download (optional) and Email me a copy status indicator.

Data loading:
- `GET /api/public/results/:publicId`.
- If status is `pending`, poll until `complete` or `failed`.
- Display:
  - Company name
  - Customer report
  - Confidence level from metadata (High/Medium/Low)

Formatting rules:
- Section headings in `customer_report` must be rendered plainly without STEP/step numbers.

Empty / invalid:
- If publicId invalid or expired: show a friendly Report not found page.

---

### 3.2 Admin routes

#### `/admin/login` - Admin Login
Requirements:
- Admin access limited to max 3 unique emails.
- Uses a fixed password stored encrypted/hashed on the server.
- UI:
  - Email input
  - Password input
  - Login button
  - Errors: invalid credentials or unauthorized email

Session approach:
- Uses httpOnly cookie session (`admin_session`).
- Frontend must send credentials on admin requests.
- `GET /admin/auth/me` returns `{ email }` for the current admin (use for ownership checks).

#### `/admin` - Dashboard (shell layout)
Navigation (minimum):
- Submissions
- Prompts
- Users / Data deletion
- Analytics

#### `/admin/submissions` - Submissions List
Capabilities:
- Paginated table/list of submissions (latest first)
- Search by company name and/or email
- Filter by status (`pending | complete | failed`)

Columns:
- Created date/time
- Company name
- Contact email
- Status
- Confidence level (if complete)

Row click -> `/admin/submissions/:id`

#### `/admin/submissions/:id` - Submission Detail
Must display:
- Full user input (all form fields)
- Full outcomes:
  - customer_report
  - internal_report (admin only)
  - metadata
- Delivery status:
  - Customer email sent / Owner notification email sent timestamps
  - Error info (if failed)
- Analytics (IP, user agent, referrer, locale if present)

Actions:
- Delete this submission
- Delete this user's data (bulk delete by email) (confirm modal)

#### `/admin/prompts` - Prompt Manager (CRUD + Publish)
Prompts to manage:
- System prompts
- User prompts

Requirements:
- Create prompts with `label` (required), `type`, and `content`.
- Prompts are owned per admin; each admin can create up to 4 system prompts and 4 user prompts.
- Only owners can edit/delete their prompts.
- Any admin can publish any prompt (ownership not required).
- Defaults may be locked (`isLocked: true`) and include a `lockNote`; locked prompts cannot be edited or deleted.
- Versioning:
  - `version` auto-increments on content change (read-only in UI).
  - `name` is derived/legacy; use `label` in new UI.
- Publishing:
  - Only one published system prompt and one published user prompt exist globally.
  - Publish replaces the currently published prompt of that type.
  - No unpublish action; publish another prompt instead.
  - Use `isPublished` for status (API may also return legacy `isActive`).

#### `/admin/users` - User Data Deletion
Minimum:
- Search by email
- Show user summary: number of submissions, first/last submission date
- Action: delete user + all associated submissions + analytics records (confirm modal)

#### `/admin/analytics` - Basic Analytics
Display analytics captured per submission (minimum):
- IP address
- User agent string (browser)
- Referrer (optional)
- Locale/Accept-Language (optional)
- Timestamp

Views:
- Aggregated dashboard:
  - Total submissions
  - Conversion: form submit -> report generated
  - Top browsers/devices (basic grouping)
- Drill-down:
  - Click submission -> see analytics record

---

## 4. UI Components and Patterns

Reference: `client/docs/FRONT-END-STYLE-GUIDE.md` defines the full design system, component catalog, theming, and asset usage.

### 4.1 Shared components
- `PageLayout` (header/footer)
- `AdminLayout` (sidebar + content)
- `Fieldset`, `Input` (floating label), `Select`, `Button`, `Spinner`
- `Dialog` (confirmations), `Toaster` (notifications)
- `Table` (submissions, analytics)

### 4.2 Report rendering component
- Parse `customer_report` into sections.
Options:
1) Keep `customer_report` as pre-formatted text and display with typography + `<pre>`-like wrapping.
2) Server returns structured sections `{title, body}`; frontend renders semantic blocks (recommended later).

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
  "status": "complete",
  "publicId": "string",
  "company": "string",
  "customer_report": "string",
  "metadata": {
    "confidence_level": "High | Medium | Low",
    "source_scope": "Public website only",
    "shareability": { "customer_safe": true, "internal_only": true }
  }
}
```

Admin detail response includes `{ submission, analytics }` and exposes `internal_report`.

### 5.3 Admin prompt object (from API)
```json
{
  "_id": "string",
  "type": "system | user",
  "ownerEmail": "string",
  "label": "string",
  "name": "string (derived/legacy)",
  "content": "string",
  "isPublished": true,
  "isActive": true,
  "isLocked": false,
  "lockNote": "string | null",
  "publishedAt": "string (ISO datetime) | null",
  "publishedBy": "string | null",
  "version": 3,
  "createdAt": "string (ISO datetime)",
  "updatedAt": "string (ISO datetime)"
}
```

Create/update payloads:
```json
// POST /admin/prompts
{ "type": "system | user", "label": "string", "content": "string", "isPublished": true }

// PUT /admin/prompts/:id (edit - owner only)
{ "label": "string", "content": "string" }

// PUT /admin/prompts/:id (publish - any admin)
{ "isPublished": true }
```

---

## 6. API Client Contract (Frontend Expectations)

Base URL (local dev): `http://localhost:8000/api`

Public:
- `POST /public/scans` -> `{ publicId }`
- `GET /public/results/:publicId`
  - `202` pending: `{ status: "pending" }`
  - `200` complete: `{ status: "complete", publicId, company, customer_report, metadata }`
  - `404` not found: `{ status: "not_found" }`
  - `500` failed: `{ status: "failed" }`

Admin (requires `credentials: "include"`):
- `POST /admin/auth/login`
- `POST /admin/auth/logout`
- `GET /admin/auth/logout` (accepted)
- `GET /admin/auth/me` -> `{ "email": "admin@example.com" }`
- `GET /admin/submissions`
- `GET /admin/submissions/:id`
- `DELETE /admin/submissions/:id`
- `DELETE /admin/users/:email`
- `GET /admin/prompts`
- `POST /admin/prompts`
- `PUT /admin/prompts/:id`
- `DELETE /admin/prompts/:id`
- `GET /admin/analytics` (aggregate)
- `GET /admin/analytics/:submissionId` (detail)

Prompts:
- `GET /admin/prompts` returns prompts across all admins with `ownerEmail`, `label`, `isPublished` (and legacy `isActive`), `publishedAt`, `publishedBy`, and `version`.
- `POST /admin/prompts` requires `label` and enforces max 4 prompts per admin per type (409 on limit).
- `PUT /admin/prompts/:id`:
  - Edit (owner only): `{ label, content }`
  - Publish (any admin): `{ isPublished: true }`
  - No unpublish; publish another prompt instead.
- Locked prompts (`isLocked: true`) must not be editable/deletable; display `lockNote` if present.

Error shapes:
- Validation: `{ "errors": [ { "path": "string", "message": "string" } ] }`
- Server errors: `{ "error": "string" }`
Note: `/admin/auth/logout` is `POST` with `credentials: "include"`. Calling it with `GET` or without cookies will fail.

---

## 6.1 React (JS) Examples

Submit + poll:
```jsx
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000/api";

export function ScanExample() {
  const [publicId, setPublicId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);

  async function submitScan() {
    setStatus("submitting");
    const res = await fetch(`${API_BASE}/public/scans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        company_name: "Acme Inc",
        homepage_url: "https://acme.example",
        product_name: "Widget",
        product_page_url: "https://acme.example/widget",
      }),
    });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    const data = await res.json();
    setPublicId(data.publicId);
    setStatus("pending");
  }

  useEffect(() => {
    if (!publicId) return;
    let cancelled = false;
    const interval = setInterval(async () => {
      const res = await fetch(`${API_BASE}/public/results/${publicId}`);
      const data = await res.json();
      if (cancelled) return;
      if (res.status === 200) {
        setResult(data);
        setStatus("complete");
        clearInterval(interval);
      } else if (res.status === 500) {
        setStatus("failed");
        clearInterval(interval);
      } else if (res.status === 404) {
        setStatus("not_found");
        clearInterval(interval);
      }
    }, 1500);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [publicId]);

  return (
    <div>
      <button onClick={submitScan}>Submit</button>
      <div>Status: {status}</div>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
```

Admin login with cookie:
```jsx
async function adminLogin(email, password) {
  const res = await fetch(`${API_BASE}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  return res.ok;
}
```

Admin logout:
```jsx
async function adminLogout() {
  const res = await fetch(`${API_BASE}/admin/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.ok;
}
```

## 7. Non-Functional Requirements

- Accessibility: labels tied to inputs; keyboard navigable.
- Performance: results page should render on a single request; avoid re-fetch loops.
- Security: do not expose internal_report on public endpoints or UI.
- Privacy:
  - Show an explicit note that IP/browser telemetry is captured for service improvement.
  - Provide basic Delete my data request path (could be email-based in v1).

---

## 8. Acceptance Checklist (Frontend)

- Public form fields match the agent flow and validate correctly.
- Submission triggers generation and routes to results page.
- Results page displays only customer-safe report.
- Admin login gates all /admin routes; only 3 allowed emails can login.
- Admin dashboard supports: view submissions + outcomes, manage prompts, delete user data, view analytics.
