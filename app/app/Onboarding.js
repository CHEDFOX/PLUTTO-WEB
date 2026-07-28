'use client';

/**
 * ONBOARDING — the app's flow, on the web.
 *
 * The mobile app runs language → birth(identity → date/time → place) → system,
 * and every word of it comes from the backend (/onboarding-content). Web reads
 * the SAME payload, so the two clients ask the same questions in the same words
 * in the same order, and a copy change ships to both at once.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getOnboarding, recommendSystem, searchPlaces, placeDetails } from '../lib/api';

const STEPS = ['language', 'identity', 'when', 'place', 'system'];

const field =
  'w-full bg-transparent border-b border-mist focus:border-gold/60 outline-none ' +
  'py-3 text-white placeholder:text-white/25 transition-colors';
const label = 'block text-[10px] uppercase tracking-[0.32em] text-white/40 mb-1';

function Title({ children }) {
  return (
    <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight whitespace-pre-line">
      {children}
    </h1>
  );
}

function Continue({ disabled, onClick, children }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`mt-12 w-full py-4 rounded-full text-[11px] uppercase tracking-[0.32em] transition-all ${
        disabled
          ? 'border border-mist text-white/25 cursor-not-allowed'
          : 'bg-gold text-black hover:brightness-110'
      }`}
    >
      {children}
    </button>
  );
}

export default function Onboarding({ onComplete, busy, error }) {
  const [content, setContent] = useState(null);
  const [step, setStep] = useState('language');

  // collected answers
  const [lang, setLang] = useState('en');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('female');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [place, setPlace] = useState(null);
  const [system, setSystem] = useState(null);
  const [recommended, setRecommended] = useState(null);

  // place search
  const [q, setQ] = useState('');
  const [preds, setPreds] = useState([]);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  // Backend copy for the CURRENT language — refetched when the user picks one,
  // so every later screen speaks their language exactly as the app does.
  useEffect(() => {
    let live = true;
    getOnboarding(lang)
      .then((c) => live && setContent(c))
      .catch(() => live && setContent((c) => c || { languages: [], screens: {} }));
    return () => { live = false; };
  }, [lang]);

  const screens = content?.screens || {};
  const birth = screens.birth || {};
  const sysScreen = screens.system || {};
  const languages = content?.languages || [];
  const labels = birth.labels || {};
  const CONTINUE = birth.continue || 'Continue';

  // Ask the backend which tradition fits, exactly as the app's system screen does.
  useEffect(() => {
    if (step !== 'system' || !place) return;
    let live = true;
    recommendSystem({
      birth_lat: place.lat,
      birth_lng: place.lng,
      birth_place: place.name,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
      .then((r) => live && r?.recommended && setRecommended(r.recommended))
      .catch(() => {});
    return () => { live = false; };
  }, [step, place]);

  const onPlaceInput = (v) => {
    setQ(v);
    setPlace(null);
    clearTimeout(timer.current);
    if (v.trim().length < 2) { setPreds([]); return; }
    timer.current = setTimeout(async () => {
      setPreds((await searchPlaces(v)).slice(0, 5));
    }, 280);
  };

  const choosePlace = async (p) => {
    const desc = p.description || p.name || '';
    setQ(desc);
    setPreds([]);
    const id = p.place_id || p.placeId;
    if (id) {
      const d = await placeDetails(id);
      if (d && d.lat != null) { setPlace({ name: desc, lat: d.lat, lng: d.lng }); return; }
    }
    if (p.lat != null) setPlace({ name: desc, lat: p.lat, lng: p.lng });
  };

  const back = () => {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
  };

  const finish = (chosenSystem) => {
    onComplete({
      name: name.trim(),
      gender,
      language: lang,
      system: chosenSystem || system || recommended || sysScreen.recommended || 'bphs',
      date: { day: Number(day), month: Number(month), year: Number(year) },
      time: unknownTime
        ? { hour: 12, minute: 0 }
        : { hour: Number(hour) || 12, minute: Number(minute) || 0 },
      place,
      unknownTime,
    });
  };

  const dateReady = day && month && year && String(year).length === 4;
  const months = content?.months || screens.birth?.months || null;

  return (
    <div className="mx-auto w-full max-w-md">
      {/* progress + back, mirroring the app's per-step header */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={back}
          disabled={STEPS.indexOf(step) === 0}
          className="text-[10px] uppercase tracking-[0.32em] text-white/30 hover:text-white/60
                     transition-colors disabled:opacity-0"
        >
          ← Back
        </button>
        <div className="flex gap-1.5">
          {STEPS.map((s) => (
            <span
              key={s}
              className={`h-px w-6 transition-colors ${
                STEPS.indexOf(s) <= STEPS.indexOf(step) ? 'bg-gold' : 'bg-mist'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── 1. LANGUAGE ── */}
      {step === 'language' && (
        <>
          <Title>Choose your{'\n'}language.</Title>
          <p className="mt-4 text-sm leading-relaxed text-white/45">
            Every reading, and the Oracle itself, will speak it.
          </p>
          <div className="mt-10 max-h-[26rem] overflow-y-auto pr-1 grid grid-cols-2 gap-2">
            {(languages.length ? languages : [{ code: 'en', name: 'English', greeting: 'Hello' }]).map(
              (l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                    lang === l.code
                      ? 'border-gold/70 bg-gold/5'
                      : 'border-mist hover:border-white/25'
                  }`}
                >
                  <p className="font-serif text-base text-white">{l.name}</p>
                  <p className="text-[11px] text-white/35">{l.greeting}</p>
                </button>
              )
            )}
          </div>
          <Continue disabled={!lang} onClick={() => setStep('identity')}>
            {CONTINUE}
          </Continue>
        </>
      )}

      {/* ── 2. IDENTITY ── */}
      {step === 'identity' && (
        <>
          <Title>{birth.identityTitle || 'Who Are You?'}</Title>
          <div className="mt-12">
            <label className={label} htmlFor="name">
              {birth.namePrefix || 'Hello,'}
            </label>
            <input
              id="name"
              className={field}
              value={name}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              placeholder={birth.namePlaceholder || 'Your name'}
            />
          </div>
          <div className="mt-10 flex gap-2">
            {[
              ['female', birth.genderFemale || 'FEMALE'],
              ['male', birth.genderMale || 'MALE'],
              ['other', birth.genderOther || 'OTHER'],
            ].map(([g, lbl]) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] border rounded-full transition-colors ${
                  gender === g ? 'border-gold/70 text-gold' : 'border-mist text-white/40 hover:text-white/70'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <Continue disabled={!name.trim()} onClick={() => setStep('when')}>
            {CONTINUE}
          </Continue>
        </>
      )}

      {/* ── 3. WHEN (date + time together, as the app's 'combined' step) ── */}
      {step === 'when' && (
        <>
          <Title>{birth.combinedTitle || 'When Did You Arrive\nOn Earth?'}</Title>
          <div className="mt-12 grid grid-cols-3 gap-3">
            <div>
              <span className={label}>{labels.day || 'DAY'}</span>
              <input className={field} inputMode="numeric" value={day} placeholder="15"
                     onChange={(e) => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))} />
            </div>
            <div>
              <span className={label}>{labels.month || 'MONTH'}</span>
              <select className={`${field} appearance-none`} value={month}
                      onChange={(e) => setMonth(e.target.value)}>
                <option value="" className="bg-card">—</option>
                {(months || ['January','February','March','April','May','June','July',
                             'August','September','October','November','December']).map((m, i) => (
                  <option key={m} value={i + 1} className="bg-card">{m}</option>
                ))}
              </select>
            </div>
            <div>
              <span className={label}>{labels.year || 'YEAR'}</span>
              <input className={field} inputMode="numeric" value={year} placeholder="1990"
                     onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))} />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div>
              <span className={label}>{labels.hour || 'HOUR'}</span>
              <input className={field} inputMode="numeric" value={hour} disabled={unknownTime} placeholder="14"
                     onChange={(e) => setHour(e.target.value.replace(/\D/g, '').slice(0, 2))} />
            </div>
            <div>
              <span className={label}>{labels.minute || 'MINUTE'}</span>
              <input className={field} inputMode="numeric" value={minute} disabled={unknownTime} placeholder="30"
                     onChange={(e) => setMinute(e.target.value.replace(/\D/g, '').slice(0, 2))} />
            </div>
          </div>

          <button type="button" onClick={() => setUnknownTime((v) => !v)}
            className="mt-4 text-[11px] tracking-wide text-white/35 hover:text-white/60 transition-colors">
            {unknownTime ? '◉' : '○'} I don&rsquo;t know my birth time
          </button>
          {unknownTime && (
            <p className="mt-2 text-[11px] leading-relaxed text-white/30">
              We&rsquo;ll read from noon. Planets and numbers stay accurate; the
              hour-sensitive parts become approximate.
            </p>
          )}

          <Continue disabled={!dateReady} onClick={() => setStep('place')}>
            {CONTINUE}
          </Continue>
        </>
      )}

      {/* ── 4. PLACE ── */}
      {step === 'place' && (
        <>
          <Title>{birth.placeTitle || 'Where Did You Take\nYour First Breath?'}</Title>
          <div className="relative mt-12">
            <input className={field} value={q} autoComplete="off"
                   onChange={(e) => onPlaceInput(e.target.value)}
                   placeholder={birth.placePlaceholder || 'Search city'} />
            {place && <span className="absolute right-0 top-3 text-gold text-xs">✓</span>}
            {preds.length > 0 && (
              <ul className="absolute z-20 left-0 right-0 mt-1 bg-card border border-mist rounded-lg overflow-hidden">
                {preds.map((p, i) => (
                  <li key={p.place_id || i}>
                    <button type="button" onClick={() => choosePlace(p)}
                      className="w-full text-left px-4 py-3 text-sm text-white/75 hover:bg-white/5 transition-colors">
                      {p.description || p.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Continue disabled={!place} onClick={() => setStep('system')}>
            {CONTINUE}
          </Continue>
        </>
      )}

      {/* ── 5. SYSTEM ── */}
      {step === 'system' && (
        <>
          <Title>{sysScreen.title || 'Choose your path'}</Title>
          {sysScreen.subtitle && (
            <p className="mt-4 text-sm leading-relaxed text-white/45">{sysScreen.subtitle}</p>
          )}
          <div className="mt-10 space-y-3">
            {(sysScreen.systems || [
              { id: 'bphs', label: 'Jyotish' },
              { id: 'western', label: 'Hermetica' },
              { id: 'chinese', label: 'BaZi' },
            ]).map((s) => {
              const isRec = (recommended || sysScreen.recommended) === s.id;
              const active = (system || recommended || sysScreen.recommended) === s.id;
              return (
                <button key={s.id} onClick={() => setSystem(s.id)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-colors ${
                    active ? 'border-gold/70 bg-gold/5' : 'border-mist hover:border-white/25'
                  }`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-serif text-xl text-white">{s.label}</span>
                    {isRec && sysScreen.badge && (
                      <span className="text-[9px] uppercase tracking-[0.24em] text-gold">
                        {sysScreen.badge}
                      </span>
                    )}
                  </div>
                  {s.blurb && <p className="mt-1 text-[12px] text-white/40">{s.blurb}</p>}
                </button>
              );
            })}
          </div>

          {error && <p className="mt-8 text-sm text-red-300/80">{error}</p>}

          <Continue disabled={busy} onClick={() => finish()}>
            {busy ? 'Reading the sky…' : CONTINUE}
          </Continue>
        </>
      )}

      <p className="mt-8 text-[11px] leading-relaxed text-white/25">
        Your details stay in this browser and are sent only to compute your readings.
      </p>

      {step === 'language' && (
        <Link href="/app/why"
          className="mt-6 block text-center text-[11px] uppercase tracking-[0.28em]
                     text-white/30 hover:text-white/60 transition-colors">
          Skip — first tell me what this is
        </Link>
      )}
    </div>
  );
}
