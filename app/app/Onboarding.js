'use client';

/**
 * ONBOARDING — composed to match the app's screens, not merely to collect the
 * same fields.
 *
 * Taken from LanguageSelectScreen.js and BirthDetailsScreen.js:
 *  • Language: the greeting rotates through the languages at 52px/weight-300,
 *    centred, then rises; below it a wrapped grid of 105×52 pills (radius 26,
 *    0.5px border at 12% white). Tapping a language selects immediately — there
 *    is no Continue on that screen.
 *  • Birth: a '‹' back glyph top-left, a 20px/weight-200 title with 1.2px
 *    tracking, and a Continue that is TEXT (12px, weight 500, 3px tracking),
 *    white when enabled and 18% white when not — never a filled button.
 *  • Identity is "Hello," + a name chip (a ＋ circle until typed) with three
 *    gender circles beneath.
 *  • Date and time are two rows of scroll wheels, day·month·year then hour:minute.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { getOnboarding, recommendSystem, searchPlaces, placeDetails } from '../lib/api';

const STEPS = ['language', 'identity', 'when', 'place', 'system'];
const ROTATE_MS = 2500;
const FADE_MS = 280;
const ARRIVAL_HOLD_MS = 2500;

/* ── the app's Continue: text only, never a filled pill ── */
function Continue({ disabled, onClick, children }) {
  return (
    <div className="mt-14 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`bg-transparent px-8 py-3 text-[12px] font-medium transition-colors ${
          disabled ? 'text-white/[0.18] cursor-default' : 'text-white hover:text-gold'
        }`}
        style={{ letterSpacing: '3px' }}
      >
        {children}
      </button>
    </div>
  );
}

function Back({ onClick, hidden }) {
  if (hidden) return null;
  return (
    <button
      onClick={onClick}
      aria-label="Back"
      className="absolute left-2 top-2 p-3 text-[30px] font-extralight leading-none text-silver
                 hover:text-white transition-colors"
    >
      ‹
    </button>
  );
}

function Title({ children }) {
  return (
    <h1
      className="text-center text-white whitespace-pre-line"
      style={{ fontSize: 20, fontWeight: 200, letterSpacing: '1.2px', lineHeight: '30px' }}
    >
      {children}
    </h1>
  );
}

/* ── a scroll wheel, standing in for the app's native picker ── */
function Wheel({ values, value, onChange, label, format = (v) => v }) {
  const ref = useRef(null);
  const ROW = 34;
  const touched = value != null;

  // Keep the selected row centred when the value changes from outside.
  useEffect(() => {
    const el = ref.current;
    if (!el || value == null) return;
    const i = values.indexOf(value);
    if (i >= 0) el.scrollTop = i * ROW;
  }, [value, values]);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    clearTimeout(el._t);
    el._t = setTimeout(() => {
      const i = Math.round(el.scrollTop / ROW);
      const v = values[Math.max(0, Math.min(values.length - 1, i))];
      if (v !== value) onChange(v);
    }, 90);
  };

  return (
    <div className="relative" style={{ width: 92, height: ROW * 3 }}>
      {!touched && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="text-[11px] font-medium text-white" style={{ letterSpacing: 2 }}>
            {label}
          </span>
        </div>
      )}
      <div
        ref={ref}
        onScroll={onScroll}
        className="h-full overflow-y-auto no-scrollbar"
        style={{ scrollSnapType: 'y mandatory', paddingTop: ROW, paddingBottom: ROW }}
      >
        {values.map((v) => (
          <div
            key={v}
            onClick={() => onChange(v)}
            className={`flex items-center justify-center cursor-pointer transition-colors ${
              v === value ? 'text-gold' : 'text-white/70 hover:text-white'
            }`}
            style={{
              height: ROW,
              scrollSnapAlign: 'center',
              fontSize: v === value ? 14 : 15,
              fontWeight: v === value ? 200 : 300,
              letterSpacing: '0.5px',
              opacity: touched ? 1 : 0.25,
            }}
          >
            {format(v)}
          </div>
        ))}
      </div>
    </div>
  );
}

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const pad = (n) => String(n).padStart(2, '0');

export default function Onboarding({ onComplete, busy, error }) {
  const [content, setContent] = useState(null);
  const [step, setStep] = useState('language');

  const [lang, setLang] = useState('en');
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);
  const [place, setPlace] = useState(null);
  const [system, setSystem] = useState(null);
  const [recommended, setRecommended] = useState(null);

  // language screen animation state
  const [greetIdx, setGreetIdx] = useState(0);
  const [greetVisible, setGreetVisible] = useState(true);
  const [arrived, setArrived] = useState(false);

  const [q, setQ] = useState('');
  const [preds, setPreds] = useState([]);
  const [searching, setSearching] = useState(false);
  const timer = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

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
  const languages = useMemo(() => content?.languages || [], [content]);
  const labels = birth.labels || {};
  const CONTINUE = birth.continue || 'CONTINUE';
  const months = birth.months || ['January','February','March','April','May','June',
                                  'July','August','September','October','November','December'];

  // The greeting holds, then rises; afterwards it rotates through the languages.
  useEffect(() => {
    if (step !== 'language' || arrived) return;
    const t = setTimeout(() => setArrived(true), ARRIVAL_HOLD_MS);
    return () => clearTimeout(t);
  }, [step, arrived]);

  useEffect(() => {
    if (step !== 'language' || !languages.length) return;
    const t = setInterval(() => {
      setGreetVisible(false);
      setTimeout(() => {
        setGreetIdx((i) => (i + 1) % languages.length);
        setGreetVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [step, languages.length]);

  useEffect(() => {
    if (step !== 'system' || !place) return;
    let live = true;
    recommendSystem({
      birth_lat: place.lat, birth_lng: place.lng, birth_place: place.name,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).then((r) => live && r?.recommended && setRecommended(r.recommended)).catch(() => {});
    return () => { live = false; };
  }, [step, place]);

  const onPlaceInput = (v) => {
    setQ(v); setPlace(null);
    clearTimeout(timer.current);
    if (v.trim().length < 2) { setPreds([]); setSearching(false); return; }
    setSearching(true);
    timer.current = setTimeout(async () => {
      setPreds((await searchPlaces(v)).slice(0, 5));
      setSearching(false);
    }, 280);
  };

  const choosePlace = async (p) => {
    const desc = p.description || p.name || '';
    setQ(desc); setPreds([]);
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

  const finish = () =>
    onComplete({
      name: name.trim(),
      gender: gender || 'other',
      language: lang,
      system: system || recommended || sysScreen.recommended || 'bphs',
      date: { day, month, year },
      time: { hour: hour ?? 12, minute: minute ?? 0 },
      place,
    });

  const dateReady = day && month && year;
  const timeReady = hour != null && minute != null;

  const greeting = languages[greetIdx]?.greeting || '';

  /* ────────────────── LANGUAGE ────────────────── */
  if (step === 'language') {
    return (
      <div className="relative min-h-[85vh]">
        <p
          className="absolute left-0 right-0 text-center text-white transition-all ease-out"
          style={{
            fontSize: 52,
            fontWeight: 300,
            top: arrived ? '10%' : '40%',
            opacity: greetVisible ? 1 : 0,
            transitionDuration: `${arrived ? 1200 : FADE_MS}ms, ${FADE_MS}ms`,
            transitionProperty: 'top, opacity',
          }}
        >
          {greeting}
        </p>

        <div
          className="absolute left-0 right-0 transition-opacity duration-700"
          style={{ top: '36%', bottom: '6%', opacity: arrived ? 1 : 0 }}
        >
          <div className="h-full overflow-y-auto no-scrollbar">
            <div className="flex flex-wrap justify-center gap-4 pb-8">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setStep('identity'); }}
                  className="flex items-center justify-center border-[0.5px] border-white/[0.12]
                             hover:border-white/40 transition-colors"
                  style={{ width: 105, height: 52, borderRadius: 26 }}
                >
                  <span className="text-[15px] font-light text-white" style={{ letterSpacing: '0.5px' }}>
                    {l.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Link
          href="/app/why"
          className="absolute bottom-0 left-0 right-0 text-center text-[11px] uppercase
                     tracking-[0.28em] text-white/25 hover:text-white/55 transition-colors"
        >
          Skip — first tell me what this is
        </Link>
      </div>
    );
  }

  /* ────────────────── BIRTH + SYSTEM ────────────────── */
  return (
    <div className="relative min-h-[85vh] pt-16">
      <Back onClick={back} />

      {step === 'identity' && (
        <>
          <Title>{birth.identityTitle || 'Who Are You?'}</Title>

          <div className="mt-24 flex flex-col items-center">
            <div className="flex items-center gap-3">
              <span className="text-[22px] font-extralight text-white">
                {birth.namePrefix || 'Hello,'}
              </span>
              <div
                onClick={() => nameRef.current?.focus()}
                className="flex items-center gap-2 cursor-text"
              >
                {!name && (
                  <span
                    className="flex items-center justify-center rounded-full border-[0.5px] border-gold/60 text-gold text-[15px]"
                    style={{ width: 26, height: 26 }}
                  >
                    ＋
                  </span>
                )}
                <input
                  ref={nameRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={birth.namePlaceholder || 'Add Name'}
                  autoComplete="name"
                  className="bg-transparent outline-none text-[22px] font-extralight text-gold
                             placeholder:text-gold/70"
                  style={{ width: Math.max(9, (name.length || 9) + 1) + 'ch' }}
                />
              </div>
            </div>

            <div className="mt-16 flex gap-10">
              {[
                ['female', birth.genderFemale || 'FEMALE'],
                ['male', birth.genderMale || 'MALE'],
                ['other', birth.genderOther || 'OTHER'],
              ].map(([g, lbl]) => {
                const on = gender === g;
                return (
                  <button key={g} onClick={() => setGender(g)} className="flex flex-col items-center gap-3">
                    <span
                      className={`flex items-center justify-center rounded-full border transition-colors ${
                        on ? 'border-gold' : 'border-white/[0.18]'
                      }`}
                      style={{ width: 64, height: 64 }}
                    >
                      <span className={`text-[22px] ${on ? 'text-gold' : 'text-white/85'}`}>
                        {g === 'female' ? '♀' : g === 'male' ? '♂' : '⊕'}
                      </span>
                    </span>
                    <span
                      className={`text-[10px] ${on ? 'text-gold' : 'text-white/45'}`}
                      style={{ letterSpacing: 2 }}
                    >
                      {lbl}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Continue disabled={!name.trim() || !gender} onClick={() => setStep('when')}>
            {CONTINUE}
          </Continue>
        </>
      )}

      {step === 'when' && (
        <>
          <Title>{birth.combinedTitle || 'When Did You Arrive\nOn Earth?'}</Title>

          <div className="mt-20 flex items-center justify-center gap-2">
            <Wheel values={range(1, 31)} value={day} onChange={setDay} label={labels.day || 'DAY'} />
            <Wheel values={range(1, 12)} value={month} onChange={setMonth}
                   label={labels.month || 'MONTH'} format={(m) => months[m - 1]} />
            <Wheel values={range(1920, new Date().getFullYear())} value={year} onChange={setYear}
                   label={labels.year || 'YEAR'} />
          </div>

          <div className="mt-12 flex items-center justify-center gap-1">
            <Wheel values={range(0, 23)} value={hour} onChange={setHour}
                   label={labels.hour || 'HOUR'} format={pad} />
            <span className="text-[22px] font-extralight text-silver mx-1">
              {birth.timeSeparator || ':'}
            </span>
            <Wheel values={range(0, 59)} value={minute} onChange={setMinute}
                   label={labels.minute || 'MINUTE'} format={pad} />
          </div>

          <Continue disabled={!dateReady || !timeReady} onClick={() => setStep('place')}>
            {CONTINUE}
          </Continue>
        </>
      )}

      {step === 'place' && (
        <>
          <Title>{birth.placeTitle || 'Where Did You Take\nYour First Breath?'}</Title>

          <div className="mx-auto mt-24 w-full max-w-md px-6">
            <input
              value={q}
              onChange={(e) => onPlaceInput(e.target.value)}
              placeholder={birth.placePlaceholder || 'Search city'}
              autoComplete="off"
              className="w-full bg-transparent outline-none text-center text-[13px] font-light
                         text-white placeholder:text-ash py-3 border-b-[0.5px] border-white/[0.15]"
              style={{ letterSpacing: 1 }}
            />
            {searching && !preds.length && (
              <p className="mt-4 text-center text-[11px] text-white/25">…</p>
            )}
            {preds.length > 0 && (
              <div className="mt-4 rounded-xl border-[0.5px] border-white/10 bg-abyss overflow-hidden max-h-[220px] overflow-y-auto">
                {preds.map((p, i) => {
                  const full = p.description || p.name || '';
                  return (
                    <button key={p.place_id || i} onClick={() => choosePlace(p)}
                      className="block w-full text-left px-5 py-3 border-b border-white/[0.06] hover:bg-white/5 transition-colors">
                      <p className="text-[15px] font-light text-white">{full.split(',')[0]}</p>
                      <p className="text-[11px] text-silver mt-0.5 truncate">{full}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Continue disabled={!place} onClick={() => setStep('system')}>
            {CONTINUE}
          </Continue>
        </>
      )}

      {step === 'system' && (
        <>
          <Title>{sysScreen.title || 'Choose your path'}</Title>
          {sysScreen.subtitle && (
            <p className="mx-auto mt-5 max-w-sm px-6 text-center text-[13px] font-light leading-relaxed text-white/45">
              {sysScreen.subtitle}
            </p>
          )}

          <div className="mx-auto mt-14 w-full max-w-md px-6 space-y-3">
            {(sysScreen.systems || [
              { id: 'bphs', label: 'Jyotish' },
              { id: 'western', label: 'Hermetica' },
              { id: 'chinese', label: 'BaZi' },
            ]).map((s) => {
              const rec = (recommended || sysScreen.recommended) === s.id;
              const on = (system || recommended || sysScreen.recommended) === s.id;
              return (
                <button key={s.id} onClick={() => setSystem(s.id)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border-[0.5px] transition-colors ${
                    on ? 'border-gold/70 bg-gold/[0.04]' : 'border-white/[0.12] hover:border-white/30'
                  }`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[19px] font-light text-white">{s.label}</span>
                    {rec && sysScreen.badge && (
                      <span className="text-[9px] uppercase text-gold" style={{ letterSpacing: 2 }}>
                        {sysScreen.badge}
                      </span>
                    )}
                  </div>
                  {s.blurb && <p className="mt-1 text-[12px] text-white/40">{s.blurb}</p>}
                </button>
              );
            })}
          </div>

          {error && <p className="mt-8 text-center text-[13px] text-red-300/80">{error}</p>}

          <Continue disabled={busy} onClick={finish}>
            {busy ? '…' : CONTINUE}
          </Continue>
        </>
      )}
    </div>
  );
}
