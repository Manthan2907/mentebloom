import{a as K,r as v,j as i}from"./index-CWQa-JQK.js";import{R as Z,T as ee,P as te,M as oe}from"./Triangle-2qzboODN.js";import{m as ne}from"./proxy-D3gJo6JU.js";const ie=K("Quote",[["path",{d:"M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",key:"rib7q0"}],["path",{d:"M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",key:"1ymkrd"}]]),re=r=>{const a=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r);return a?[parseInt(a[1],16)/255,parseInt(a[2],16)/255,parseInt(a[3],16)/255]:[1,.5,.2]},ae=`#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,se=60,le=r=>`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
uniform float uQuality;
uniform float uStepScale;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);

  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.0; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y));
    p.z -= 4.;
    S = p;
    d = p.y-T;

    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T));
    z += d = (abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4) * uStepScale;
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
    if (i >= uQuality) break;
  }

  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`,ue=({color:r="#ffffff",speed:a=1,direction:l="forward",scale:m=1,opacity:j=1,mouseInteractive:h=!0,renderScale:M=.55,maxDpr:I=1.5,targetFps:E=60,iterations:S=60})=>{const R=v.useRef(null),F=v.useRef({x:0,y:0}),y=v.useRef(null);return v.useEffect(()=>{if(!R.current)return;const s=R.current,w=typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,B=r?1:0,Y=r?re(r):[1,1,1],_=l==="reverse"?-1:1;let p;try{p=new Z({webgl:2,alpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,I)})}catch{return}const u=p.gl;if(!u)return;const o=u.canvas;o.style.display="block",o.style.width="100%",o.style.height="100%",s.appendChild(o);const W=new ee(u),c=new te(u,{vertex:ae,fragment:le(),uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uCustomColor:{value:new Float32Array(Y)},uUseCustomColor:{value:B},uSpeed:{value:a*.4},uDirection:{value:_},uScale:{value:m},uOpacity:{value:j},uMouse:{value:new Float32Array([0,0])},uMouseInteractive:{value:h?1:0},uQuality:{value:S},uStepScale:{value:se/S}}}),L=new oe(u,{geometry:W,program:c}),N=e=>{if(!h)return;const n=s.getBoundingClientRect();y.current={x:e.clientX-n.left,y:e.clientY-n.top}};h&&s.addEventListener("mousemove",N,{passive:!0});let z=!1;const O=()=>{const e=s.getBoundingClientRect(),n=Math.max(1,Math.floor(e.width*M)),b=Math.max(1,Math.floor(e.height*M));p.setSize(n,b),o.style.width="100%",o.style.height="100%";const C=c.uniforms.iResolution.value;C[0]=u.drawingBufferWidth,C[1]=u.drawingBufferHeight},k=new ResizeObserver(()=>{z||(z=!0,requestAnimationFrame(()=>{z=!1,O()}))});k.observe(s),O();let t=0,g=!1,f=!0,x=document.visibilityState!=="hidden";const G=performance.now(),H=1e3/E;let T=0;const X=()=>{c.uniforms.iTime.value=0,p.render({scene:L})},d=e=>{if(g||!f||!x)return;if(e-T<H){t=requestAnimationFrame(d);return}if(T=e,y.current){F.current=y.current,y.current=null;const b=c.uniforms.uMouse.value;b[0]=F.current.x,b[1]=F.current.y}let n=(e-G)*.001;if(l==="pingpong"){const C=n%10,$=Math.floor(n/10)%2===0,A=C/10,U=A*A*(3-2*A),J=$?U*10:(1-U)*10;c.uniforms.uDirection.value=1,c.uniforms.iTime.value=J}else c.uniforms.iTime.value=n;p.render({scene:L}),t=requestAnimationFrame(d)},Q=e=>{e.preventDefault(),g=!0,cancelAnimationFrame(t)},q=()=>{g=!1,f&&x&&!w&&(cancelAnimationFrame(t),t=requestAnimationFrame(d))};o.addEventListener("webglcontextlost",Q),o.addEventListener("webglcontextrestored",q);const D=new IntersectionObserver(([e])=>{const n=f;f=e.isIntersecting,f&&!n&&!g&&x&&!w&&(cancelAnimationFrame(t),t=requestAnimationFrame(d))},{threshold:0});D.observe(s);const P=()=>{x=document.visibilityState!=="hidden",x&&f&&!g&&!w?(cancelAnimationFrame(t),T=0,t=requestAnimationFrame(d)):cancelAnimationFrame(t)};return document.addEventListener("visibilitychange",P),w?X():t=requestAnimationFrame(d),()=>{cancelAnimationFrame(t),k.disconnect(),D.disconnect(),document.removeEventListener("visibilitychange",P),o.removeEventListener("webglcontextlost",Q),o.removeEventListener("webglcontextrestored",q),h&&s&&s.removeEventListener("mousemove",N);try{s?.removeChild(o)}catch{}}},[r,a,l,m,j,h,M,I,E,S]),i.jsx("div",{ref:R,className:"w-full h-full relative overflow-hidden"})},V=[{text:"The quiet moments between habits are where growth takes root.",author:"Mentebloom"},{text:"You don't need to be perfect. You just need to keep showing up.",author:"Mentebloom"},{text:"A gentle morning routine can hold more power than a rigid schedule.",author:"Mentebloom"},{text:"Your body remembers what your mind tries to forget. Be kind to both.",author:"Mentebloom"},{text:"Progress isn't always visible. Trust the practice.",author:"Mentebloom"},{text:"The days you didn't feel like it are the ones that built your resilience.",author:"Mentebloom"},{text:"Notice how you feel, not just what you did.",author:"Mentebloom"}];function de(){const[r,a]=v.useState(0);return v.useEffect(()=>{const l=setInterval(()=>{a(m=>(m+1)%V.length)},2e4);return()=>clearInterval(l)},[]),i.jsxs("div",{className:"rounded-xl border border-[#e8e4df] p-6 shadow-sm relative overflow-hidden bg-white/40 backdrop-blur-xs min-h-[140px] flex flex-col justify-center",children:[i.jsx("div",{className:"absolute inset-0 z-0 opacity-45 pointer-events-none",children:i.jsx(ue,{color:"#becf97",speed:.5,direction:"forward",scale:1.2,opacity:.8,mouseInteractive:!0,iterations:65})}),i.jsx(ie,{className:"absolute top-3 right-4 w-8 h-8 text-[#1a1a1a]/5"}),i.jsx("div",{className:"relative z-10 h-[88px] overflow-hidden",children:i.jsx(ne.div,{animate:{y:-r*88},transition:{type:"spring",stiffness:70,damping:14},className:"w-full",children:V.map((l,m)=>i.jsxs("div",{className:"h-[88px] flex flex-col justify-center",children:[i.jsxs("p",{className:"font-display text-sm md:text-base text-[#1a1a1a]/80 italic leading-relaxed mb-1.5",children:['"',l.text,'"']}),i.jsxs("span",{className:"text-[9px] font-mono text-[#1a1a1a]/40 tracking-wider",children:["— ",l.author]})]},m))})})]})}export{de as QuoteWidget};
