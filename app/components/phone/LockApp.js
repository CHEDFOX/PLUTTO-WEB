'use client';

/**
 * The morning push on a lock screen. The text (push.js) is from the backend's notifications.py _AUTO_GENERIC
 * set and the icon is the app's own; the clock, date, banner and buttons are iOS's.
 */

import Image from 'next/image';
import { motion } from 'framer-motion';

import { PUSH } from './push';

/**
 * `live`: whether the push has arrived. Off, the lock screen is just the clock; on, the banner drops in from
 * above on a spring and stays. The hero sets it when this phone comes to the front.
 */
export default function LockApp({ live = true }) {
  return (
    <div className="absolute inset-0" style={{
      background: 'radial-gradient(120% 70% at 50% 110%, #1b3a6b 0%, #0b1426 45%, #05070d 100%)', color: '#fff',
    }}>
      <div style={{ position: 'absolute', top: 104, left: 0, right: 0, textAlign: 'center' }}>
        <p style={{ fontSize: 21, fontWeight: 600, letterSpacing: 0.2, color: 'rgba(255,255,255,0.85)' }}>Tuesday 9 January</p>
        <p style={{ fontSize: 108, fontWeight: 700, lineHeight: '112px', letterSpacing: -3, color: 'rgba(255,255,255,0.92)' }}>9:00</p>
      </div>

      <motion.div
        style={{ position: 'absolute', left: 10, right: 10, top: 560 }}
        initial={false}
        animate={live ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -28, scale: 0.96 }}
        transition={live ? { type: 'spring', stiffness: 260, damping: 24, mass: 0.8, delay: 0.9 } : { duration: 0.25 }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '13px 14px', borderRadius: 24, background: 'rgba(245,245,250,0.2)' }}>
          <Image src="/app/icon.png" alt="" width={38} height={38} style={{ width: 38, height: 38, borderRadius: 9, flex: 'none', marginTop: 1 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 600, lineHeight: '20px' }}>{PUSH.title}</span>
              <span style={{ fontSize: 13, lineHeight: '20px', color: 'rgba(255,255,255,0.55)' }}>now</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: '20px', color: 'rgba(255,255,255,0.92)' }}>{PUSH.body}</p>
          </div>
        </div>
      </motion.div>

      {[{ left: 46 }, { right: 46 }].map((pos, i) => (
        <div key={i} style={{ position: 'absolute', bottom: 58, width: 50, height: 50, borderRadius: 25, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...pos }}>
          {i === 0 ? (
            <svg width="16" height="22" viewBox="0 0 16 22" fill="white" aria-hidden="true"><path d="M3 0h10v4.5L10.5 9v11a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V9L3 4.5z" /></svg>
          ) : (
            <svg width="24" height="19" viewBox="0 0 24 19" fill="white" aria-hidden="true"><path d="M8.3 0h7.4l1.8 2.6H21a3 3 0 0 1 3 3V16a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V5.6a3 3 0 0 1 3-3h3.5zM12 5.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" /></svg>
          )}
        </div>
      ))}
    </div>
  );
}
