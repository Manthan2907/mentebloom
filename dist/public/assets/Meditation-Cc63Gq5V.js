import{a as B,r as m,j as e,f as Y}from"./index-CWQa-JQK.js";import{T as $}from"./TopNav-Cx3qSM34.js";import{AppFooter as K}from"./AppFooter-2Kx8bbfC.js";import{C as G,a as W}from"./animated-glow-card-YWMdkHjs.js";import{R as _,T as Q,P as X,V as j,M as V}from"./Triangle-2qzboODN.js";import{S as Z}from"./sparkles--2mbfeX3.js";import{m as z}from"./proxy-D3gJo6JU.js";import{P as J,a as ee,Z as te}from"./zap-CGAhvGoT.js";import{C as ae}from"./circle-check-DpvVNux1.js";import{S as se}from"./smile-DWHGCJyQ.js";import"./calendar-DDO_S5bt.js";const ne=B("Coffee",[["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M14 2v2",key:"6buw04"}],["path",{d:"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",key:"pwadti"}],["path",{d:"M6 2v2",key:"colzsn"}]]);const L=B("Wind",[["path",{d:"M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2",key:"1k4u03"}],["path",{d:"M9.6 4.6A2 2 0 1 1 11 8H2",key:"b7d0fd"}],["path",{d:"M12.6 19.4A2 2 0 1 0 14 16H2",key:"1p5cb3"}]]);function oe({hue:t=0,hoverIntensity:i=.2,rotateOnHover:o=!0,forceHoverState:d=!1,backgroundColor:r="#000000",className:c=""}){const u=m.useRef(null),h=`
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `,x=`
    precision highp float;

    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform vec3 backgroundColor;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }
    
    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }
    
    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }
    
    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }
    
    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }
    
    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }
    
    const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
    const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
    const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
    const float innerRadius = 0.6;
    const float noiseScale = 0.65;
    
    float light1(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);
    }
    
    float light2(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * dist * attenuation);
    }
    
    vec4 draw(vec2 uv) {
      vec3 color1 = adjustHue(baseColor1, hue);
      vec3 color2 = adjustHue(baseColor2, hue);
      vec3 color3 = adjustHue(baseColor3, hue);
      
      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float invLen = len > 0.0 ? 1.0 / len : 0.0;
      
      float bgLuminance = dot(backgroundColor, vec3(0.299, 0.587, 0.114));
      
      float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
      float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(1.0, 10.0, d0);

      v0 *= smoothstep(r0 * 1.05, r0, len);
      float innerFade = smoothstep(r0 * 0.8, r0 * 0.95, len);
      v0 *= mix(innerFade, 1.0, bgLuminance * 0.7);
      float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
      
      float a = iTime * -1.0;
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      float d = distance(uv, pos);
      float v1 = light2(1.5, 5.0, d);
      v1 *= light1(1.0, 50.0, d0);
      
      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
      
      vec3 colBase = mix(color1, color2, cl);
      float fadeAmount = mix(1.0, 0.1, bgLuminance);
      
      vec3 darkCol = mix(color3, colBase, v0);
      darkCol = (darkCol + v1) * v2 * v3;
      darkCol = clamp(darkCol, 0.0, 1.0);
      
      vec3 lightCol = (colBase + v1) * mix(1.0, v2 * v3, fadeAmount);
      lightCol = mix(backgroundColor, lightCol, v0);
      lightCol = clamp(lightCol, 0.0, 1.0);
      
      vec3 finalCol = mix(darkCol, lightCol, bgLuminance);
      
      return extractAlpha(finalCol);
    }
    
    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;
      
      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
      
      uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
      uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
      
      return draw(uv);
    }
    
    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;return m.useEffect(()=>{const n=u.current;if(!n)return;const b=new _({alpha:!0,premultipliedAlpha:!1}),a=b.gl;a.clearColor(0,0,0,0),n.appendChild(a.canvas);const N=new Q(a),f=new X(a,{vertex:h,fragment:x,uniforms:{iTime:{value:0},iResolution:{value:new j(a.canvas.width,a.canvas.height,a.canvas.width/a.canvas.height)},hue:{value:t},hover:{value:0},rot:{value:0},hoverIntensity:{value:i},backgroundColor:{value:q(r)}}}),C=new V(a,{geometry:N,program:f});function g(){if(!n)return;const v=window.devicePixelRatio||1,p=n.clientWidth,w=n.clientHeight;b.setSize(p*v,w*v),a.canvas.style.width=p+"px",a.canvas.style.height=w+"px",f.uniforms.iResolution.value.set(a.canvas.width,a.canvas.height,a.canvas.width/a.canvas.height)}window.addEventListener("resize",g),g();let s=0,l=0,y=0;const U=.3,I=v=>{const p=n.getBoundingClientRect(),w=v.clientX-p.left,O=v.clientY-p.top,T=p.width,k=p.height,A=Math.min(T,k),P=T/2,F=k/2,M=(w-P)/A*2,H=(O-F)/A*2;Math.sqrt(M*M+H*H)<1.2?s=1:s=0},E=()=>{s=0};n.addEventListener("mousemove",I),n.addEventListener("mouseleave",E);let S;const R=v=>{S=requestAnimationFrame(R);const p=(v-l)*.001;l=v,f.uniforms.iTime.value=v*.001,f.uniforms.hue.value=t,f.uniforms.hoverIntensity.value=i;const w=d?1:s;f.uniforms.hover.value+=(w-f.uniforms.hover.value)*.1,o&&w>.5&&(y+=p*U),f.uniforms.rot.value=y,f.uniforms.backgroundColor.value=q(r),b.render({scene:C})};return S=requestAnimationFrame(R),()=>{cancelAnimationFrame(S),window.removeEventListener("resize",g),n.removeEventListener("mousemove",I),n.removeEventListener("mouseleave",E),n.removeChild(a.canvas),a.getExtension("WEBGL_lose_context")?.loseContext()}},[t,i,o,d,r]),e.jsx("div",{ref:u,className:`w-full h-full ${c}`})}function re(t,i,o){let d,r,c;if(i===0)d=r=c=o;else{const u=(n,b,a)=>(a<0&&(a+=1),a>1&&(a-=1),a<.16666666666666666?n+(b-n)*6*a:a<.5?b:a<.6666666666666666?n+(b-n)*(.6666666666666666-a)*6:n),h=o<.5?o*(1+i):o+i-o*i,x=2*o-h;d=u(x,h,t+1/3),r=u(x,h,t),c=u(x,h,t-1/3)}return new j(d,r,c)}function q(t){if(t.startsWith("#")){const d=parseInt(t.slice(1,3),16)/255,r=parseInt(t.slice(3,5),16)/255,c=parseInt(t.slice(5,7),16)/255;return new j(d,r,c)}const i=t.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(i)return new j(parseInt(i[1])/255,parseInt(i[2])/255,parseInt(i[3])/255);const o=t.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);if(o){const d=parseInt(o[1])/360,r=parseInt(o[2])/100,c=parseInt(o[3])/100;return re(d,r,c)}return new j(0,0,0)}const D=[{id:"box",name:"Box Breathing",subtitle:"Equal 4-4-4-4 rhythm for exam stress & mental clarity",inSec:4,holdSec:4,outSec:4,restSec:4,badge:"EXAM STRESS RESET",color:"#c8f54e"},{id:"478",name:"4-7-8 Relaxing Breath",subtitle:"Deep calming technique to soothe nervous tension",inSec:4,holdSec:7,outSec:8,restSec:0,badge:"ANXIETY RELIEF",color:"#38bdf8"},{id:"coherent",name:"Coherent Breathing",subtitle:"Steady 5s in / 5s out to align heart rate variability",inSec:5,holdSec:0,outSec:5,restSec:0,badge:"EMOTIONAL BALANCE",color:"#a855f7"}];function be(){const[t,i]=m.useState(D[0]),[o,d]=m.useState(5),[r,c]=m.useState(!1),[u,h]=m.useState(300),[x,n]=m.useState("In"),[b,a]=m.useState(4);m.useEffect(()=>{c(!1),h(o*60),n("In"),a(t.inSec)},[t,o]),m.useEffect(()=>{let s=null;return r&&u>0&&(s=setInterval(()=>{h(l=>l<=1?(c(!1),0):l-1),a(l=>l<=1?(n(y=>y==="In"?t.holdSec>0?"Hold":"Out":y==="Hold"?"Out":y==="Out"&&t.restSec>0?"Rest":"In"),x==="In"?t.holdSec||t.outSec:x==="Hold"?t.outSec:x==="Out"&&t.restSec||t.inSec):l-1)},1e3)),()=>{s&&clearInterval(s)}},[r,u,x,t]);const N=()=>{c(!1),h(o*60),n("In"),a(t.inSec)},f=s=>{const l=Math.floor(s/60),y=s%60;return`${String(l).padStart(2,"0")}:${String(y).padStart(2,"0")}`},g={In:{text:"Breathe In...",subText:"Deep slow breath expanding into your chest and belly",color:t.color,scale:1.4,orbHue:80},Hold:{text:"Hold Breath...",subText:"Pause softly and feel the calm stillness inside",color:"#eab308",scale:1.4,orbHue:45},Out:{text:"Breathe Out...",subText:"Release all stress, tension, and unwanted thoughts",color:"#f97316",scale:.85,orbHue:15},Rest:{text:"Rest & Relax...",subText:"Allow your body and mind to settle completely",color:"#38bdf8",scale:.85,orbHue:200}}[x];return e.jsxs("div",{className:"min-h-screen bg-[#faf8f5] text-[#1a1a1a] flex flex-col justify-between selection:bg-[#c8f54e] selection:text-[#1a1a1a]",children:[e.jsx($,{}),e.jsxs("main",{className:"container max-w-[1280px] mx-auto px-4 lg:px-8 py-8 flex-1",children:[e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-[#e8e4df]",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsxs("span",{className:"text-[10px] font-mono tracking-widest uppercase bg-[#c8f54e] text-[#1a1a1a] px-2.5 py-0.5 rounded-sm font-bold flex items-center gap-1",children:[e.jsx(L,{className:"w-3.5 h-3.5"}),"MINDFUL SANCTUARY"]}),e.jsx("span",{className:"text-xs font-mono text-[#1a1a1a]/40 uppercase",children:"CALM GUIDED BREATHWORK"})]}),e.jsx("h1",{className:"font-display text-3xl md:text-4xl font-extrabold text-[#1a1a1a] tracking-tight",children:"Mindfulness & Breathing Space"}),e.jsx("p",{className:"text-sm text-[#1a1a1a]/60 mt-1 max-w-2xl font-sans",children:"Slow down, reset your nervous system, and restore inner clarity with animated guided breathwork. No distractions, just quiet calm."})]}),e.jsxs("div",{className:"flex items-center gap-3 bg-[#1a1a1a] text-white p-3 px-4 rounded-2xl shadow-xs shrink-0",children:[e.jsx(Z,{className:"w-4 h-4 text-[#c8f54e] shrink-0"}),e.jsxs("div",{className:"text-xs font-mono",children:[e.jsx("span",{className:"text-[#c8f54e] font-bold block",children:"DAILY MINDFULNESS REMINDER"}),e.jsx("span",{className:"text-white/70",children:`"You don't have to figure it all out right now."`})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12",children:[e.jsx("div",{className:"lg:col-span-7 flex flex-col items-center",children:e.jsx(G,{className:"w-full",children:e.jsx(W,{className:"shadow-2xl",children:e.jsxs("div",{className:"relative w-full rounded-3xl bg-[#121212] text-white p-6 sm:p-10 flex flex-col items-center justify-between min-h-[580px] border border-white/10 overflow-hidden text-center shadow-2xl",children:[e.jsx("div",{className:"absolute inset-0 pointer-events-none z-0",children:e.jsx(oe,{hue:g.orbHue,hoverIntensity:.5,rotateOnHover:!0,forceHoverState:!1,backgroundColor:"#121212",className:"w-full h-full"})}),e.jsxs("div",{className:"w-full flex items-center justify-between z-10",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"w-2.5 h-2.5 rounded-full bg-[#c8f54e] animate-pulse shadow-[0_0_8px_#c8f54e]"}),e.jsxs("span",{className:"text-[10px] font-mono font-bold tracking-wider uppercase text-[#c8f54e]",children:[t.name.toUpperCase()," MODE"]})]}),e.jsx("div",{className:"flex items-center gap-1.5 text-[10px] font-mono text-white/70 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 font-bold uppercase",children:"GUIDED BREATHWORK"})]}),e.jsxs("div",{className:"my-auto py-8 space-y-4 z-10 max-w-md mx-auto",children:[e.jsxs(z.div,{animate:{scale:r?g.scale:1},transition:{duration:t.inSec,ease:"easeInOut"},className:"space-y-2",children:[e.jsx(z.h2,{initial:{opacity:0,y:8},animate:{opacity:1,y:0},className:"font-display text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md",children:g.text},x),e.jsx("p",{className:"text-xs sm:text-sm font-sans text-white/75 leading-relaxed max-w-sm mx-auto",children:g.subText})]}),e.jsx("div",{className:"pt-2 font-mono",children:e.jsx("span",{className:"text-5xl sm:text-6xl font-black text-[#c8f54e] tracking-tight drop-shadow-sm",children:f(u)})})]}),e.jsxs("div",{className:"w-full flex items-center justify-center gap-4 pt-4 z-10",children:[e.jsx("button",{onClick:N,className:"p-3.5 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full transition-all cursor-pointer border border-white/15 backdrop-blur-md active:scale-95",title:"Reset Session",children:e.jsx(Y,{className:"w-4.5 h-4.5"})}),e.jsx("button",{onClick:()=>c(!r),className:`px-8 py-3.5 rounded-full font-mono text-xs font-extrabold transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${r?"bg-white text-[#121212] hover:bg-white/90":"bg-[#c8f54e] text-[#121212] hover:bg-[#b5e43b]"}`,children:r?e.jsxs(e.Fragment,{children:[e.jsx(J,{className:"w-4 h-4 fill-current"}),"PAUSE SESSION"]}):e.jsxs(e.Fragment,{children:[e.jsx(ee,{className:"w-4 h-4 fill-current ml-0.5"}),"BEGIN BREATHING"]})})]})]})})})}),e.jsxs("div",{className:"lg:col-span-5 space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-2xl border border-[#e8e4df] p-6 shadow-sm space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-[#e8e4df] pb-3",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-display font-bold text-lg text-[#1a1a1a]",children:"Breathing Patterns"}),e.jsx("p",{className:"text-xs font-mono text-[#1a1a1a]/40 uppercase",children:"CHOOSE YOUR GUIDED MINDFUL RHYTHM"})]}),e.jsx(L,{className:"w-5 h-5 text-[#1a1a1a]/40"})]}),e.jsx("div",{className:"space-y-3",children:D.map(s=>{const l=t.id===s.id;return e.jsxs("div",{onClick:()=>i(s),className:`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${l?"bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-sm":"bg-[#faf8f5] text-[#1a1a1a] border-[#e8e4df] hover:border-[#1a1a1a]/30 hover:bg-[#f0ece7]"}`,children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"flex items-center gap-2",children:e.jsx("span",{className:`text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm ${l?"bg-[#c8f54e] text-[#1a1a1a]":"bg-[#1a1a1a]/10 text-[#1a1a1a]/70"}`,children:s.badge})}),e.jsx("h4",{className:"font-display font-bold text-sm",children:s.name}),e.jsx("p",{className:`text-xs font-sans ${l?"text-white/70":"text-[#1a1a1a]/60"}`,children:s.subtitle})]}),e.jsx("div",{className:`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${l?"border-[#c8f54e] bg-[#c8f54e] text-[#1a1a1a]":"border-[#e8e4df] bg-white text-transparent"}`,children:e.jsx(ae,{className:"w-3.5 h-3.5"})})]},s.id)})})]}),e.jsxs("div",{className:"bg-white rounded-2xl border border-[#e8e4df] p-6 shadow-sm space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-display font-bold text-base text-[#1a1a1a]",children:"Session Duration"}),e.jsx("p",{className:"text-xs font-mono text-[#1a1a1a]/40 uppercase",children:"SET YOUR DEDICATED QUIET TIME"})]}),e.jsx("div",{className:"grid grid-cols-4 gap-2",children:[3,5,10,15].map(s=>e.jsxs("button",{onClick:()=>d(s),className:`py-2.5 rounded-xl font-mono text-xs font-bold border transition-colors cursor-pointer ${o===s?"bg-[#1a1a1a] text-white border-[#1a1a1a]":"bg-[#faf8f5] text-[#1a1a1a]/70 border-[#e8e4df] hover:bg-[#e8e4df]"}`,children:[s," MIN"]},s))})]})]})]}),e.jsxs("div",{className:"mt-8 space-y-4",children:[e.jsx("div",{className:"flex items-center justify-between",children:e.jsxs("div",{children:[e.jsx("h2",{className:"font-display font-bold text-xl text-[#1a1a1a]",children:"Quick Mindful Grounding Techniques"}),e.jsx("p",{className:"text-xs font-mono text-[#1a1a1a]/40 uppercase",children:"SIMPLE PRACTICES TO RESET ACADEMIC ANXIETY ANYTIME"})]})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"bg-white rounded-2xl border border-[#e8e4df] p-5 shadow-xs space-y-3 hover:border-[#1a1a1a]/20 transition-all",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-[10px] font-mono font-bold bg-[#faf8f5] border border-[#e8e4df] px-2 py-0.5 rounded-md",children:"TECHNIQUE 01"}),e.jsx(se,{className:"w-4 h-4 text-[#c8f54e] fill-[#1a1a1a]"})]}),e.jsx("h3",{className:"font-display font-bold text-base text-[#1a1a1a]",children:"Physical Unclench"}),e.jsx("p",{className:"text-xs font-sans text-[#1a1a1a]/70 leading-relaxed",children:"Release your jaw, lower your shoulders away from your ears, and rest your hands palms-up on your lap."})]}),e.jsxs("div",{className:"bg-white rounded-2xl border border-[#e8e4df] p-5 shadow-xs space-y-3 hover:border-[#1a1a1a]/20 transition-all",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-[10px] font-mono font-bold bg-[#faf8f5] border border-[#e8e4df] px-2 py-0.5 rounded-md",children:"TECHNIQUE 02"}),e.jsx(te,{className:"w-4 h-4 text-[#38bdf8]"})]}),e.jsx("h3",{className:"font-display font-bold text-base text-[#1a1a1a]",children:"5-4-3-2-1 Sensory Anchor"}),e.jsx("p",{className:"text-xs font-sans text-[#1a1a1a]/70 leading-relaxed",children:"Look around to spot 5 objects, feel 4 textures, listen for 3 sounds, smell 2 scents, and take 1 deep breath."})]}),e.jsxs("div",{className:"bg-white rounded-2xl border border-[#e8e4df] p-5 shadow-xs space-y-3 hover:border-[#1a1a1a]/20 transition-all",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-[10px] font-mono font-bold bg-[#faf8f5] border border-[#e8e4df] px-2 py-0.5 rounded-md",children:"TECHNIQUE 03"}),e.jsx(ne,{className:"w-4 h-4 text-[#a855f7]"})]}),e.jsx("h3",{className:"font-display font-bold text-base text-[#1a1a1a]",children:"Mindful Micro-Break"}),e.jsx("p",{className:"text-xs font-sans text-[#1a1a1a]/70 leading-relaxed",children:"Step away from all screens for 3 minutes. Sip warm water slowly, noticing the sensation of each swallow."})]})]})]})]}),e.jsx(K,{})]})}export{be as default};
