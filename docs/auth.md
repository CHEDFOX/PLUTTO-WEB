# Web sign-in (Google, Apple, email)

Sign-in on `/app` is Supabase's redirect flow: the browser never holds an OAuth
secret, Supabase performs the token exchange, and the web uses the same
Supabase project as the phones, so one account works everywhere. Each provider
must list the site's origin; a missing entry shows up as `redirect_uri_mismatch`
or as a return to the page signed out.

## 1. Supabase → Authentication → URL Configuration

| Field | Value |
|---|---|
| Site URL | `https://plutto.space` |
| Redirect URLs | `https://plutto.space/app`, `https://plutto.space/**` |

The app sends `redirect_to = <origin>/app`; Supabase refuses any redirect not on
this list. Every entry is a place Supabase will deliver a signed-in user's
tokens, so never list a wildcard on a domain someone else can register (for
example `https://plutto-web-*.vercel.app/**`: anyone can create a Vercel project
with that prefix) and never list `http://localhost:3000/**` on the production
project. Test previews and local development against a separate Supabase project.

## 2. Google Cloud Console → project PLUTTO → Credentials → Web OAuth client

Client `750110530601-3f3toctgrlte3itflov4o4idoronoahn.apps.googleusercontent.com`.

| Field | Value |
|---|---|
| Authorised JavaScript origins | `https://plutto.space`, `http://localhost:3000` |
| Authorised redirect URIs | the Supabase callback shown in Supabase → Providers → Google (`https://<project-ref>.supabase.co/auth/v1/callback`, or `https://auth.plutto.space/auth/v1/callback` through the custom domain) |

Google returns to Supabase, which returns to the site.

## 3. Apple Developer → Services ID

| Field | Value |
|---|---|
| Services ID | `space.plutto.web` |
| Domains and Subdomains | `plutto.space` and the Supabase auth domain |
| Return URLs | the project's own Supabase callback, `https://<project-ref>.supabase.co/auth/v1/callback` |

Apple is sent the project's own `supabase.co` callback even when sign-in goes
through `auth.plutto.space`, which only proxies it, so that is the address the
Services ID must list.

In Supabase → Authentication → Providers → Apple, the Client IDs list must start
with the Services ID (`space.plutto.web,com.jyotish.app`): Supabase starts the
web flow with the first one. The secret key is a JWT signed with the Sign in
with Apple key; Apple caps it at six months: renew it before 1 April 2027 (the
signing steps are in the Plutto-Backend docs). Native sign-in on iOS uses the
bundle ID and needs none of this.

## Verify

1. Open `https://plutto.space/app` in a private window: the sign-in screen appears.
2. Google: the browser goes to `accounts.google.com` and returns to `/app` signed in.
3. Apple: the Apple sheet opens; same round trip.
4. Email: enter an address, then the six-digit code; it verifies on the sixth digit.

If a button seems to do nothing, the screen reports it after a few seconds: one
of the three lists above is missing the origin.

## Notes

- No secret belongs in the web bundle. Plutto-Frontend `src/config/auth.js`
  records the web client ID for reference, beside the iOS and Android clients of
  the same Google project.
- The Supabase anon key in the bundle is public by design; row-level security
  protects the data, so RLS must be on for every table.
- One account on every platform: an account created on a phone signs in on the
  web, and a subscription bought in the app unlocks the web, and the reverse.
