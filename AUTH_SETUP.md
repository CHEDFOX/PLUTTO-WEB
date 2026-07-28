# Auth setup — making Google and Apple work on the web

The code is done. Web sign-in is a **redirect flow through Supabase**, so the
browser never holds a Google secret: Supabase already has the web client ID and
secret (the mobile app uses the same Google Cloud project, PLUTTO), and it
performs the token exchange server-side.

What is *not* done, and cannot be done from code, is **allow-listing the website
origin** in three places. Until all three list it, the buttons will bounce back
with a `redirect_uri_mismatch` or simply return to the page signed-out.

---

## 1. Supabase → Authentication → URL Configuration

| Field | Value |
|---|---|
| **Site URL** | `https://plutto.space` |
| **Redirect URLs** | `https://plutto.space/app`<br>`https://plutto.space/**`<br>`http://localhost:3000/**` *(local dev)*<br>`https://plutto-web-*.vercel.app/**` *(previews)* |

The app sends `redirect_to = <origin>/app`. If that exact URL is not on the
list, Supabase refuses the redirect — this is the single most common cause of
"the button does nothing".

## 2. Google Cloud Console → project **PLUTTO** → Credentials → the **Web** OAuth client
`750110530601-3f3toctgrlte3itflov4o4idoronoahn.apps.googleusercontent.com`

| Field | Value |
|---|---|
| **Authorised JavaScript origins** | `https://plutto.space`<br>`http://localhost:3000` |
| **Authorised redirect URIs** | `https://<your-project-ref>.supabase.co/auth/v1/callback` |

> The redirect URI is **Supabase's** callback, not your site — Google returns to
> Supabase, which then returns to you. Copy the exact value shown in
> Supabase → Providers → Google; if you use the custom domain
> `auth.plutto.space`, use `https://auth.plutto.space/auth/v1/callback`.

## 3. Apple Developer → Services ID (`com.jyotish.signin`)

| Field | Value |
|---|---|
| **Domains and Subdomains** | `plutto.space` (and your Supabase auth domain) |
| **Return URLs** | the same Supabase `/auth/v1/callback` URL |

Native Sign in with Apple on iOS uses the bundle ID and needs none of this — it
is required only because the **web** now offers Apple too.

---

## Verify

1. Open `https://plutto.space/app` in a private window → you should land on the
   auth gate (pill, envelope, Apple + Google circles).
2. Click Google → you should be sent to `accounts.google.com`, not back to the
   page. Returning lands on `/app` signed in.
3. Click Apple → the Apple sheet, same round trip.
4. Email: type an address, press the white arrow, then enter the six-digit code.
   It verifies on the sixth digit — there is no submit button, matching the app.

If a button appears to do nothing, the screen now says so after a few seconds
instead of failing silently — that message means one of the three lists above is
missing this origin.

---

## Notes

- **No key belongs in the web bundle.** `app/config/auth.js` records the web
  client ID for reference and to keep web, iOS and Android on one Google
  project; the redirect flow does not read a secret in the browser.
- **The Supabase anon key in the bundle is public by design.** Row-level
  security is what protects data — make sure RLS is on for every table.
- **One account, both platforms.** Web uses the same Supabase project as the
  app, so an account created on a phone signs in here, and a subscription
  bought in the app unlocks the web.
