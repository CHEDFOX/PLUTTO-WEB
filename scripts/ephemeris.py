#!/usr/bin/env python3
"""
THE SKY CALENDAR'S DATA — generated with Swiss Ephemeris, the engine the
Plutto app computes with, so every date the site publishes is the app's own.

    pip install pyswisseph        # the backend already requires it
    python3 scripts/ephemeris.py  # writes app/lib/data/ephemeris.json

Sidereal positions are taken exactly as the backend takes them
(app/services/core/ephemeris.py): the apparent tropical longitude minus
swe.get_ayanamsa (Lahiri), and Rahu is the TRUE node (swe id 11) as in the
app; the mean node is generated beside it, because most printed panchangs use it. Every event
time is found by bisection to one second. Re-run it to extend the years; the
output is deterministic, so a diff shows exactly what moved.
"""
import json
import os
import swisseph as swe

YEARS = (2025, 2029)          # the date pages publish 2026-2028; a year either side for "next"/"previous"
SATURN_YEARS = (1900, 2101)   # Sade Sati: a lifetime either side of today
EPH = os.environ.get('SE_EPHE_PATH')
if EPH:
    swe.set_ephe_path(EPH)
swe.set_sid_mode(swe.SIDM_LAHIRI)

SUN, MOON, MERCURY, VENUS, MARS, JUPITER, SATURN, URANUS, NEPTUNE, PLUTO, TRUE_NODE, MEAN_NODE = (
    swe.SUN, swe.MOON, swe.MERCURY, swe.VENUS, swe.MARS, swe.JUPITER, swe.SATURN, swe.URANUS, swe.NEPTUNE, swe.PLUTO, swe.TRUE_NODE, swe.MEAN_NODE)
NAMES = {SUN: 'Sun', MERCURY: 'Mercury', VENUS: 'Venus', MARS: 'Mars', JUPITER: 'Jupiter', SATURN: 'Saturn',
         URANUS: 'Uranus', NEPTUNE: 'Neptune', PLUTO: 'Pluto', TRUE_NODE: 'Rahu', MEAN_NODE: 'RahuMean'}
SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
SEC = 1 / 86400


def jd_of(y, m=1, d=1):
    return swe.julday(y, m, d, 0.0)


def ms(jd):
    """Julian day (UT) → Unix milliseconds, rounded to the second."""
    return int(round((jd - 2440587.5) * 86400)) * 1000


def lon(jd, body, sidereal):
    t = swe.calc_ut(jd, body, swe.FLG_SWIEPH | swe.FLG_SPEED)[0]
    x = t[0] - (swe.get_ayanamsa(jd) if sidereal else 0.0)
    return x % 360.0, t[3]


def bisect(f, a, b):
    """f(a) != f(b); the instant f changes, to the second."""
    fa = f(a)
    while b - a > SEC:
        m = (a + b) / 2
        if f(m) == fa:
            a = m
        else:
            b = m
    return b


