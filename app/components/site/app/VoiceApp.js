'use client';

/**
 * VOICE — src/render/RealtimeVoiceMode.js with src/render/VoiceOrb.js.
 *
 * The real screen is nearly empty, and so is this: black, one orb, one X. No
 * caption (theme.voice.captions is unset, so the app draws none), no buttons.
 *
 *   orb     VoiceOrb's 'plasma' SkSL shader, ported line for line to WebGL,
 *           on a 305 pt canvas (round(round(393·0.62)·1.25)) centred on the
 *           screen; palette #D7C8FF / #7B5CF0, time ×0.12, light from the
 *           upper left, fresnel rim, clean edge with no outer glow
 *   amp     the SPEAKING loop the app drives it with: 0.55 (460 ms) → 0.9
 *           (420) → 0.4 (520), repeated in reverse, in-out quad
 *   close   Icon 'close' 26 pt, white 60 %, top 56, right 22
 */

import { useEffect, useRef } from 'react';
import Icon from './Icon';

const SIZE = 305;

const FRAG = `
precision highp float;
uniform vec2 u_resolution; uniform float u_time; uniform float u_amp; uniform vec3 u_c1; uniform vec3 u_c2; uniform float u_dpr;
float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i), b = hash(i+vec2(1.0,0.0)), c = hash(i+vec2(0.0,1.0)), d = hash(i+vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*vnoise(p); p=p*2.02; a*=0.5; } return v; }
void main(){
  vec2 fragCoord = vec2(gl_FragCoord.x, u_resolution.y*u_dpr - gl_FragCoord.y) / u_dpr;
  vec2 uv=(fragCoord-0.5*u_resolution)/u_resolution.y;
  float r=length(uv); float radius=0.32; float t=u_time*0.12; float amp=clamp(u_amp,0.0,1.0);
  vec2 q=uv*2.0;
  vec2 warp=vec2(fbm(q+vec2(0.0,t)), fbm(q+vec2(5.2,t*1.3)));
  float n=fbm(q+warp*(1.3+amp*1.6)+t*0.5);
  vec3 irid=0.5+0.5*cos(6.2831*(vec3(0.0,0.33,0.67)+n*1.25+t*0.7+amp*0.6));
  vec3 col=mix(mix(u_c2,u_c1,n), irid, 0.5);
  float z=sqrt(max(0.0,radius*radius-r*r));
  vec3 nrm=normalize(vec3(uv,z/max(radius,0.0001)));
  col*=0.45+0.8*clamp(dot(nrm,normalize(vec3(-0.35,-0.5,0.85))),0.0,1.0);
  float fres=pow(1.0-clamp(z/radius,0.0,1.0),2.2);
  col+=fres*u_c1*(0.5+amp*0.9);
  float a2=smoothstep(radius,radius-0.05,r);
  gl_FragColor = vec4(clamp(col,0.0,1.0)*a2, a2);
}`;

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';

// The speaking amp: a sequence from 0 through 0.55, 0.9, 0.4 and back again.
const SEG = [[0, 0.55, 460], [0.55, 0.9, 420], [0.9, 0.4, 520], [0.4, 0.9, 520], [0.9, 0.55, 420], [0.55, 0, 460]];
const CYCLE = SEG.reduce((s, x) => s + x[2], 0);
const inOutQuad = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
function ampAt(ms) {
  let t = ms % CYCLE;
  for (const [a, b, d] of SEG) { if (t <= d) return a + (b - a) * inOutQuad(t / d); t -= d; }
  return 0;
}

function Orb() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const gl = cv && cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: true });
    if (!gl) return undefined;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = SIZE * dpr; cv.height = SIZE * dpr;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n) => gl.getUniformLocation(prog, n);
    gl.uniform2f(U('u_resolution'), SIZE, SIZE);
    gl.uniform3f(U('u_c1'), 0xD7 / 255, 0xC8 / 255, 1);
    gl.uniform3f(U('u_c2'), 0x7B / 255, 0x5C / 255, 0xF0 / 255);
    gl.uniform1f(U('u_dpr'), dpr);
    gl.viewport(0, 0, cv.width, cv.height);
    const uT = U('u_time'), uA = U('u_amp');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, on = true;
    const t0 = performance.now();
    const frame = (now) => {
      const ms = calm ? 4000 : now - t0;
      gl.uniform1f(uT, ms / 1000);
      gl.uniform1f(uA, ampAt(ms));
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (on && !calm) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(frame); });
    io.observe(cv);
    raf = requestAnimationFrame(frame);
    return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" style={{ width: SIZE, height: SIZE, display: 'block' }} />;
}

export default function VoiceApp() {
  return (
    <div className="absolute inset-0" style={{ background: '#000' }}>
      <div style={{ position: 'absolute', top: 56, right: 22 }}><Icon name="close" size={26} color="rgba(255,255,255,0.6)" /></div>
      <div style={{ position: 'absolute', left: (393 - SIZE) / 2, top: (852 - SIZE) / 2 }}><Orb /></div>
    </div>
  );
}
