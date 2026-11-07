// effects.js — React Bits components (Aurora · Blur Text · Shiny Text ·
// Chroma Grid · Scroll Reveal · Star Border · Glare Hover · Spotlight Card ·
// Tilted Card · Magnet · Glow Cursor) ported to vanilla JS for personal site V3

// ─── Aurora WebGL shaders ─────────────────────────────────────────────────
const A_VERT = `#version 300 es
in vec2 p;
void main(){gl_Position=vec4(p,0.,1.);}`;

const A_FRAG = `#version 300 es
precision highp float;precision highp int;
uniform vec2 uRes;uniform float uT;
uniform vec3 uStops[5];uniform int uN;
uniform float uAmp,uBlend,uH,uScale,uGlow,uBright,uFlip;
uniform vec3 uPtr;uniform float uReveal,uOpa;
out vec4 oCol;
vec3 pm(vec3 x){return mod(((x*34.+1.)*x),289.);}
float sn(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=x0.x>x0.y?vec2(1,0):vec2(0,1);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.);
  vec3 p2=pm(pm(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m;m=m*m;
  vec3 x2=2.*fract(p2*C.www)-1.;vec3 h=abs(x2)-.5;
  vec3 ox=floor(x2+.5);vec3 a0=x2-ox;
  m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);}
float ss(float e0,float e1,float x){float t=clamp((x-e0)/(e1-e0),0.,1.);return t*t*t*(t*(t*6.-15.)+10.);}
vec3 o2l(vec3 c){
  float l=c.x+.3963377774*c.y+.2158037573*c.z;
  float m=c.x-.1055613458*c.y-.0638541728*c.z;
  float s=c.x-.0894841775*c.y-1.2914855480*c.z;
  l=l*l*l;m=m*m*m;s=s*s*s;
  return vec3(4.0767416621*l-3.3077115913*m+.2309699292*s,
    -1.2684380046*l+2.6097574011*m-.3413193965*s,
    -.0041960863*l-.7034186147*m+1.7076147010*s);}
vec3 srgb(vec3 c){c=clamp(c,0.,1.);return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(.0031308,c));}
vec3 ramp(float t){
  float x=clamp(t,0.,1.)*float(uN-1);
  int i=int(min(floor(x),float(uN-2)));float f=x-float(i);f=f*f*(3.-2.*f);
  vec3 lch=mix(uStops[i],uStops[i+1],f);
  return srgb(o2l(vec3(lch.x,lch.y*cos(lch.z),lch.y*sin(lch.z))));}
float hsh(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
void main(){
  vec2 fr=gl_FragCoord.xy;float y=mix(1.-fr.y/uRes.y,fr.y/uRes.y,uFlip);
  float u=fr.x/uRes.x;float X=(fr.x-uRes.x*.5)/uRes.y;float t=uT;
  float reach=uPtr.z*exp(-pow((X-uPtr.x)/.38,2.));
  vec3 glow=vec3(0);float cover=0.;
  for(int k=0;k<3;k++){
    float lyr=float(k);float seed=lyr*13.7;float pace=t*(1.-lyr*.18);
    float warp=sn(vec2(X*.45*uScale+pace*.02+seed,pace*.05+seed));
    float wave=sn(vec2(X*.75*uScale+warp*.35-pace*.03+seed,pace*.07-seed))*.72
      +sn(vec2(X*1.6*uScale+warp*.5+pace*.04-seed,pace*.1+seed*.5))*.28;
    float hem=uH+lyr*.07+wave*.15*uAmp;hem+=reach*.08*(lyr<.5?1.:.4);
    hem=mix(-.25,hem,uReveal);
    float soft=(.04+uBlend*.16)*(1.+lyr*.9);
    float rise=hem-y;float low=-soft-uGlow*.14;float high=.26+soft*.6;
    float body=pow(ss(low,high,rise),1.5+uGlow*.6);
    float lobes=.86+.14*sn(vec2(X*.9*uScale-pace*.025+seed,y*.3+pace*.04));
    float alpha=body*lobes*(lyr<.5?1.:.32/lyr);
    alpha=clamp(alpha*(1.+reach*.25*ss(.9,0.,abs(y-hem))),0.,1.);
    vec3 tint=ramp(u+.05*sin(pace*.08+lyr*2.3)+lyr*.1+max(rise,0.)*.05);
    glow=1.-(1.-glow)*(1.-tint*alpha);cover=1.-(1.-cover)*(1.-alpha);}
  float fade=ss(0.,.7,uReveal)*uOpa;float str=clamp(uBright,0.,2.);
  glow*=fade*min(str,1.);cover*=fade*min(str,1.);
  glow=1.-pow(1.-glow,vec3(max(str,1.)));
  float d=(hsh(fr)-.5)/255.;
  oCol=vec4(glow+d,clamp(cover+d,0.,1.));}`;

