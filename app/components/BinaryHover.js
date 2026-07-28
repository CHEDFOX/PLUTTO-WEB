'use client';

import { useEffect } from 'react';

/**
 * Cyberpunk binary glitch on hover — per WORD.
 *
 *  1. A MutationObserver + initial pass walks the DOM and wraps every word
 *     in text nodes into <span class="bw">word</span>.
 *  2. mouseover on a .bw triggers a short scramble (0/1) with a chromatic
 *     RGB-split + hue-rotate glitch, then restores the original word.
 */

const WRAP_CLASS = 'bw';
const GLITCH_CLASS = 'bw-glitch';
const FRAMES = 6;
const FRAME_MS = 45;
const COOLDOWN = 900;

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'TEXTAREA',
  'INPUT',
  'CODE',
  'PRE',
  'SVG',
  'PATH',
  'CANVAS',
  'IFRAME',
]);

const shouldSkip = (el) => {
  let cur = el;
  while (cur) {
    if (SKIP_TAGS.has(cur.tagName)) return true;
    if (cur.hasAttribute?.('data-no-binary')) return true;
    if (cur.getAttribute?.('contenteditable') === 'true') return true;
    cur = cur.parentElement;
  }
  return false;
};

const randBin = (text) =>
  Array.from(text)
    .map((ch) => (/\s/.test(ch) ? ch : Math.random() > 0.5 ? '1' : '0'))
    .join('');

const injectStyles = () => {
  if (document.getElementById('binary-glitch-style')) return;
  const style = document.createElement('style');
  style.id = 'binary-glitch-style';
  style.textContent = `
    .${WRAP_CLASS} {
      display: inline;
      transition: filter 60ms linear;
    }
    @keyframes bwShake {
      0%   { transform: translate(0,0)    skewX(0deg); }
      20%  { transform: translate(-1.5px,1px)  skewX(-3deg); }
      40%  { transform: translate(1.5px,-1px)  skewX(2deg); }
      60%  { transform: translate(-1px,1.5px)  skewX(-1deg); }
      80%  { transform: translate(1px,-1.5px)  skewX(3deg); }
      100% { transform: translate(0,0)    skewX(0deg); }
    }
    @keyframes bwHueShift {
      0%   { filter: blur(0.6px) hue-rotate(0deg) contrast(1.2) saturate(1.4); }
      33%  { filter: blur(1.1px) hue-rotate(60deg) contrast(1.3) saturate(1.6); }
      66%  { filter: blur(0.8px) hue-rotate(-40deg) contrast(1.25) saturate(1.5); }
      100% { filter: blur(0.6px) hue-rotate(0deg) contrast(1.2) saturate(1.4); }
    }
    .${GLITCH_CLASS} {
      color: #2962FF !important;
      font-family: 'JetBrains Mono', ui-monospace, monospace !important;
      letter-spacing: 0.05em;
      text-shadow:
         2px 0 0 rgba(255, 80, 160, 0.85),
        -2px 0 0 rgba(180, 80, 255, 0.85),
         0   0 6px rgba(41, 98, 255, 0.7),
         0   0 14px rgba(41, 98, 255, 0.45),
         1px 1px 0 rgba(200, 225, 255, 0.5);
      animation:
        bwShake 90ms steps(2) infinite,
        bwHueShift 220ms ease-in-out infinite;
      will-change: transform, filter;
    }
  `;
  document.head.appendChild(style);
};

const wrapTextNode = (node) => {
  const text = node.nodeValue ?? '';
  if (!text || !text.trim()) return;
  const parts = text.split(/(\s+)/);
  const frag = document.createDocumentFragment();
  for (const part of parts) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      frag.appendChild(document.createTextNode(part));
    } else {
      const span = document.createElement('span');
      span.className = WRAP_CLASS;
      span.textContent = part;
      frag.appendChild(span);
    }
  }
  node.parentNode?.replaceChild(frag, node);
};

const wrapWordsIn = (root) => {
  if (root.nodeType === Node.ELEMENT_NODE && shouldSkip(root)) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const parent = n.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.classList.contains(WRAP_CLASS)) return NodeFilter.FILTER_REJECT;
      if (shouldSkip(parent)) return NodeFilter.FILTER_REJECT;
      const v = n.nodeValue;
      if (!v || !v.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const targets = [];
  let cur = walker.nextNode();
  while (cur) {
    targets.push(cur);
    cur = walker.nextNode();
  }
  targets.forEach(wrapTextNode);
};

const BinaryHover = () => {
  useEffect(() => {
    injectStyles();
    if (document.body) wrapWordsIn(document.body);

    let scheduled = false;
    const pendingRoots = new Set();
    const flush = () => {
      scheduled = false;
      pendingRoots.forEach((n) => wrapWordsIn(n));
      pendingRoots.clear();
    };
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === Node.ELEMENT_NODE) pendingRoots.add(n);
            else if (n.nodeType === Node.TEXT_NODE && n.parentNode)
              pendingRoots.add(n.parentNode);
          });
        } else if (m.type === 'characterData') {
          if (m.target.parentNode) pendingRoots.add(m.target.parentNode);
        }
      }
      if (!scheduled && pendingRoots.size) {
        scheduled = true;
        requestAnimationFrame(flush);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const lastRun = new WeakMap();
    const handler = (e) => {
      const target = e.target;
      if (!target) return;

      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        const field = target;
        const original = field.getAttribute('data-bw-original') ?? field.placeholder;
        if (!original || !original.trim()) return;
        if (field.value) return;

        const now = Date.now();
        const last = lastRun.get(field) ?? 0;
        if (now - last < COOLDOWN) return;
        lastRun.set(field, now);

        field.setAttribute('data-bw-original', original);
        field.classList.add(GLITCH_CLASS);

        let i = 0;
        const tick = () => {
          if (!field.isConnected) return;
          if (i < FRAMES) {
            field.placeholder = randBin(original);
            i++;
            window.setTimeout(tick, FRAME_MS);
          } else {
            field.placeholder = original;
            field.classList.remove(GLITCH_CLASS);
          }
        };
        tick();
        return;
      }

      if (!target.classList?.contains(WRAP_CLASS)) return;

      const now = Date.now();
      const last = lastRun.get(target) ?? 0;
      if (now - last < COOLDOWN) return;
      lastRun.set(target, now);

      const original = target.textContent ?? '';
      if (!original.trim()) return;

      target.classList.add(GLITCH_CLASS);

      let i = 0;
      const tick = () => {
        if (!target.isConnected) return;
        if (i < FRAMES) {
          target.textContent = randBin(original);
          i++;
          window.setTimeout(tick, FRAME_MS);
        } else {
          target.textContent = original;
          target.classList.remove(GLITCH_CLASS);
        }
      };
      tick();
    };

    document.addEventListener('mouseover', handler);
    return () => {
      document.removeEventListener('mouseover', handler);
      observer.disconnect();
    };
  }, []);

  return null;
};

export default BinaryHover;
