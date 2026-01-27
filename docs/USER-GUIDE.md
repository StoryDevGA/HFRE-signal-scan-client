# USER-GUIDE.md - Admin Prompts (Versioning & Publishing)

## 1. What changed (short summary)
- Prompts are now owned per admin; each admin can create up to 4 system prompts and 4 user prompts.
- Prompts use **labels** (not names) and support fractional versions (starting at 0.0, +0.5 per content change).
- Any admin can **publish** a prompt; only the owner can **edit/delete**.
- Only one **published** system prompt and one **published** user prompt exist globally at a time.
- Prompts can be **locked** (`isLocked`) with an optional `lockNote`; locked prompts cannot be edited or deleted.
- New endpoint: `GET /api/admin/auth/me` returns the current admin email for ownership checks.

## 2. Admin prompt workflow (user guide)

### 2.1 View prompts
Go to **Admin → Prompts**.  
Each row shows:
- Label, Type, Owner
- Locked status
- Published status + Published At/By
- Version

### 2.2 Create a prompt
1. Click **New prompt**.
2. Enter **Label** and **Content**.
3. Choose **Type** (System/User).
4. Optionally select **Publish now**.
5. Click **Save prompt**.

Notes:
- You can create **up to 4** prompts per type.
- A badge under Type shows remaining slots.
- Save is disabled until Label and Content are filled.

### 2.3 Publish a prompt
1. Click **Publish** on a draft prompt.
2. Confirm in the dialog.

Publishing a prompt **replaces** the currently published prompt of the same type.

### 2.4 Edit a prompt (owner only)
1. Click **Edit** on a prompt you own.
2. Update Label and/or Content.
3. Click **Save prompt**.

Notes:
- Locked prompts cannot be edited.
- Version is read-only and auto-updates when content changes.

### 2.5 Delete a prompt (owner only)
1. Click **Delete** on a prompt you own.
2. Confirm in the dialog.

Notes:
- Published prompts cannot be deleted.
- Locked prompts cannot be deleted.

## 3. Troubleshooting
- **“Prompt limit reached”**: You’ve hit 4 prompts for that type. Delete a draft or use the other type.
- **“Prompt locked”**: The prompt is locked (see lock note). Use another prompt or ask an admin to unlock.
- **Publish fails**: Ensure you’re still logged in and try again. Only one published prompt per type is allowed.


## 4. LLM configuration (admin)
Go to **Admin -> Prompts** and open **LLM config**.

### 4.1 Model
- Fixed-only: select a single model for all scans.
- gpt-5.2-pro is not available in admin config.

### 4.2 Reasoning effort
- Options: none, low, medium, high, xhigh (xhigh is treated as high).
- Higher reasoning can improve quality but may increase latency.

### 4.3 Temperature
- Range: 0.0 to 2.0.
- For GPT-5.2 and GPT-5.1, temperature is ignored when reasoning effort is set
  (anything other than none). In that case the UI disables temperature.
- For GPT-4o and GPT-4o-mini, temperature is always honored.
- For GPT-5-mini and GPT-5-nano, temperature is not supported.