// ─── Aurora JS helpers ────────────────────────────────────────────────────
const _cl=(v,mn,mx)=>Math.min(mx,Math.max(mn,v));
const _prb=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
const _pcc=new Map();
function _col(v){if(_pcc.has(v))return _pcc.get(v);_prb.clearRect(0,0,1,1);_prb.fillStyle='#fff';_prb.fillStyle=v;_prb.fillRect(0,0,1,1);const d=_prb.getImageData(0,0,1,1).data;const r=[d[0]/255,d[1]/255,d[2]/255];_pcc.set(v,r);return r;}
function _oklch(rgb){const[r,g,b]=rgb.map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b);const m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b);const s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);const L=0.2104542553*l+0.793617785*m-0.0040720468*s;const a=1.9779984951*l-2.428592205*m+0.4505937099*s;const b2=0.0259040371*l+0.7827717662*m-0.808675766*s;return[L,Math.hypot(a,b2),Math.atan2(b2,a)];}
function _unwrap(stops){let prev=(stops.find(s=>s[1]>.02)||stops[0])[2];return stops.map(s=>{let h=s[1]>.02?s[2]:prev;while(h-prev>Math.PI)h-=Math.PI*2;while(h-prev<-Math.PI)h+=Math.PI*2;prev=h;return[s[0],s[1],h];});}
function _compsh(gl,type,src){const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);return gl.getShaderParameter(sh,gl.COMPILE_STATUS)?sh:null;}
function _linkprog(gl){const vs=_compsh(gl,gl.VERTEX_SHADER,A_VERT);const fs=_compsh(gl,gl.FRAGMENT_SHADER,A_FRAG);if(!vs||!fs)return null;const prog=gl.createProgram();gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.bindAttribLocation(prog,0,'p');gl.linkProgram(prog);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){gl.deleteProgram(prog);return null;}const u={};const n=gl.getProgramParameter(prog,gl.ACTIVE_UNIFORMS);for(let i=0;i<n;i++){const info=gl.getActiveUniform(prog,i);if(info)u[info.name.replace('[0]','')]=gl.getUniformLocation(prog,info.name);}return{prog,u};}
// __FX_AURORA_STATE__

// ─── Aurora state + render ────────────────────────────────────────────────
const A_CFG = {
  stops:['#1d3d1a','#2a5424','#163318','#1d3d1a'],
  amp:0.65, blend:0.55, speed:0.28, height:0.42,
  scale:1.1, glow:0.5, bright:1.4, opa:0.72
};
const A_PAL = new Float32Array(5*3);
const _ao = {
  canvas:null,gl:null,lnk:null,buf:null,vao:null,
  raf:0,last:0,clock:0,reveal:0,px:0,py:.5,reach:0,
  ptr:{x:0,y:0,inside:false},view:{w:1,h:1},
  _resize:null,_move:null,_leave:null
};

