import{r as C,j as e}from"./index-n9bWyeev.js";import{R as Q,T as U,P as Z,M as ee}from"./Triangle-2qzboODN.js";import{A as te}from"./index-D1yy9xlg.js";import{m as oe}from"./proxy-DdNjJ-X-.js";import{C as ne,a as ie}from"./chevron-right-BViphlGC.js";const A=o=>{const s=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(o);return s?[parseInt(s[1],16)/255,parseInt(s[2],16)/255,parseInt(s[3],16)/255]:[1,1,1]},se=o=>o==="ember"?1:o==="frost"?2:0,ae=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,re=`#version 300 es
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
`,G=new WeakMap,le=({color1:o="#5227FF",color2:s="#FF9FFC",color3:p="#FFFFFF",speed:g=.35,scale:M=4,detail:j=3,glow:c=1.6,coreSize:w=.1,swirl:F=1,fold:B=-.2,blackPoint:T=.05,brightness:z=1.3,colorMode:I="molten",grain:L=!0,grainIntensity:P=.05,mouseInteraction:O=!0,mouseStrength:D=.3,opacity:_=1,className:X=""})=>{const S=C.useRef(null);return C.useEffect(()=>{const i=S.current;if(!i)return;const u=new Q({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)}),t=u.gl;t.clearColor(0,0,0,0);const n=t.canvas;n.style.width="100%",n.style.height="100%",n.style.display="block",i.appendChild(n);const y=new U(t),a=new Z(t,{vertex:ae,fragment:re,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:.35},uScale:{value:4},uDetail:{value:3},uGlow:{value:1.6},uCoreSize:{value:.1},uSwirl:{value:1},uFold:{value:-.2},uBlackPoint:{value:.05},uBrightness:{value:1.3},uColorMode:{value:0},uGrain:{value:1},uGrainIntensity:{value:.05},uOpacity:{value:1},uMouse:{value:new Float32Array([.5,.5])},uMouseStrength:{value:.3},uEnableMouse:{value:!0},uColor1:{value:new Float32Array([1,1,1])},uColor2:{value:new Float32Array([1,1,1])},uColor3:{value:new Float32Array([1,1,1])}}}),m=new ee(t,{geometry:y,program:a});G.set(i,{renderer:u,program:a,mesh:m});const f=()=>{const r=i.getBoundingClientRect(),l=Math.max(1,Math.floor(r.width)),K=Math.max(1,Math.floor(r.height));u.setSize(l,K);const H=a.uniforms.iResolution.value;H[0]=t.drawingBufferWidth,H[1]=t.drawingBufferHeight,u.render({scene:m})},d=new ResizeObserver(f);d.observe(i),f();const v=[.5,.5],h=[.5,.5],W=r=>{const l=n.getBoundingClientRect();v[0]=(r.clientX-l.left)/l.width,v[1]=1-(r.clientY-l.top)/l.height},Y=()=>{v[0]=.5,v[1]=.5};n.addEventListener("mousemove",W),n.addEventListener("mouseleave",Y);let x=0,N=!0,R=!document.hidden;const J=performance.now(),V=r=>{a.uniforms.iTime.value=(r-J)*.001,h[0]+=.05*(v[0]-h[0]),h[1]+=.05*(v[1]-h[1]);const l=a.uniforms.uMouse.value;l[0]=h[0],l[1]=h[1],u.render({scene:m}),x=requestAnimationFrame(V)},E=()=>{N&&R&&x===0&&(x=requestAnimationFrame(V))},k=()=>{x!==0&&(cancelAnimationFrame(x),x=0)},$=new IntersectionObserver(([r])=>{N=r.isIntersecting,N?E():k()},{threshold:0});$.observe(i);const q=()=>{R=!document.hidden,R?E():k()};return document.addEventListener("visibilitychange",q),E(),()=>{k(),d.disconnect(),$.disconnect(),document.removeEventListener("visibilitychange",q),n.removeEventListener("mousemove",W),n.removeEventListener("mouseleave",Y),G.delete(i);try{i.removeChild(n)}catch{}t.getExtension("WEBGL_lose_context")?.loseContext()}},[]),C.useEffect(()=>{const i=S.current;if(!i)return;const u=G.get(i);if(!u)return;const t=u.program.uniforms;t.uSpeed.value=g,t.uScale.value=M,t.uDetail.value=j,t.uGlow.value=c,t.uCoreSize.value=Math.max(w,.001),t.uSwirl.value=F,t.uFold.value=B,t.uBlackPoint.value=T,t.uBrightness.value=z,t.uColorMode.value=se(I),t.uGrain.value=L?1:0,t.uGrainIntensity.value=P,t.uOpacity.value=_,t.uMouseStrength.value=D,t.uEnableMouse.value=O;const n=A(o),y=A(s),a=A(p),m=t.uColor1.value,f=t.uColor2.value,d=t.uColor3.value;m[0]=n[0],m[1]=n[1],m[2]=n[2],f[0]=y[0],f[1]=y[1],f[2]=y[2],d[0]=a[0],d[1]=a[1],d[2]=a[2]},[o,s,p,g,M,j,c,w,F,B,T,z,I,L,P,O,D,_]),e.jsx("div",{ref:S,className:`relative h-full w-full overflow-hidden ${X}`.trim()})},b=[{text:e.jsxs(e.Fragment,{children:["Good morning. ",e.jsx("strong",{className:"text-white",children:"Wake by 6 AM"})," has been your steadiest habit at ",e.jsx("span",{className:"text-[#c8f54e] font-mono",children:"38%"})," this month — start there, and the rest tends to follow."]})},{text:e.jsxs(e.Fragment,{children:["Your consistency is building. ",e.jsx("strong",{className:"text-white",children:"5 habits"})," checked this week — you're on track for a new personal best."]})},{text:e.jsxs(e.Fragment,{children:["Remember: ",e.jsx("span",{className:"italic text-[#c8f54e]",children:"small, repeated things"})," compound. You don't need to be perfect — you just need to keep showing up."]})}],ue={enter:o=>({x:o>0?120:-120,opacity:0}),center:{x:0,opacity:1},exit:o=>({x:o<0?120:-120,opacity:0})};function he(){const[o,s]=C.useState(0),[p,g]=C.useState(0),M=()=>{g(1),s(c=>(c+1)%b.length)},j=()=>{g(-1),s(c=>(c-1+b.length)%b.length)};return e.jsxs("div",{className:"bg-[#1a1a1a] rounded-xl p-6 relative overflow-hidden min-h-[180px] flex flex-col justify-between",children:[e.jsx("div",{className:"absolute inset-0 z-0 opacity-45 pointer-events-none",children:e.jsx(le,{color1:"#111111",color2:"#c8f54e",color3:"#ffffff",speed:.25,scale:4,detail:3,glow:1.4,coreSize:.08,swirl:1,fold:-.2,blackPoint:.05,brightness:1.2,colorMode:"molten",grain:!0,grainIntensity:.03,mouseInteraction:!0,mouseStrength:.25,opacity:.9})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 relative z-10",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-[#c8f54e] text-base font-mono",children:"m"}),e.jsx("span",{className:"text-sm font-display font-bold text-white",children:"Today's Note"})]}),e.jsx("span",{className:"text-[10px] font-mono tracking-widest text-[#c8f54e] uppercase",children:"● TODAY"})]}),e.jsx("div",{className:"relative z-10 h-14 overflow-hidden flex items-center",children:e.jsx(te,{initial:!1,custom:p,mode:"popLayout",children:e.jsx(oe.div,{custom:p,variants:ue,initial:"enter",animate:"center",exit:"exit",transition:{x:{type:"spring",stiffness:220,damping:24},opacity:{duration:.25}},className:"text-sm text-white/85 leading-relaxed font-sans w-full",children:b[o].text},o)})}),e.jsxs("div",{className:"flex items-center gap-2 mt-5 pt-4 border-t border-white/10 relative z-10",children:[e.jsx("button",{onClick:j,className:"w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/70 active:scale-90 transition-all cursor-pointer",children:e.jsx(ne,{className:"w-4 h-4"})}),e.jsx("div",{className:"flex gap-1.5 ml-2",children:b.map((c,w)=>{const F=w===o;return e.jsx("div",{className:`h-1.5 rounded-full transition-all duration-300 ${F?"w-5 bg-[#c8f54e]":"w-1.5 bg-white/20"}`},w)})}),e.jsx("button",{onClick:M,className:"w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/70 active:scale-90 transition-all cursor-pointer",children:e.jsx(ie,{className:"w-4 h-4"})})]})]})}export{he as TodaysNote};
