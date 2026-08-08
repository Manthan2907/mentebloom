import{a as oe,r as T,j as e,f as ae}from"./index-n9bWyeev.js";import{u as se,f as ne,D as re}from"./store-4tQfyL6f.js";import{R as ie,T as le,P as ce,M as ue}from"./Triangle-2qzboODN.js";import{m as K}from"./proxy-DdNjJ-X-.js";import{P as Q}from"./plus-DoMnJFRS.js";const de=oe("Droplets",[["path",{d:"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",key:"1ptgy4"}],["path",{d:"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",key:"1sl1rz"}]]),k=o=>{const s=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(o);return s?[parseInt(s[1],16)/255,parseInt(s[2],16)/255,parseInt(s[3],16)/255]:[1,1,1]},me=o=>o==="low"?40:o==="high"?110:70,fe=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ve=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform bool uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
  }
  return dist;
}

void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  if (uEnableMouse) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
    c = cos(yaw); s = sin(yaw);
    dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
    c = cos(pitch); s = sin(pitch);
    dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  }

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;

  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = mix(uHorizonColor, body, t);
  col *= uBrightness;
  col = clamp(col, 0.0, 1.0);

  float alpha = clamp(t, 0.0, 1.0) * uOpacity;
  if (uGrain > 0.5) {
    float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0);
    alpha += (g - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0);
  fragColor = vec4(col * alpha, alpha);
}
`,P=new WeakMap,xe=({horizonColor:o="#5227FF",waveColor:s="#FF9FFC",crestColor:w="#FFFFFF",speed:h=.4,amplitude:g=2.5,waveScale:j=.6,waveRatio:c=.9,swell:C=35,turbulence:M=20,tilt:I=1.11,zoom:D=1,height:G=5.5,fogDepth:H=15,detail:L="medium",brightness:q=1,opacity:B=1,mouseInteraction:N=!0,parallaxStrength:O=.5,grain:_=!0,grainIntensity:$=.05,className:ee=""})=>{const S=T.useRef(null),F=T.useRef(N);return T.useEffect(()=>{const a=S.current;if(!a)return;const u=new ie({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)}),n=u.gl;n.clearColor(0,0,0,0);const t=n.canvas;t.style.width="100%",t.style.height="100%",t.style.display="block",a.appendChild(t);const y=new le(n),i=new ce(n,{vertex:fe,fragment:ve,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:.4},uAmplitude:{value:2.5},uWaveScale:{value:.6},uWaveRatio:{value:.9},uSwell:{value:35},uTurbulence:{value:20},uTilt:{value:1.11},uZoom:{value:1},uHeight:{value:5.5},uFogDepth:{value:15},uSteps:{value:70},uBrightness:{value:1},uOpacity:{value:1},uGrain:{value:1},uGrainIntensity:{value:.05},uMouse:{value:new Float32Array([.5,.5])},uParallax:{value:.5},uEnableMouse:{value:!0},uHorizonColor:{value:new Float32Array([1,1,1])},uWaveColor:{value:new Float32Array([1,1,1])},uCrestColor:{value:new Float32Array([1,1,1])}}}),m=new ue(n,{geometry:y,program:i});P.set(a,{renderer:u,program:i,mesh:m});const f=()=>{const l=a.getBoundingClientRect(),d=Math.max(1,Math.floor(l.width)),E=Math.max(1,Math.floor(l.height));u.setSize(d,E);const b=i.uniforms.iResolution.value;b[0]=n.drawingBufferWidth,b[1]=n.drawingBufferHeight,u.render({scene:m})},v=new ResizeObserver(f);v.observe(a),f();const r=[.5,.5],x=[.5,.5],V=l=>{const d=t.getBoundingClientRect();x[0]=(l.clientX-d.left)/d.width,x[1]=1-(l.clientY-d.top)/d.height},X=()=>{x[0]=.5,x[1]=.5};t.addEventListener("pointermove",V),t.addEventListener("pointerleave",X);let p=0,R=!0,W=!document.hidden;const te=performance.now(),Z=l=>{i.uniforms.iTime.value=(l-te)*.001;const d=F.current?x[0]:.5,E=F.current?x[1]:.5;r[0]+=.05*(d-r[0]),r[1]+=.05*(E-r[1]);const b=i.uniforms.uMouse.value;b[0]=r[0],b[1]=r[1],u.render({scene:m}),p=requestAnimationFrame(Z)},A=()=>{R&&W&&p===0&&(p=requestAnimationFrame(Z))},z=()=>{p!==0&&(cancelAnimationFrame(p),p=0)},Y=new IntersectionObserver(([l])=>{R=l.isIntersecting,R?A():z()},{threshold:0});Y.observe(a);const J=()=>{W=!document.hidden,W?A():z()};return document.addEventListener("visibilitychange",J),A(),()=>{z(),v.disconnect(),Y.disconnect(),document.removeEventListener("visibilitychange",J),t.removeEventListener("pointermove",V),t.removeEventListener("pointerleave",X),P.delete(a);try{a.removeChild(t)}catch{}n.getExtension("WEBGL_lose_context")?.loseContext()}},[]),T.useEffect(()=>{const a=S.current;if(!a)return;const u=P.get(a);if(!u)return;const{program:n}=u,t=n.uniforms;F.current=N,t.uSpeed.value=h,t.uAmplitude.value=g,t.uWaveScale.value=j,t.uWaveRatio.value=c,t.uSwell.value=C,t.uTurbulence.value=M,t.uTilt.value=I,t.uZoom.value=D,t.uHeight.value=G,t.uFogDepth.value=H,t.uSteps.value=me(L),t.uBrightness.value=q,t.uOpacity.value=B,t.uGrain.value=_?1:0,t.uGrainIntensity.value=$,t.uParallax.value=O,t.uEnableMouse.value=N;const y=t.uHorizonColor.value,i=t.uWaveColor.value,m=t.uCrestColor.value,f=k(o),v=k(s),r=k(w);y[0]=f[0],y[1]=f[1],y[2]=f[2],i[0]=v[0],i[1]=v[1],i[2]=v[2],m[0]=r[0],m[1]=r[1],m[2]=r[2]},[o,s,w,h,g,j,c,C,M,I,D,G,H,L,q,B,_,$,N,O]),e.jsx("div",{ref:S,className:`relative h-full w-full overflow-hidden ${ee}`.trim()})},U=2e3;function we(){const{hydration:o,addWater:s,resetWater:w}=se(),h=Math.min(o.today/U*100,100),g=ne();return e.jsxs("div",{className:"rounded-xl border border-[#e8e4df] p-6 shadow-sm relative overflow-hidden bg-white/50 backdrop-blur-xs",children:[e.jsx("div",{className:"absolute inset-0 z-0 opacity-40 pointer-events-none",children:e.jsx(xe,{horizonColor:"#ffffff",waveColor:"#7dd3fc",crestColor:"#0284c7",speed:.22,amplitude:1.8,waveScale:.5,waveRatio:.8,swell:20,turbulence:10,tilt:1,zoom:1,height:4.8,fogDepth:16,detail:"low",brightness:1.15,opacity:.85,mouseInteraction:!0,parallaxStrength:.4,grain:!0,grainIntensity:.03})}),e.jsxs("div",{className:"relative z-10",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(de,{className:"w-4 h-4 text-[#0284c7]"}),e.jsx("h3",{className:"font-display text-lg font-bold text-[#1a1a1a]",children:"Today's Water"})]}),e.jsxs("span",{className:"text-sm font-mono text-[#0284c7] font-bold",children:[o.today,"ml"]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-1.5",children:[e.jsx("span",{className:"text-[10px] font-mono text-[#1a1a1a]/40 uppercase tracking-wider font-semibold",children:"Progress"}),e.jsxs("span",{className:"text-[10px] font-mono text-[#1a1a1a]/50 font-bold",children:[Math.round(h),"%"]})]}),e.jsx("div",{className:"h-2 bg-[#f0ece7]/70 rounded-full overflow-hidden",children:e.jsx(K.div,{initial:{width:0},animate:{width:`${h}%`},transition:{duration:.8,ease:"easeOut"},className:"h-full bg-[#0284c7] rounded-full"})}),e.jsxs("div",{className:"flex items-center justify-between mt-1",children:[e.jsx("span",{className:"text-[9px] font-mono text-[#1a1a1a]/30",children:"0ml"}),e.jsxs("span",{className:"text-[9px] font-mono text-[#1a1a1a]/30",children:[U,"ml goal"]})]})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-5",children:[e.jsxs("button",{onClick:()=>s(250),className:"flex-1 flex items-center justify-center gap-1.5 text-xs font-mono bg-[#0284c7]/8 text-[#0284c7] border border-[#0284c7]/20 py-2 rounded-sm hover:bg-[#0284c7]/15 transition-colors font-semibold cursor-pointer",children:[e.jsx(Q,{className:"w-3 h-3"}),"250ml"]}),e.jsxs("button",{onClick:()=>s(500),className:"flex-1 flex items-center justify-center gap-1.5 text-xs font-mono bg-[#0284c7]/8 text-[#0284c7] border border-[#0284c7]/20 py-2 rounded-sm hover:bg-[#0284c7]/15 transition-colors font-semibold cursor-pointer",children:[e.jsx(Q,{className:"w-3 h-3"}),"500ml"]}),e.jsx("button",{onClick:w,className:"flex items-center justify-center text-xs font-mono bg-white/60 text-[#1a1a1a]/40 border border-[#e0dcd7] py-2 px-3 rounded-sm hover:bg-[#f0ece7] transition-colors cursor-pointer",children:e.jsx(ae,{className:"w-3 h-3"})})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-[9px] font-mono text-[#1a1a1a]/30 tracking-wider mb-2 uppercase font-semibold",children:"This Week"}),e.jsx("div",{className:"flex items-end gap-1.5 h-14",children:o.week.map((j,c)=>{const C=Math.max(...o.week,1),M=j/C*100;return e.jsxs("div",{className:"flex-1 flex flex-col items-center gap-1",children:[e.jsx(K.div,{initial:{height:0},animate:{height:`${M}%`},transition:{duration:.5,delay:c*.06},className:`w-full max-w-[20px] rounded-sm ${c===g?"bg-[#0284c7]":"bg-[#0284c7]/15"}`}),e.jsx("span",{className:`text-[8px] font-mono font-bold ${c===g?"text-[#0284c7]":"text-[#1a1a1a]/30"}`,children:re[c]})]},c)})})]})]})]})}export{we as HydrationWidget};