function _aRender(){
  const {gl,lnk,canvas} = _ao;if(!gl||!lnk)return;
  const stops=A_CFG.stops;
  _unwrap(stops.map(s=>_oklch(_col(s)))).forEach((s,i)=>A_PAL.set(s,i*3));
  const u=lnk.u;
  gl.viewport(0,0,canvas.width,canvas.height);
  gl.useProgram(lnk.prog);gl.bindVertexArray(_ao.vao);
  gl.uniform2f(u.uRes,canvas.width,canvas.height);
  gl.uniform1f(u.uT,_ao.clock);gl.uniform3fv(u.uStops,A_PAL);gl.uniform1i(u.uN,stops.length);
  gl.uniform1f(u.uAmp,A_CFG.amp);gl.uniform1f(u.uBlend,A_CFG.blend);gl.uniform1f(u.uH,A_CFG.height);
  gl.uniform1f(u.uScale,A_CFG.scale);gl.uniform1f(u.uGlow,A_CFG.glow);gl.uniform1f(u.uBright,A_CFG.bright);
  gl.uniform1f(u.uFlip,0);gl.uniform3f(u.uPtr,_ao.px,_ao.py,_ao.reach);
  gl.uniform1f(u.uReveal,1-Math.pow(1-_ao.reveal,3));gl.uniform1f(u.uOpa,A_CFG.opa);
  gl.drawArrays(gl.TRIANGLES,0,3);
}

function _aFrame(now){
  _ao.raf=0;if(document.hidden)return;
  const dt=_ao.last?_cl((now-_ao.last)/1000,.0005,.05):1/60;
  _ao.last=now;_ao.clock+=dt*A_CFG.speed;
  const eng=_ao.ptr.inside;const f=1-Math.exp(-dt/.6);
  if(eng){const tx=(_ao.ptr.x-_ao.view.w/2)/_ao.view.h;const ty=_ao.ptr.y/_ao.view.h;_ao.px+=(tx-_ao.px)*f;_ao.py+=(ty-_ao.py)*f;}
  _ao.reach+=((eng?1:0)-_ao.reach)*(1-Math.exp(-dt/(eng?.9:1.4)));
  if(_ao.reveal<1)_ao.reveal=Math.min(1,_ao.reveal+dt/2.4);
  _aRender();_ao.raf=requestAnimationFrame(_aFrame);
}
// __FX_AURORA_MOUNT__

// ─── Aurora mount / destroy ───────────────────────────────────────────────
function mountAurora(){
  if(_ao.canvas||window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const c=document.createElement('canvas');
  c.className='aurora-bg';c.setAttribute('aria-hidden','true');
  document.body.insertBefore(c,document.body.firstChild);
  const gl=c.getContext('webgl2',{alpha:true,premultipliedAlpha:true,antialias:false,depth:false});
  if(!gl){c.remove();return;}
  const lnk=_linkprog(gl);if(!lnk){c.remove();return;}
  const buf=gl.createBuffer();const vao=gl.createVertexArray();
  gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  Object.assign(_ao,{canvas:c,gl,lnk,buf,vao,raf:0,last:0,clock:0,reveal:0,px:0,py:.5,reach:0});
  const resize=()=>{const dpr=Math.min(devicePixelRatio||1,2);const w=Math.max(1,innerWidth);const h=Math.max(1,innerHeight);_ao.view={w,h};c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);_aRender();};
  const move=e=>{_ao.ptr={x:e.clientX,y:e.clientY,inside:true};if(!_ao.raf)_ao.raf=requestAnimationFrame(_aFrame);};
  const leave=()=>{_ao.ptr.inside=false;};
  window.addEventListener('resize',resize);window.addEventListener('pointermove',move,{passive:true});
  document.documentElement.addEventListener('pointerleave',leave);
  document.addEventListener('visibilitychange',()=>{_ao.last=0;if(!_ao.raf&&!document.hidden)_ao.raf=requestAnimationFrame(_aFrame);});
  Object.assign(_ao,{_resize:resize,_move:move,_leave:leave});
  resize();_ao.raf=requestAnimationFrame(_aFrame);
}

