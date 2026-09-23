/**
 * WEB HARNESS — renders the app's REAL components at iPhone size so the
 * marketing site can show them exactly. Network is faked by the test driver.
 *   #chat      MainTabs (Oracle tab)
 *   #birth     BirthDetailsScreen
 *   #language  LanguageSelectScreen
 *   #auth      AuthGateScreen
 */
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { registerRootComponent } from 'expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaInsetsContext, SafeAreaFrameContext } from 'react-native-safe-area-context';
import { fetchCatalog, setActiveSystem } from './src/render/catalog';
import { openFeature } from './src/render/featureNav';
import MainTabs from './src/render/MainTabs';
import BirthDetailsScreen from './src/screens/BirthDetailsScreen';
import LanguageSelectScreen from './src/screens/LanguageSelectScreen';
import AuthGateScreen from './src/screens/AuthGateScreen';
import FALLBACK from './src/config/onboardingFallback.json';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { useSharedValue, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import Icon from './src/render/Icon';

// The realtime voice screen's own layout (RealtimeVoiceMode.js), with the real
// VoiceOrb and Icon, in the SPEAKING state.
function OrbScreen() {
  const [Orb, setOrb] = useState(null);
  const amp = useSharedValue(0);
  useEffect(() => {
    LoadSkiaWeb({ locateFile: (f) => '/' + f }).then(() => {
      const m = require('./src/render/VoiceOrb');
      window.__orbKeys = Object.keys(m).join(',');
      window.__orbReady = m.orbShaderReady();
      const C = m.default || m;
      setOrb(() => C);
      amp.value = withRepeat(withSequence(
        withTiming(0.55, { duration: 460, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.9, { duration: 420, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.4, { duration: 520, easing: Easing.inOut(Easing.quad) }),
      ), -1, true);
      setTimeout(() => { window.__ready = true; }, 500);
    }).catch((e) => { window.__err = String(e); });
  }, []);
  const ORB = Math.round(393 * 0.62);
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ position: 'absolute', top: 56, right: 22, zIndex: 5 }}><Icon name="close" size={26} color="rgba(255,255,255,0.6)" /></View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {Orb ? <Orb amp={amp} size={Math.round(ORB * 1.25)} colors={['#D7C8FF', '#7B5CF0', '#241a4d']} style="plasma" /> : null}
      </View>
    </View>
  );
}

const METRICS = { frame: { x: 0, y: 0, width: 393, height: 852 }, insets: { top: 59, left: 0, right: 0, bottom: 34 } };
const KUNDLI = { name: 'Asha', birth: { date: '1995-06-24', time: '14:30', place: 'Mumbai, India', lat: 19.076, lon: 72.8777, tz: 5.5 } };

function Harness() {
  const mode = (typeof window !== 'undefined' && window.location.hash.slice(1)) || 'chat';
  const [ready, setReady] = useState(mode !== 'chat');
  useEffect(() => {
    if (mode === 'orb') return;
    if (mode !== 'chat') { window.__ready = true; return; }
    setActiveSystem('bphs');
    fetchCatalog('ios', 'en').then(() => { setReady(true); window.__ready = true; }).catch((e) => { window.__err = String(e); });
    window.__openFeature = openFeature;
  }, [mode]);
  let body = null;
  if (mode === 'chat' && ready) body = <MainTabs kundliData={KUNDLI} language="en" languages={FALLBACK.languages || []} />;
  if (mode === 'orb') body = <OrbScreen />;
  if (mode === 'birth') body = <BirthDetailsScreen content={FALLBACK.screens.birth} onBack={() => {}} onComplete={() => {}} prepareApp={() => {}} />;
  if (mode === 'language') body = <LanguageSelectScreen bundle={FALLBACK} onSelect={() => {}} />;
  if (mode === 'auth') body = <AuthGateScreen content={FALLBACK.screens.auth} deviceLang="en" />;
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }}>
      <SafeAreaProvider initialMetrics={METRICS}>
        <SafeAreaFrameContext.Provider value={METRICS.frame}>
          <SafeAreaInsetsContext.Provider value={METRICS.insets}>
            <View style={{ flex: 1, backgroundColor: '#000' }}>{body}</View>
          </SafeAreaInsetsContext.Provider>
        </SafeAreaFrameContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(Harness);
