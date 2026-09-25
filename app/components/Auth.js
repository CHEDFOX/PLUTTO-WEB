'use client';

/**
 * AUTH — the app's auth gate, composed to match.
 *
 * Mobile (src/screens/AuthGateScreen.js) is a centred stack with no title: one
 * 60px pill carrying an envelope circle, the input, and a white arrow that
 * appears only when the value is valid; a hairline divider at 66% width; then a
 * row of 48px social circles. Verification swaps the pill for a row of circular
 * code boxes. Every measurement below is taken from that file so the two read
 * as the same screen.
 */

import { useEffect, useRef, useState } from 'react';
import { getOnboarding } from '../lib/api';
import { mediaUrl, resolveMedia } from '../lib/media';
import { auth } from '../lib/supabase';
import { oauthRedirectTo, SOCIAL_PROVIDERS } from '../config/auth';

const PILL_H = 60;
const PILL_PAD = 7;
const ENV = PILL_H - PILL_PAD * 2;   // 46
const CODE_LEN = 6;

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function EnvelopeGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function PhoneGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

/**
 * A FLAG THAT DRAWS EVERYWHERE. The backend sends the emoji flag, which the
 * phone renders and Windows does not (Chrome and Edge there show "IN" for 🇮🇳,
 * since Windows ships no flag glyphs). So the web draws the country's ISO code
 * as an SVG from /public/flags (3:2, ~500 bytes each) and keeps the emoji only
 * as the fallback if a code has no file.
 */
function Flag({ country, size = 22 }) {
  const [broken, setBroken] = useState(false);
  if (!country) return null;
  const iso = String(country.iso || '').toLowerCase();
  if (!iso || broken) return <span style={{ fontSize: size - 2, lineHeight: 1 }}>{country.flag}</span>;
  return (
    <img
      src={`/flags/${iso}.svg`}
      alt=""
      width={size}
      height={Math.round(size * 2 / 3)}
      onError={() => setBroken(true)}
      className="rounded-[2px] ring-[0.5px] ring-white/[0.15]"
      style={{ width: size, height: Math.round(size * 2 / 3), objectFit: 'cover' }}
      draggable={false}
    />
  );
}

function ArrowGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8" strokeLinecap="round">
      <path d="M5 12h13M12 5l7 7-7 7" />
    </svg>
  );
}

function AppleGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="#fff">
      <path d="M16.4 12.8c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.3-2.5 1.3-2.6 0 0-2.5-1-2.5-3.5zM14.2 5.9c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3z" />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#4285F4" d="M45 24c0-1.6-.1-2.7-.4-3.9H24v7.1h12c-.2 1.8-1.5 4.6-4.4 6.5l6.7 5.2C42.2 35.3 45 30.1 45 24z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C8 40.4 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.8-2.9-.8-4.4s.3-3 .7-4.4l-7.1-5.6C2.8 16.8 2 20.3 2 24s.8 7.2 2.3 10.1l7.2-5.7z" />
      <path fill="#EA4335" d="M24 9.5c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 3.4 29.9 1 24 1 15.4 1 8 6.6 4.3 14.1l7.2 5.6C13.3 14.4 18.2 9.5 24 9.5z" />
    </svg>
  );
}

function ResendGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" strokeLinecap="round">
      <path d="M20 11a8 8 0 1 0-2.3 6.1" />
      <path d="M20 5v6h-6" />
    </svg>
  );
}