function destroyAurora(){
  if(!_ao.canvas)return;
  cancelAnimationFrame(_ao.raf);
  window.removeEventListener('resize',_ao._resize);
  window.removeEventListener('pointermove',_ao._move);
  document.documentElement.removeEventListener('pointerleave',_ao._leave);
  _ao.gl?.getExtension('WEBGL_lose_context')?.loseContext();
  _ao.canvas.remove();Object.assign(_ao,{canvas:null,gl:null,lnk:null,buf:null,vao:null,raf:0});
}

// ─── Glow Cursor ──────────────────────────────────────────────────────────
let _gc=null;
function mountGlowCursor(){
  if(_gc||'ontouchstart' in window)return;
  _gc=document.createElement('div');_gc.className='glow-cursor-el';document.body.appendChild(_gc);
  const mv=e=>{_gc.style.left=e.clientX+'px';_gc.style.top=e.clientY+'px';};
  window.addEventListener('pointermove',mv,{passive:true});_gc._mv=mv;
}
function destroyGlowCursor(){if(!_gc)return;window.removeEventListener('pointermove',_gc._mv);_gc.remove();_gc=null;}
// __FX_TEXT__

// ─── Blur Text ────────────────────────────────────────────────────────────
function initBlurText(els){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  els.forEach(el=>{
    if(el.dataset.bt)return;el.dataset.bt='1';
    el.childNodes.forEach(node=>{
      if(node.nodeType!==3||!node.textContent.trim())return;
      const frag=document.createDocumentFragment();
      [...node.textContent].forEach((ch,i)=>{
        if(ch===' '){frag.append(' ');return;}
        const s=document.createElement('span');s.className='blur-text-char';s.textContent=ch;
        s.style.setProperty('--d',`${i*22}ms`);frag.append(s);
      });
      node.replaceWith(frag);
    });
  });
}

// ─── Shiny Text ───────────────────────────────────────────────────────────
function initShinyText(els){
  els.forEach(el=>{if(!el.dataset.sh){el.dataset.sh='1';el.classList.add('shiny-text-active');}});
}

// ─── Glare Hover ──────────────────────────────────────────────────────────
function initGlareHover(els,signal){
  els.forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      el.style.setProperty('--glare-x',((e.clientX-r.left)/r.width*100)+'%');
      el.style.setProperty('--glare-y',((e.clientY-r.top)/r.height*100)+'%');
      el.style.setProperty('--glare-opacity','1');
    },{signal});
    el.addEventListener('mouseleave',()=>el.style.setProperty('--glare-opacity','0'),{signal});
  });
}

