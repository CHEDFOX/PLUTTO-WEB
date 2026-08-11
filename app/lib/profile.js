'use client';

/**
 * REMOTE PROFILE — the enrollment record shared with the phone.
 *
 * store.js keeps the profile and chart in localStorage, which was written before
 * web auth existed and says so: "when web auth lands, this becomes the cache in
 * front of the server-held profile rather than the source of truth." Auth landed;
 * that conversion did not. So the web app signed people in correctly, confirmed
 * their subscription, then looked in this browser's localStorage for a chart,
 * found none, and ran onboarding — for someone already enrolled on their phone.
 *
 * This is the missing half. `profiles` is the same row the app reads (App.js:220):
 * onboarded AND birth_year both set is what "already enrolled" means, on either
 * client. `kundli_cache` holds the computed chart.
 *
 * Column conventions are the app's, deliberately:
 *   birth_month is 1-12. The app calls it monthIndex, but backend.js:150 maps that
 *   value straight into the API's 1-based `month`, so the name is a misnomer and
 *   the storage is 1-based. Writing 0-based here would land every web-entered
 *   chart one month off on the phone.
 */
import { supabase } from './supabase';

/** The web-shaped profile (what Onboarding submits) from a stored profiles row. */
function rowToProfile(row) {
  return {
    name: row.name || '',
    gender: row.gender || '',
    language: row.language || 'en',
    date: {
      day: Number(row.birth_day),
      month: Number(row.birth_month),
      year: Number(row.birth_year),
    },
    time: {
      hour: Number(row.birth_hour) || 0,
      minute: Number(row.birth_minute) || 0,
    },
    place: {
      name: row.birth_place || '',
      lat: Number(row.birth_lat),
      lng: Number(row.birth_lng),
    },
  };
}

/**
 * The enrolled session for this user, or null when they are not enrolled.
 *
 * Returns null ONLY when the account genuinely has no enrollment. A network or
 * permission failure returns undefined instead, so the caller can leave whatever
 * local session exists alone rather than dropping a real user into onboarding
 * because a query timed out.
 */
export async function loadRemoteSession(user) {
  if (!user?.id) return null;
  let row;
  try {
    const { data, error } = await supabase
      .from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (error) throw error;
    row = data;
  } catch (e) {
    console.warn('[profile] could not read profiles:', e?.message || e);
    return undefined;                       // unknown, not "not enrolled"
  }

  // The app's exact test (App.js:248). Either missing and they are mid-onboarding.
  if (!row?.onboarded || !row?.birth_year) return null;

  let kundli = null;
  try {
    const { data } = await supabase
      .from('kundli_cache').select('data').eq('user_id', user.id).maybeSingle();
    kundli = data?.data || null;
  } catch (e) {
    console.warn('[profile] could not read kundli_cache:', e?.message || e);
  }

  return { profile: rowToProfile(row), kundli, remote: true };
}

/**
 * Write the enrollment so the phone sees it too. Best-effort by design: the chart
 * is already computed and on screen, and failing to sync is not a reason to fail
 * the onboarding in front of the user.
 */
export async function saveRemoteSession(user, profile, kundli) {
  if (!user?.id || !profile) return false;
  const language = profile.language || 'en';
  try {
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name: profile.name || '',
      gender: profile.gender || '',
      language,
      birth_year: Number(profile.date?.year),
      birth_month: Number(profile.date?.month),
      birth_day: Number(profile.date?.day),
      birth_hour: Number(profile.time?.hour) || 0,
      birth_minute: Number(profile.time?.minute) || 0,
      birth_place: profile.place?.name || '',
      birth_lat: Number(profile.place?.lat),
      birth_lng: Number(profile.place?.lng),
      onboarded: true,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  } catch (e) {
    console.warn('[profile] could not write profiles:', e?.message || e);
    return false;
  }

  if (kundli) {
    try {
      await supabase.from('kundli_cache').upsert({
        user_id: user.id, data: kundli, language, updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('[profile] could not write kundli_cache:', e?.message || e);
    }
  }
  return true;
}