export default function Auth({ onDone }) {
  const [phase, setPhase] = useState('entry');   // entry | sending | verify | verifying
  const [email, setEmail] = useState('');
  // PHONE — the second pill the app has (screens.auth.fields[].type === 'phone').
  // No default country: the browser's locale is a guess, and a wrong dial code
  // beside a right number is a valid-looking value that never gets a code. The
  // circle asks before it assumes, exactly as the phone's does.
  const [digits, setDigits] = useState('');
  const [country, setCountry] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('email');   // which pill sent the code
  const phoneRef = useRef(null);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(null);   // provider mid-redirect
  const codeRef = useRef(null);

  const valid = EMAIL_RX.test(email.trim());
  const fullPhone = country ? `${country.dial}${digits}` : '';

  useEffect(() => {
    if (phase === 'verify') codeRef.current?.focus();
  }, [phase]);

  // Verify as soon as the last digit lands, exactly as the app does — no button.
  useEffect(() => {
    if (phase !== 'verify' || code.length !== CODE_LEN) return;
    (async () => {
      setPhase('verifying');
      const { error } = method === 'phone'
        ? await auth.verifyPhoneCode(fullPhone, code)
        : await auth.verifyEmailCode(email.trim(), code);
      if (error) {
        setCodeError(true);
        setCode('');
        setPhase('verify');
        setError(error.message || 'That code did not work.');
      } else {
        onDone?.();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, phase]);

  const send = async (via = method) => {
    if (via === 'phone' ? !phoneValid : !valid) return;
    setMethod(via);
    setError('');
    setPhase('sending');
    const { error } = via === 'phone'
      ? await auth.sendPhoneCode(fullPhone)
      : await auth.sendEmailCode(email.trim());
    if (error) {
      setError(error.message || 'Could not send the code.');
      setPhase('entry');
    } else {
      setPhase('verify');
    }
  };

  // Google and Apple are REDIRECT flows through Supabase: the browser leaves the
  // page, so reaching the line after this call at all means the redirect never
  // happened — almost always because the origin is missing from Supabase's
  // redirect allow-list or Google's authorised origins (see AUTH_SETUP.md).
  // Surfacing that beats a button that silently does nothing.
  const oauth = async (provider) => {
    setError('');
    setPending(provider);
    const fn = provider === 'google' ? auth.signInWithGoogle : auth.signInWithApple;
    try {
      const { data, error } = await fn(oauthRedirectTo());
      if (error) {
        setPending(null);
        setError(error.message || `Could not sign in with ${provider}.`);
        return;
      }
      // Supabase returns the URL when it cannot navigate for us.
      if (data?.url) { window.location.assign(data.url); return; }
      setTimeout(() => {
        setPending((p) => {
          if (p === provider) {
            setError(
              `${provider === 'google' ? 'Google' : 'Apple'} sign-in did not open. ` +
              'This site may not be authorised for it yet.'
            );
          }
          return null;
        });
      }, 4000);
    } catch (e) {
      setPending(null);
      setError(e?.message || `Could not sign in with ${provider}.`);
    }
  };

  // THE ECLIPSE AT THE FOOT OF THE GATE — the app's own art, from the app's own
  // bundle. The phone reads screens.auth.eclipse (and its ratio and drop) out of
  // /onboarding-content and draws it half off the bottom edge; web showed an
  // email field alone in a black rectangle. Same endpoint, same key, same file.
  const [gate, setGate] = useState(null);
  useEffect(() => {
    let live = true;
    getOnboarding()
      .then((d) => live && setGate(d?.screens?.auth || null))
      .catch(() => {});
    return () => { live = false; };
  }, []);

  const [eclipse, setEclipse] = useState(null);
  useEffect(() => {
    const key = gate?.eclipse;
    if (!key) return;
    let live = true;
    const u = mediaUrl(key);
    if (u) { setEclipse(u); return; }
    resolveMedia(key).then((r) => live && setEclipse(r));
    return () => { live = false; };
  }, [gate?.eclipse]);

  // The methods and the dial codes are the backend's (onboarding-content →
  // screens.auth), so withdrawing phone there withdraws it here too.
  const fields = Array.isArray(gate?.fields) && gate.fields.length ? gate.fields : [{ id: 'email', type: 'email', placeholder: 'you@plutto.space' }];
  const phoneField = fields.find((f) => f.type === 'phone');
  const emailField = fields.find((f) => f.type === 'email') || fields[0];
  const countries = Array.isArray(gate?.countries) && gate.countries.length ? gate.countries : [{ iso: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' }];
  const minD = Number(phoneField?.minDigits) || 6;
  const maxD = Number(phoneField?.maxDigits) || 14;
  const phoneValid = !!country && digits.length >= minD && digits.length <= maxD;
  const term = search.trim().toLowerCase();
  const shown = term ? countries.filter((c) => (c.name || '').toLowerCase().includes(term) || String(c.dial || '').includes(term)) : countries;
  const chooseCountry = (c) => { setCountry(c); setPickerOpen(false); setSearch(''); setTimeout(() => phoneRef.current?.focus(), 80); };

  const circle =
    'flex items-center justify-center rounded-full transition-colors ' +
    'border-[0.5px] border-white/[0.18] bg-white/[0.03] hover:bg-white/[0.07]';

  return (
    <div className="relative flex w-full flex-col items-center px-7 pt-[10vh] md:pt-[14vh]">
      {/* THE HORIZON. Fixed to the foot of the viewport and sunk past it, so it
          is the ground the gate stands on — never a picture behind the buttons.
          It used to sit at the bottom of the form's own box, which on a tall
          screen put the planet straight over the Google button. */}
      {eclipse ? (
        <img
          src={eclipse}
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed left-1/2 bottom-0 z-0 w-[min(520px,92vw)] max-w-none -translate-x-1/2 translate-y-[46%] select-none opacity-90"
          style={{ aspectRatio: `1 / ${Number(gate?.eclipseRatio) || 0.863}` }}
        />
      ) : null}
      {phase === 'entry' && (
        <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center gap-4">
          {/* the pill */}
          <div
            className="relative w-full bg-white/[0.06] border-[0.5px] border-white/[0.14] backdrop-blur-sm"
            style={{ height: PILL_H, borderRadius: PILL_H / 2 }}
          >
            <div
              className="absolute flex items-center justify-center rounded-full bg-white/[0.10] border-[0.5px] border-white/[0.18]"
              style={{ left: PILL_PAD, top: PILL_PAD, width: ENV, height: ENV }}
            >
              <EnvelopeGlyph />
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={emailField?.placeholder || 'you@plutto.space'}
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              className="absolute bg-transparent outline-none text-[15px] font-light text-white
                         placeholder:text-white/[0.32]"
              style={{
                left: PILL_PAD + ENV + 10,
                right: PILL_PAD + ENV + 10,
                top: 0,
                bottom: 0,
                letterSpacing: '0.3px',
              }}
            />

            <button
              onClick={() => send('email')}
              aria-label="Continue"
              className={`absolute flex items-center justify-center rounded-full bg-white transition-opacity ${
                valid ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{ right: PILL_PAD, top: PILL_PAD, width: ENV, height: ENV }}
            >
              <ArrowGlyph />
            </button>
          </div>

          {/* the phone pill: the circle IS the country control */}
          {phoneField ? (
            <div
              className="relative w-full bg-white/[0.06] border-[0.5px] border-white/[0.14] backdrop-blur-sm"
              style={{ height: PILL_H, borderRadius: PILL_H / 2 }}
            >
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                aria-label={country ? `${country.name}, ${country.dial}. Change country` : 'Choose your country'}
                className="absolute flex items-center justify-center rounded-full bg-white/[0.10] border-[0.5px] border-white/[0.18] hover:bg-white/[0.16] transition-colors"
                style={{ left: PILL_PAD, top: PILL_PAD, width: ENV, height: ENV }}
              >
                {country ? <Flag country={country} size={22} /> : <PhoneGlyph />}
              </button>

              {/* Until a country is chosen there is nothing sensible to type: a
                  bare national number means nothing without its code. So the
                  field is a tap that asks the first question, not an input that
                  accepts an answer to the second. Same as the phone. */}
              {!country ? (
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="absolute top-0 bottom-0 flex items-center text-left text-[15px] font-light text-white/[0.32]"
                  style={{ left: PILL_PAD + ENV + 10, right: PILL_PAD + ENV + 10, letterSpacing: '0.3px' }}
                >
                  {phoneField.placeholder || '0000000000'}
                </button>
              ) : (
                <input
                  ref={phoneRef}
                  type="tel"
                  inputMode="tel"
                  value={digits}
                  onChange={(e) => setDigits(e.target.value.replace(/\D/g, '').slice(0, maxD))}
                  onKeyDown={(e) => e.key === 'Enter' && send('phone')}
                  placeholder={phoneField.placeholder || '0000000000'}
                  autoComplete="tel-national"
                  className="absolute bg-transparent outline-none text-[15px] font-light text-white placeholder:text-white/[0.32]"
                  style={{ left: PILL_PAD + ENV + 10, right: PILL_PAD + ENV + 10, top: 0, bottom: 0, letterSpacing: '0.3px' }}
                />
              )}

              <button
                onClick={() => send('phone')}
                aria-label="Continue"
                className={`absolute flex items-center justify-center rounded-full bg-white transition-opacity ${
                  phoneValid ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{ right: PILL_PAD, top: PILL_PAD, width: ENV, height: ENV }}
              >
                <ArrowGlyph />
              </button>
            </div>
          ) : null}

          <div className="h-px bg-white/[0.15] my-8" style={{ width: '66%' }} />

          <div className="flex gap-4">
            {SOCIAL_PROVIDERS.map((prov) => (
              <button
                key={prov}
                onClick={() => oauth(prov)}
                disabled={!!pending}
                className={`${circle} ${pending === prov ? 'animate-pulse' : ''}`}
                style={{ width: 48, height: 48 }}
                aria-label={`Sign in with ${prov === 'apple' ? 'Apple' : 'Google'}`}
              >
                {prov === 'apple' ? <AppleGlyph /> : <GoogleGlyph />}
              </button>
            ))}
          </div>

          {/* Continuing is agreeing — the same line, links and pages as the
              phone's auth screen, so App Review and a browser read one thing. */}
          <p
            data-no-auto-case
            className="mt-8 max-w-[300px] text-center text-[11px] leading-[1.6] text-white/40"
          >
            Continuing means you agree to our{' '}
            <a href="https://api.plutto.space/terms" target="_blank" rel="noreferrer"
               className="text-white/70 underline underline-offset-2 hover:text-white">Terms</a>
            {' '}and{' '}
            <a href="https://api.plutto.space/privacy" target="_blank" rel="noreferrer"
               className="text-white/70 underline underline-offset-2 hover:text-white">Privacy Policy</a>.
          </p>
        </div>
      )}

      {phase === 'sending' && (
        <div className="flex flex-col items-center">
          <div
            className="flex items-center justify-center rounded-full bg-white/[0.10] border-[0.5px] border-white/[0.18] animate-pulse"
            style={{ width: ENV, height: ENV }}
          >
            <EnvelopeGlyph />
          </div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.32em] text-white/40">Sending</p>
        </div>
      )}

      {(phase === 'verify' || phase === 'verifying') && (
        <div className="w-full max-w-[420px] flex flex-col items-center">
          <div className="flex gap-2.5" onClick={() => codeRef.current?.focus()}>
            {Array.from({ length: CODE_LEN }, (_, i) => {
              const digit = code[i];
              return (
                <div
                  key={i}
                  className={`flex items-center justify-center rounded-full border transition-colors ${
                    codeError
                      ? 'border-[rgba(255,90,60,0.85)]'
                      : digit
                      ? 'border-white/[0.85] bg-white/[0.05]'
                      : 'border-white/[0.22] bg-white/[0.02]'
                  }`}
                  style={{ width: 46, height: 46 }}
                >
                  {digit ? <span className="text-[17px] font-light text-white">{digit}</span> : null}
                </div>
              );
            })}
          </div>

          <input
            ref={codeRef}
            value={code}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={CODE_LEN}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, '').slice(0, CODE_LEN));
              if (codeError) setCodeError(false);
            }}
            className="absolute opacity-0 w-px h-px"
            aria-label="Verification code"
          />

          <p className="mt-6 text-[12px] text-white/40">
            {method === 'phone' ? fullPhone : email.trim()}
          </p>
          <div className="h-6 mt-2 flex items-center">
            {phase === 'verifying' && (
              <span className="inline-block h-2 w-2 rounded-full bg-gold/70 animate-pulse" />
            )}
          </div>

          <div className="h-px bg-white/[0.15] my-10" style={{ width: '66%' }} />

          <div className="flex gap-4">
            <button
              onClick={() => { setPhase('entry'); setCode(''); setCodeError(false); }}
              className={circle} style={{ width: 48, height: 48 }} aria-label="Back"
            >
              <span className="text-white/70 text-xl leading-none">‹</span>
            </button>
            <button onClick={() => send()} className={circle} style={{ width: 48, height: 48 }} aria-label="Resend code">
              <ResendGlyph />
            </button>
          </div>
        </div>
      )}

      {error && <p className="relative z-10 mt-10 text-[13px] text-red-300/80 text-center">{error}</p>}

      {/* THE COUNTRY PICKER — the app's sheet, as a sheet: search on top, the
          list under it, tap to choose and the number field takes focus. */}
      {pickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={() => setPickerOpen(false)}>
          <div className="flex max-h-[78vh] w-full max-w-[420px] flex-col rounded-t-[28px] bg-[#0c0c11] ring-1 ring-white/[0.1] sm:rounded-[28px]" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 pb-2">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={gate?.countrySearch || 'Search'}
                className="w-full rounded-full bg-white/[0.06] px-5 py-3 text-[15px] font-light text-white outline-none ring-[0.5px] ring-white/[0.14] placeholder:text-white/[0.32]"
              />
            </div>
            <ul className="overflow-y-auto px-2 pb-4">
              {shown.map((c) => (
                <li key={`${c.iso}-${c.dial}`} className="border-b border-white/[0.06] last:border-b-0">
                  <button type="button" onClick={() => chooseCountry(c)}
                          className="flex w-full items-center gap-4 px-3 py-3.5 text-left hover:bg-white/[0.04]">
                    <Flag country={c} size={26} />
                    <span className={`flex-1 text-[15px] font-light ${country?.iso === c.iso ? 'text-[#D4AF37]' : 'text-white/90'}`}>{c.name}</span>
                    <span className="text-[14px] tabular-nums text-white/50">{c.dial}</span>
                  </button>
                </li>
              ))}
              {!shown.length ? <li className="px-5 py-6 text-center text-[13px] text-white/40">Nothing matches.</li> : null}
            </ul>
          </div>
        </div>
      ) : null}

    </div>
  );
}
