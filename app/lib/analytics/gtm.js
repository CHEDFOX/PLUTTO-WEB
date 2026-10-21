/**
 * Google Tag Manager, first in <head> of the root layout on every page except /embed (calculators framed on other
 * sites); /app is the static public/m and has no tag. The CSP in next.config.mjs allows GTM, Google Analytics and
 * Preview mode only: a tag for any other host (Google Ads, TikTok…) is blocked until that host is added there.
 */
import { ASK_FIRST_COUNTRIES, CONSENT_KEY } from './consent';

export const GTM_ID = 'GTM-KH975V6M';

const KINDS = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'];

// Plain ES5 in a string, run inline before anything else on the page; the tail is Google's snippet with the id.
// Consent Mode v2 defaults are set before the container loads: in ASK_FIRST_COUNTRIES (app/lib/analytics/consent.js)
// every Google storage starts denied and tags run cookieless until the visitor answers; elsewhere they start granted.
// A stored answer under plutto_ads wins; the Meta consent bar pushes a new one to Google (app/api/meta/pixel, decide()).
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
