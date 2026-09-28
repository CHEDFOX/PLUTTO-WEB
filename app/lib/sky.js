/**
 * THE SKY, IN THE BROWSER — the Moon and the Sun as the app computes them.
 *
 * The backend reads a Vedic chart as Swiss Ephemeris' apparent tropical
 * longitude minus swe.get_ayanamsa (Lahiri, the mean value, no nutation);
 * app/services/core/ephemeris.py. This module does the same with
 * astronomy-engine (MIT, VSOP87/ELP-grade), and the ayanamsa below is a fit to
 * swe.get_ayanamsa itself: 0.0001″ worst case from 1800 to 2200. Tested against
 * pyswisseph on random births (see the page's accuracy note for the figure).
 *
 * astronomy-engine is ~40 kB gzipped, so callers import this module lazily —
 * the page ships none of it until someone asks for a chart.
 */
import * as A from 'astronomy-engine';

const J2000 = 2451545.0;
const MS_PER_DAY = 86400000;
const EPOCH_JD = 2440587.5; // 1970-01-01T00:00Z

export const julianDayUT = (date) => date.getTime() / MS_PER_DAY + EPOCH_JD;

/** Lahiri ayanamsa in degrees, fitted to swe.get_ayanamsa (SIDM_LAHIRI). */
export function lahiri(jdUT) {
  const T = (jdUT - J2000) / 36525;
  return 23.857092334 + 1.3968879466 * T + 0.000307080175894 * T * T;
}

// ΔT (TT − UT, seconds) from Swiss Ephemeris' own swe.deltat, 1 January of
// every second year 1800–2200. astronomy-engine's default model drifts from it
// after 2020 (74 s against 69 s in 2025 — the Moon moves 0.5″ a second), so the
// two engines would disagree by up to a minute of arc on future dates.
const DT0 = 1800, DT_STEP = 2;
const DT = [18.6, 17.68, 16.75, 15.94, 15.37, 15.16, 15.37, 15.85, 16.36, 16.68, 16.6, 15.95, 14.85, 13.48, 12.04, 10.69, 9.58, 8.74, 8.15, 7.77, 7.61, 7.63, 7.82, 8.17, 8.66, 9.27, 9.93, 10.33, 10.15, 9.51, 9, 8.97, 8.72, 7.35, 4.88, 2.34, 0.52, -0.68, -1.61, -2.45, -3.24, -3.93, -4.36, -4.33, -4, -3.9, -4.39, -4.95, -4.88, -3.87, -1.99, 0.61, 3.5, 6.23, 8.68, 11.13, 13.74, 16.31, 18.51, 20.25, 21.61, 22.68, 23.48, 24.02, 24.31, 24.42, 24.37, 24.24, 24.08, 24.06, 24.42, 25.35, 26.51, 27.5, 28.24, 28.93, 29.7, 30.62, 31.35, 32.18, 33.15, 34, 35.03, 36.54, 38.29, 40.18, 42.23, 44.49, 46.46, 48.54, 50.54, 52.17, 53.79, 54.87, 55.82, 56.86, 58.31, 59.99, 61.63, 62.97, 63.83, 64.3, 64.57, 64.85, 65.46, 66.07, 66.6, 67.28, 68.1, 68.97, 69.36, 69.29, 69.1, 68.9, 68.8, 69.28, 69.76, 70.26, 70.76, 71.28, 71.8, 72.33, 72.88, 73.44, 74, 74.58, 75.17, 75.77, 76.38, 77.01, 77.64, 78.29, 78.95, 79.62, 80.31, 81.01, 81.72, 82.45, 83.19, 83.94, 84.7, 85.49, 86.28, 87.09, 87.92, 88.76, 89.61, 90.48, 91.36, 92.27, 93.18, 94.11, 95.06, 96.03, 97.01, 98.01, 99.03, 100.06, 101.11, 102.18, 103.27, 104.37, 105.49, 106.63, 107.79, 108.96, 110.14, 111.34, 112.56, 113.8, 115.06, 116.34, 117.64, 118.96, 120.3, 121.66, 123.04, 124.45, 125.87, 127.32, 128.79, 130.28, 131.79, 133.32, 134.88, 136.46, 138.06, 139.69, 141.33, 143.01, 144.7, 146.42, 148.16, 149.93, 151.72, 153.54, 155.38, 157.25, 159.14, 161.06, 163];
A.SetDeltaTFunction((ut) => {
  const y = 2000 + ut / 365.25 - DT0;
  const i = Math.floor(y / DT_STEP);
  if (i < 0 || i >= DT.length - 1) return A.DeltaT_EspenakMeeus(ut);
  const f = (y - i * DT_STEP) / DT_STEP;
  return DT[i] + (DT[i + 1] - DT[i]) * f;
});

const norm = (x) => ((x % 360) + 360) % 360;

export function moon(date) {
  const tropical = norm(A.EclipticGeoMoon(A.MakeTime(date)).lon);
  const ayanamsa = lahiri(julianDayUT(date));
  return { tropical, ayanamsa, sidereal: norm(tropical - ayanamsa) };
}

export function sun(date) {
  const tropical = norm(A.SunPosition(A.MakeTime(date)).elon);
  const ayanamsa = lahiri(julianDayUT(date));
  return { tropical, ayanamsa, sidereal: norm(tropical - ayanamsa) };
}

/** The instant the Sun reaches a tropical longitude, searching from `from`. */
export function sunReaches(lon, from, days = 400) {
  const t = A.SearchSunLongitude(lon, A.MakeTime(from), days);
  return t ? t.date : null;
}

/** Li Chun (start of spring, Sun at 315°) of a Gregorian year, as a UTC instant. */
export const liChun = (year) => sunReaches(315, new Date(Date.UTC(year, 0, 20)), 30);
