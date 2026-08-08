import{r as w,j as e}from"./index-BQhuJ3Tf.js";import{u as Q}from"./store-8M3kcXE-.js";import{R as U,T as Z,P as ee,M as te}from"./Triangle-2qzboODN.js";import{B as oe}from"./brain-t60cwWVj.js";import{A as ne}from"./index-BmXZUbAv.js";import{m as ie}from"./proxy-dAN8HCOJ.js";import{C as se,a as ae}from"./chevron-right-C7y61zwU.js";const z=o=>{const s=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(o);return s?[parseInt(s[1],16)/255,parseInt(s[2],16)/255,parseInt(s[3],16)/255]:[1,1,1]},re=o=>o==="ember"?1:o==="frost"?2:0,le=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ce=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uScale;
uniform float uDetail;
uniform float uGlow;
uniform float uCoreSize;
uniform float uSwirl;
uniform float uFold;
uniform float uBlackPoint;
uniform float uBrightness;
uniform float uColorMode;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform bool uEnableMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float time = iTime * uSpeed;
  vec2 p = uScale * ((gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;

  vec2 drift = vec2(0.0);
  if (uEnableMouse) {
    drift = (uMouse - 0.5) * uMouseStrength * 2.0;
  }
  p += drift;

  vec2 i = p;
  float c = 0.0;
  float r = length(p + vec2(sin(time), sin(time * 0.3 + 5.0)) * 0.5);
  float d = length(p);
  float rot = d + time + p.x * uSwirl;

  float cosRot = cos(rot);
  mat2 warp = mat2(cos(rot - sin(time / 5.0)), sin(rot), -sin(cosRot - time), cosRot) * uFold;
  float glowCore = uGlow * uCoreSize;

  for (float n = 0.0; n < 8.0; n++) {
    if (n >= uDetail) break;
    p *= warp;
    float t = r - time / (n + 3.0);
    i -= p + vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r);
    c += glowCore / length(vec2(sin(i.x + t), cos(i.y + t)));
  }

  c /= 6.0;

  float intensity = max(c - uBlackPoint, 0.0) * uBrightness;

  float g = clamp(intensity, 0.0, 1.0);

  float mid = 0.5;
  if (uColorMode > 1.5) {
    mid = 0.65;
  } else if (uColorMode > 0.5) {
    mid = 0.35;
  }

  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, mid, g));
  col = mix(col, uColor3, smoothstep(mid, 1.0, g));

  float a = g;
  if (uGrain > 0.5) {
    float gr = hash(gl_FragCoord.xy + iTime);
    a += (gr - 0.5) * uGrainIntensity;
  }
  a = clamp(a, 0.0, 1.0) * uOpacity;
  fragColor = vec4(col * a, a);
}
`,I=new WeakMap,ue=({color1:o="#5227FF",color2:s="#FF9FFC",color3:y="#FFFFFF",speed:d=.35,scale:b=4,detail:F=3,glow:C=1.6,coreSize:M=.1,swirl:S=1,fold:R=-.2,blackPoint:a=.05,brightness:f=1.3,colorMode:k="molten",grain:L=!0,grainIntensity:P=.05,mouseInteraction:O=!0,mouseStrength:D=.3,opacity:_=1,className:K=""})=>{const E=w.useRef(null);return w.useEffect(()=>{const i=E.current;if(!i)return;const u=new U({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)}),t=u.gl;t.clearColor(0,0,0,0);const n=t.canvas;n.style.width="100%",n.style.height="100%",n.style.display="block",i.appendChild(n);const j=new Z(t),r=new ee(t,{vertex:le,fragment:ce,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:.35},uScale:{value:4},uDetail:{value:3},uGlow:{value:1.6},uCoreSize:{value:.1},uSwirl:{value:1},uFold:{value:-.2},uBlackPoint:{value:.05},uBrightness:{value:1.3},uColorMode:{value:0},uGrain:{value:1},uGrainIntensity:{value:.05},uOpacity:{value:1},uMouse:{value:new Float32Array([.5,.5])},uMouseStrength:{value:.3},uEnableMouse:{value:!0},uColor1:{value:new Float32Array([1,1,1])},uColor2:{value:new Float32Array([1,1,1])},uColor3:{value:new Float32Array([1,1,1])}}}),m=new te(t,{geometry:j,program:r});I.set(i,{renderer:u,program:r,mesh:m});const h=()=>{const l=i.getBoundingClientRect(),c=Math.max(1,Math.floor(l.width)),J=Math.max(1,Math.floor(l.height));u.setSize(c,J);const H=r.uniforms.iResolution.value;H[0]=t.drawingBufferWidth,H[1]=t.drawingBufferHeight,u.render({scene:m})},v=new ResizeObserver(h);v.observe(i),h();const x=[.5,.5],p=[.5,.5],$=l=>{const c=n.getBoundingClientRect();x[0]=(l.clientX-c.left)/c.width,x[1]=1-(l.clientY-c.top)/c.height},W=()=>{x[0]=.5,x[1]=.5};n.addEventListener("mousemove",$),n.addEventListener("mouseleave",W);let g=0,A=!0,B=!document.hidden;const X=performance.now(),Y=l=>{r.uniforms.iTime.value=(l-X)*.001,p[0]+=.05*(x[0]-p[0]),p[1]+=.05*(x[1]-p[1]);const c=r.uniforms.uMouse.value;c[0]=p[0],c[1]=p[1],u.render({scene:m}),g=requestAnimationFrame(Y)},G=()=>{A&&B&&g===0&&(g=requestAnimationFrame(Y))},T=()=>{g!==0&&(cancelAnimationFrame(g),g=0)},V=new IntersectionObserver(([l])=>{A=l.isIntersecting,A?G():T()},{threshold:0});V.observe(i);const q=()=>{B=!document.hidden,B?G():T()};return document.addEventListener("visibilitychange",q),G(),()=>{T(),v.disconnect(),V.disconnect(),document.removeEventListener("visibilitychange",q),n.removeEventListener("mousemove",$),n.removeEventListener("mouseleave",W),I.delete(i);try{i.removeChild(n)}catch{}t.getExtension("WEBGL_lose_context")?.loseContext()}},[]),w.useEffect(()=>{const i=E.current;if(!i)return;const u=I.get(i);if(!u)return;const t=u.program.uniforms;t.uSpeed.value=d,t.uScale.value=b,t.uDetail.value=F,t.uGlow.value=C,t.uCoreSize.value=Math.max(M,.001),t.uSwirl.value=S,t.uFold.value=R,t.uBlackPoint.value=a,t.uBrightness.value=f,t.uColorMode.value=re(k),t.uGrain.value=L?1:0,t.uGrainIntensity.value=P,t.uOpacity.value=_,t.uMouseStrength.value=D,t.uEnableMouse.value=O;const n=z(o),j=z(s),r=z(y),m=t.uColor1.value,h=t.uColor2.value,v=t.uColor3.value;m[0]=n[0],m[1]=n[1],m[2]=n[2],h[0]=j[0],h[1]=j[1],h[2]=j[2],v[0]=r[0],v[1]=r[1],v[2]=r[2]},[o,s,y,d,b,F,C,M,S,R,a,f,k,L,P,O,D,_]),e.jsx("div",{ref:E,className:`relative h-full w-full overflow-hidden ${K}`.trim()})},N=[{text:e.jsxs(e.Fragment,{children:["Good morning. ",e.jsx("strong",{className:"text-white",children:"Wake by 6 AM"})," has been your steadiest habit at ",e.jsx("span",{className:"text-[#c8f54e] font-mono",children:"38%"})," this month — start there, and the rest tends to follow."]})},{text:e.jsxs(e.Fragment,{children:["Your consistency is building. ",e.jsx("strong",{className:"text-white",children:"5 habits"})," checked this week — you're on track for a new personal best."]})},{text:e.jsxs(e.Fragment,{children:["Remember: ",e.jsx("span",{className:"italic text-[#c8f54e]",children:"small, repeated things"})," compound. You don't need to be perfect — you just need to keep showing up."]})}],me={enter:o=>({x:o>0?120:-120,opacity:0}),center:{x:0,opacity:1},exit:o=>({x:o<0?120:-120,opacity:0})};function we(){const{todayMood:o,moodFactors:s,moodNote:y}=Q(),[d,b]=w.useState(0),F=w.useMemo(()=>{if(!o)return"Check in with yourself to unlock a small, personal read on today.";const a=s[0]?.toLowerCase();return`${o==="sad"||o==="low"?"Take the pressure down a notch":o==="great"||o==="good"?"Protect the momentum you have":"Keep today simple and steady"}${a?`, especially around ${a}`:""}. One honest next step is enough.`},[s,o]),[C,M]=w.useState(0),S=()=>{M(1),b(a=>(a+1)%N.length)},R=()=>{M(-1),b(a=>(a-1+N.length)%N.length)};return e.jsxs("div",{className:"bg-[#1a1a1a] rounded-xl p-6 relative overflow-hidden min-h-[180px] flex flex-col justify-between",children:[e.jsx("div",{className:"absolute inset-0 z-0 opacity-45 pointer-events-none",children:e.jsx(ue,{color1:"#111111",color2:"#c8f54e",color3:"#ffffff",speed:.25,scale:4,detail:3,glow:1.4,coreSize:.08,swirl:1,fold:-.2,blackPoint:.05,brightness:1.2,colorMode:"molten",grain:!0,grainIntensity:.03,mouseInteraction:!0,mouseStrength:.25,opacity:.9})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 relative z-10",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-[#c8f54e] text-base font-mono",children:"m"}),e.jsx("span",{className:"text-sm font-display font-bold text-white",children:"Today's Note"})]}),e.jsx("span",{className:"text-[10px] font-mono tracking-widest text-[#c8f54e] uppercase",children:"● TODAY"})]}),o&&e.jsxs("div",{className:"relative z-10 mb-4 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5",children:[e.jsxs("div",{className:"flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#c8f54e]",children:[e.jsx(oe,{className:"h-3.5 w-3.5"})," Mood read"]}),e.jsx("p",{className:"mt-1 text-sm leading-relaxed text-white/85",children:F}),y&&e.jsxs("p",{className:"mt-2 truncate text-xs italic text-white/45",children:["“",y,"”"]})]}),e.jsx("div",{className:"relative z-10 h-14 overflow-hidden flex items-center",children:e.jsx(ne,{initial:!1,custom:C,mode:"popLayout",children:e.jsx(ie.div,{custom:C,variants:me,initial:"enter",animate:"center",exit:"exit",transition:{x:{type:"spring",stiffness:220,damping:24},opacity:{duration:.25}},className:"text-sm text-white/85 leading-relaxed font-sans w-full",children:N[d].text},d)})}),e.jsxs("div",{className:"flex items-center gap-2 mt-5 pt-4 border-t border-white/10 relative z-10",children:[e.jsx("button",{onClick:R,className:"w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/70 active:scale-90 transition-all cursor-pointer",children:e.jsx(se,{className:"w-4 h-4"})}),e.jsx("div",{className:"flex gap-1.5 ml-2",children:N.map((a,f)=>{const k=f===d;return e.jsx("div",{className:`h-1.5 rounded-full transition-all duration-300 ${k?"w-5 bg-[#c8f54e]":"w-1.5 bg-white/20"}`},f)})}),e.jsx("button",{onClick:S,className:"w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/70 active:scale-90 transition-all cursor-pointer",children:e.jsx(ae,{className:"w-4 h-4"})})]})]})}export{we as TodaysNote};
