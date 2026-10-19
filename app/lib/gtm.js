/**
 * GOOGLE TAG MANAGER — the marketing team's container, on every page of the site.
 *
 * In the ROOT layout, first in <head> as Google asks, so it covers the site and
 * not /app (a static page, public/m) nor /embed (calculators framed on other
 * people's sites — skipped below, since those visits are not ours to measure).
 *
 * CONSENT MODE v2 before the container loads. Where the law asks first
 * (app/lib/consent.js) every Google storage starts DENIED, and Google's tags run
 * cookieless until the visitor answers; elsewhere they start granted. The answer
 * is the same one the Meta consent bar keeps (plutto_ads): read here on load, and
 * pushed to Google the moment it is given (app/api/meta/pixel, decide()).
 *
 * THE CSP decides what a tag in the container may load. next.config.mjs allows
 * GTM itself, Google Analytics and GTM's Preview mode. A tag for anything else
 * (Google Ads, TikTok, LinkedIn…) is blocked by the browser, silently, until its
 * hosts are added there.
 */
import { ASK_FIRST_COUNTRIES, CONSENT_KEY } from './consent';

export const GTM_ID = 'GTM-KH975V6M';

const KINDS = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'];

// Plain ES5 in a string, run inline before anything else on the page. The tail
// is Google's own snippet, unchanged but for the id.
export const GTM_HEAD = `(function(w,d){
if(w.location.pathname.indexOf('/embed')===0)return;
w.dataLayer=w.dataLayer||[];
w.gtag=w.gtag||function(){w.dataLayer.push(arguments);};
var kinds=${JSON.stringify(KINDS)},all=function(v){var o={};for(var i=0;i<kinds.length;i++)o[kinds[i]]=v;return o;};
var said=null;try{said=w.localStorage.getItem(${JSON.stringify(CONSENT_KEY)});}catch(e){}
if(said==='granted'||said==='denied'){w.gtag('consent','default',all(said));}
else{var ask=all('denied');ask.region=${JSON.stringify(ASK_FIRST_COUNTRIES)};ask.wait_for_update=500;
w.gtag('consent','default',ask);w.gtag('consent','default',all('granted'));}
})(window,document);
(function(w,d,s,l,i){if(w.location.pathname.indexOf('/embed')===0)return;w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

export const GTM_NOSCRIPT_SRC = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