// ─── Tilted Card ──────────────────────────────────────────────────────────
function initTiltedCard(els,signal){
  if('ontouchstart' in window)return;
  els.forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)/r.width;
      const y=(e.clientY-r.top-r.height/2)/r.height;
      el.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*5}deg) translateY(-4px)`;
      el.style.transition='transform 0.08s ease';
    },{signal});
    el.addEventListener('mouseleave',()=>{
      el.style.transform='';el.style.transition='transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    },{signal});
  });
}
// __FX_CARDS__

// ─── Spotlight Card ───────────────────────────────────────────────────────
function initSpotlightCard(els,signal){
  els.forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      el.style.setProperty('--spot-x',`${e.clientX-r.left}px`);
      el.style.setProperty('--spot-y',`${e.clientY-r.top}px`);
      el.style.setProperty('--spot-opacity','1');
    },{signal});
    el.addEventListener('mouseleave',()=>el.style.setProperty('--spot-opacity','0'),{signal});
  });
}

// ─── Chroma Grid ──────────────────────────────────────────────────────────
function initChromaGrid(gallery,signal){
  if(!gallery)return;
  const items=[...gallery.querySelectorAll('.feature')];
  items.forEach(it=>it.classList.add('chroma-item'));
  gallery.addEventListener('mousemove',e=>{
    const r=gallery.getBoundingClientRect();const x=e.clientX-r.left;const y=e.clientY-r.top;
    items.forEach(it=>{
      const ir=it.getBoundingClientRect();
      const cx=ir.left-r.left+ir.width/2;const cy=ir.top-r.top+ir.height/2;
      it.classList.toggle('is-lit',Math.hypot(x-cx,y-cy)<340);
    });
  },{signal});
  gallery.addEventListener('mouseleave',()=>items.forEach(it=>it.classList.remove('is-lit')),{signal});
}

// ─── Star Border ──────────────────────────────────────────────────────────
function initStarBorder(els){els.forEach(el=>el.classList.add('star-border'));}

// ─── Magnet ───────────────────────────────────────────────────────────────
function initMagnet(els,signal){
  if('ontouchstart' in window)return;
  els.forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*.28;const y=(e.clientY-r.top-r.height/2)*.28;
      el.style.transform=`translate(${x}px,${y}px)`;el.style.transition='transform 0.2s ease';
    },{signal});
    el.addEventListener('mouseleave',()=>{
      el.style.transform='';el.style.transition='transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    },{signal});
  });
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────
let _sObs=null;
function initScrollReveal(els){
  _sObs?.disconnect();
  _sObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');_sObs.unobserve(e.target);}});
  },{threshold:0.1,rootMargin:'0px 0px -24px 0px'});
  els.forEach((el,i)=>{
    if(el.classList.contains('is-visible'))return;
    el.classList.add('scroll-reveal');el.style.setProperty('--reveal-delay',`${i*55}ms`);_sObs.observe(el);
  });
}
// __FX_INIT__

// ─── Main orchestrator ────────────────────────────────────────────────────
let _ctrl=null;

export function initEffects(route){
  _ctrl?.abort();
  _ctrl=new AbortController();
  const {signal}=_ctrl;
  const home=!route;

  // Aurora WebGL background (non-home only)
  if(home)destroyAurora();else mountAurora();

  // Glow cursor (non-home, non-touch)
  if(!home&&!('ontouchstart' in window))mountGlowCursor();
  else if(home)destroyGlowCursor();

  if(home)return;

  // ── Always on inner pages ────────────────────────
  // ── 通用滚动揭示 ──────────────────────────────────
  // 一次性观察所有页面的渐显元素，避免多次调用导致观察器断开
  initScrollReveal(document.querySelectorAll('.case-section,.timeline-row,.focus-grid article,.resume-section,.about-statement>p'));
  initShinyText(document.querySelectorAll('.wordmark'));
  initBlurText(document.querySelectorAll('.display-heading,.about-heading,.contact-heading,.case-title'));

  // ── Work page ────────────────────────────────────
  if(route==='work'){
    const gallery=document.querySelector('.staggered-gallery');
    initChromaGrid(gallery,signal);
    initTiltedCard(document.querySelectorAll('.staggered-gallery .feature'),signal);
    initGlareHover(document.querySelectorAll('.staggered-gallery .feature-media'),signal);
    initStarBorder(document.querySelectorAll('.closing>a'));
  }

  // ── Project detail ───────────────────────────────
  if(route==='project'){
    initGlareHover(document.querySelectorAll('.case-visual'),signal);
    initStarBorder(document.querySelectorAll('.next-project'));
    // .case-section 已在通用 initScrollReveal 中
  }

  // ── Toolkit ──────────────────────────────────────
  if(route==='toolkit'){
    initSpotlightCard(document.querySelectorAll('.resource-card'),signal);
    initGlareHover(document.querySelectorAll('.resource-card'),signal);
  }

  // ── Contact ──────────────────────────────────────
  if(route==='contact'){
    initMagnet(document.querySelectorAll('.contact-card'),signal);
    initStarBorder(document.querySelectorAll('.contact-card'));
  }

  // ── About ────────────────────────────────────────
  // 所有滚动揭示元素已在通用 initScrollReveal 中

  // ── Resume ───────────────────────────────────────
  // (已在通用 initScrollReveal 中包含 .resume-section)
}