def ingresses(body, sidereal, y0, y1, step):
    out = []
    sign = lambda jd: int(lon(jd, body, sidereal)[0] // 30)
    a, end = jd_of(y0), jd_of(y1)
    s = sign(a)
    while a < end:
        b = a + step
        t = sign(b)
        if t != s:
            when = bisect(sign, a, b)
            spd = lon(when, body, sidereal)[1]
            out.append({'t': ms(when), 'sign': SIGNS[t], 'from': SIGNS[s], 'retro': spd < 0})
            s = t
        a = b
    return out


def stations(body, y0, y1, step=0.5):
    out = []
    moving = lambda jd: lon(jd, body, False)[1] < 0
    a, end = jd_of(y0), jd_of(y1)
    r = moving(a)
    while a < end:
        b = a + step
        q = moving(b)
        if q != r:
            when = bisect(moving, a, b)
            tl, _ = lon(when, body, False)
            sl, _ = lon(when, body, True)
            out.append({'t': ms(when), 'kind': 'retrograde' if q else 'direct', 'trop': round(tl, 4), 'sid': round(sl, 4)})
            r = q
        a = b
    return out


def eclipses(y0, y1):
    out = []
    jd, end = jd_of(y0), jd_of(y1)
    while True:
        res, tret = swe.sol_eclipse_when_glob(jd, swe.FLG_SWIEPH, 0)
        if tret[0] >= end:
            break
        kind = ('total' if res & swe.ECL_TOTAL else 'annular' if res & swe.ECL_ANNULAR else
                'hybrid' if res & swe.ECL_ANNULAR_TOTAL else 'partial')
        where = swe.sol_eclipse_where(tret[0], swe.FLG_SWIEPH)
        pos, att = where[1], where[2]
        sun_t, _ = lon(tret[0], SUN, False)
        sun_s, _ = lon(tret[0], SUN, True)
        out.append({'t': ms(tret[0]), 'body': 'solar', 'kind': kind, 'magnitude': round(att[0], 4),
                    'lat': round(pos[1], 2), 'lon': round(pos[0], 2), 'trop': round(sun_t, 3), 'sid': round(sun_s, 3)})
        jd = tret[0] + 1
    jd = jd_of(y0)
    while True:
        res, tret = swe.lun_eclipse_when(jd, swe.FLG_SWIEPH, 0)
        if tret[0] >= end:
            break
        kind = 'total' if res & swe.ECL_TOTAL else 'partial' if res & swe.ECL_PARTIAL else 'penumbral'
        how = swe.lun_eclipse_how(tret[0], (0, 0, 0), swe.FLG_SWIEPH)[1]
        moon_t, _ = lon(tret[0], MOON, False)
        moon_s, _ = lon(tret[0], MOON, True)
        out.append({'t': ms(tret[0]), 'body': 'lunar', 'kind': kind, 'umbral': round(how[0], 4), 'penumbral': round(how[1], 4),
                    'trop': round(moon_t, 3), 'sid': round(moon_s, 3)})
        jd = tret[0] + 1
    return sorted(out, key=lambda e: e['t'])


def main():
    y0, y1 = YEARS
    data = {
        'generated': 'Swiss Ephemeris ' + swe.version + ('' if EPH else ' (Moshier)'),
        'years': list(range(y0, y1)),
        'sidereal': {NAMES[b]: ingresses(b, True, y0, y1, 0.25 if b in (SUN, MERCURY, VENUS, MARS, TRUE_NODE, MEAN_NODE) else 1)
                     for b in (SUN, MERCURY, VENUS, MARS, JUPITER, SATURN, TRUE_NODE, MEAN_NODE)},
        'tropical': {NAMES[b]: ingresses(b, False, y0, y1, 0.25 if b in (SUN, MERCURY, VENUS, MARS, TRUE_NODE) else 1)
                     for b in (SUN, MERCURY, VENUS, MARS, JUPITER, SATURN, URANUS, NEPTUNE, PLUTO, TRUE_NODE)},
        'stations': {NAMES[b]: stations(b, y0, y1) for b in (MERCURY, VENUS, MARS, JUPITER, SATURN, URANUS, NEPTUNE, PLUTO)},
        'eclipses': eclipses(y0, y1),
    }
    # Saturn alone goes to the browser (the Sade Sati calculator), so it is
    # its own small file rather than a slice of this one.
    saturn = ingresses(SATURN, True, *SATURN_YEARS, 1)
    path = os.path.join(os.path.dirname(__file__), '..', 'app', 'lib', 'data', 'ephemeris.json')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        json.dump(data, f, separators=(',', ':'))
    spath = os.path.join(os.path.dirname(path), 'saturn.json')
    with open(spath, 'w') as f:
        json.dump({'generated': data['generated'], 'ingresses': [[x['t'] // 1000, SIGNS.index(x['sign'])] for x in saturn],
                   'start': SIGNS.index(saturn[0]['from'])}, f, separators=(',', ':'))
    print(f"wrote {os.path.normpath(path)}: {os.path.getsize(path)} bytes, {len(data['eclipses'])} eclipses; "
          f"{os.path.normpath(spath)}: {os.path.getsize(spath)} bytes, {len(saturn)} Saturn ingresses")


if __name__ == '__main__':
    main()
