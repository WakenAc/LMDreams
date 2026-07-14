# Technical Contract - Contact Form

## Purpose

Define the public contract for the `/contactos/` form and its integration with the selected static-site form provider.

## Selected Provider

- **Provider**: Formspree
- **Mode**: Plain HTML form POST with optional JavaScript enhancement
- **Public endpoint shape**: `https://formspree.io/f/{FORM_ID}`

## Configuration Source

- The public form endpoint MUST be defined in one centralized configuration location
- Planned source: `src/data/company.ts` under a dedicated `contactFormEndpoint` field
- The endpoint MUST NOT be duplicated across components

## Supported Fields

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `name` | text | Yes | trimmed, max length 100 | Human-readable requester name |
| `contact` | text | Yes | email OR phone pattern, max length 100 | Single field or split UI is allowed, but one contact path is required |
| `location` | text | Yes | max length 120 | General work location only |
| `needType` | text/select | Yes | from approved options or free text, max length 120 | Must not force a fake service taxonomy |
| `description` | textarea | Yes | min 10, max 5000 | Project/request description |
| `consent` | checkbox | Yes | must be checked | Privacy/contact consent |
| `company` or equivalent honeypot | text | No | hidden, must remain empty | Anti-spam field |

## Validation Layers

### HTML Validation (Mandatory)

- `required` on mandatory fields
- Appropriate input types (`email`, `tel`, `text`, `textarea`)
- `autocomplete` attributes where appropriate
- Length limits enforced in the markup
- Visible labels and field-level error messaging

### Provider Validation (Mandatory)

- Formspree receives and validates the payload server-side
- Submission success is determined by HTTP success status
- Submission failure is determined by non-success HTTP status or timeout/network error

### JavaScript Enhancement (Optional)

- May add inline error summary
- May preserve form values after failed submission
- May disable the submit button during in-flight submission
- MUST NOT replace native HTML validation as the only validation layer

## Submission Format

- **Method**: `POST`
- **Encoding**: `application/x-www-form-urlencoded` by default
- **Attachments**: Out of MVP scope
- **Transport target**: Formspree endpoint configured in the centralized company config

## Success Contract

### No-JavaScript Path

- Browser submits directly to Formspree endpoint
- Success is provider-accepted submission
- The user must receive either a provider success response or a configured success redirection
- The page content must continue to expose fallback phone/email contacts even if the provider handles the terminal response

### JavaScript-Enhanced Path

- Browser intercepts submission and sends `POST` to the same endpoint
- Any 2xx response is treated as success
- UI transitions to `success` state with confirmation message
- Form prevents duplicate submission while in flight

## Error Contract

### Failure Types

- Validation failure before submission
- Provider rejects submission
- Network timeout
- Provider outage / availability failure

### Required User Feedback

- Field-level errors tied to the relevant inputs
- Summary error block near the form heading
- Non-technical general failure message
- Persistent fallback instructions using phone/email

## Timeout Behavior

- Client-side enhanced submission should treat a provider response taking too long as a recoverable error
- Timeout threshold should be short enough to avoid trapping users, but not so short that normal mobile latency becomes a false failure
- The exact timeout value will be finalized during implementation and test tuning

## Personal Data Involved

- Name
- Contact detail (email or phone)
- General location of the work
- Need/request description

The form MUST NOT collect unnecessary personal data in v1.

## Spam Protection

- Hidden honeypot field
- Provider-side spam filtering
- No visual CAPTCHA by default
- A stronger provider-side challenge may be added later only with accessibility/privacy review

## Fallback Contract

If the form cannot be submitted successfully:

- The contact page MUST still show a clickable `tel:` link
- The contact page MUST still show a clickable `mailto:` link
- The failure state MUST not hide the contact alternatives

## Privacy Constraints

- No secret API key may be embedded in frontend code
- The privacy page MUST disclose the external provider and the fact that data is sent outside the static website
- Legal/privacy text remains pending business approval and must not be invented as definitive legal advice
