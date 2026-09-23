// Minimal entry: Skia must load before ANY module that imports it.
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

LoadSkiaWeb({ locateFile: (f) => '/' + f }).then(() => {
  const React = require('react');
  const { View } = require('react-native');
  const { registerRootComponent } = require('expo');
  const { useSharedValue, withRepeat, withSequence, withTiming, Easing } = require('react-native-reanimated');
  const VoiceOrb = require('./src/render/VoiceOrb');
  const Icon = require('./src/render/Icon').default;
  window.__orbReady = VoiceOrb.orbShaderReady();
  function OrbScreen() {
    const amp = useSharedValue(0);
    React.useEffect(() => {
      amp.value = withRepeat(withSequence(
        withTiming(0.55, { duration: 460, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.9, { duration: 420, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.4, { duration: 520, easing: Easing.inOut(Easing.quad) }),
      ), -1, true);
      setTimeout(() => { window.__ready = true; }, 800);
    }, []);
    const ORB = Math.round(393 * 0.62);
    const Orb = VoiceOrb.default;
    return React.createElement(View, { style: { flex: 1, backgroundColor: '#000' } },
      React.createElement(View, { style: { position: 'absolute', top: 56, right: 22, zIndex: 5 } },
        React.createElement(Icon, { name: 'close', size: 26, color: 'rgba(255,255,255,0.6)' })),
      React.createElement(View, { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
        React.createElement(Orb, { amp, size: Math.round(ORB * 1.25), colors: ['#D7C8FF', '#7B5CF0', '#241a4d'], style: 'plasma' })));
  }
  registerRootComponent(OrbScreen);
}).catch((e) => { window.__err = String(e); });
