import{r as v,u as b,a as w,j as m,B as C,b as M,C as y,A as S,c as j}from"./three-uwpwaWdX.js";import{s as g}from"./index-CrgzNyfA.js";import"./motion-wjhklMBI.js";function P({children:t}){const s=v.useRef(),{viewport:h,size:a}=b();return w((l,c)=>{const i=s.current;if(!i)return;const r=l.clock.elapsedTime,n=Math.min(1,c*2.4);i.rotation.y+=(r*.055+g.pointer.x*.34-i.rotation.y)*n,i.rotation.x+=(g.pointer.y*.16-i.rotation.x)*n;const o=a.width>900?h.width*.22:0;i.position.x+=(o-i.position.x)*n}),m.jsx("group",{ref:s,children:t})}const x=Math.PI*2;function p(){return Math.random()+Math.random()+Math.random()-1.5}function T(t){const s=new Float32Array(t*3),h=new Float32Array(t*3),a=new Float32Array(t*3),l=new Float32Array(t*3),c=new Float32Array(t);for(let i=0;i<t;i++){const r=i*3;c[i]=Math.random();{let n=p(),o=p(),e=p();const d=Math.sqrt(n*n+o*o+e*e)||1;n/=d,o/=d,e/=d;const u=Math.random()<.82?2.1+Math.random()*.75:.5+Math.random()*1.5;s[r]=n*u,s[r+1]=o*u*.86,s[r+2]=e*u}{const n=Math.random()*x,o=.82,e=2+Math.cos(3*n);h[r]=(e*Math.cos(2*n)+p()*.16)*o,h[r+1]=(e*Math.sin(2*n)+p()*.16)*o,h[r+2]=(Math.sin(3*n)*1.4+p()*.16)*o}if(Math.random()<.14){const o=Math.random()*x,e=1.9+Math.random()*.8;a[r]=Math.cos(o)*e,a[r+1]=(Math.random()*2-1)*2.9,a[r+2]=Math.sin(o)*e}else{const o=i%2,e=Math.random(),d=(e*2-1)*2.7,f=e*x*2.6+o*Math.PI,u=1.22+p()*.06;a[r]=Math.cos(f)*u,a[r+1]=d,a[r+2]=Math.sin(f)*u}{const n=Math.random()*x,o=2.55+p()*.2,e=Math.cos(n)*o;let d=p()*.09,f=Math.sin(n)*o;const u=.42,z=d*Math.cos(u)-f*Math.sin(u),A=d*Math.sin(u)+f*Math.cos(u);l[r]=e,l[r+1]=z,l[r+2]=A}}return{nebula:s,knot:h,helix:a,halo:l,seeds:c}}const F=`
  uniform float uTime;
  uniform float uMorph;      // 0 nebula → 1 knot → 2 helix → 3 halo
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3 aKnot;
  attribute vec3 aHelix;
  attribute vec3 aHalo;
  attribute float aSeed;

  varying float vSeed;
  varying float vDepth;

  void main() {
    // Piecewise morph between the four story shapes, eased per segment.
    float m1 = smoothstep(0.0, 1.0, clamp(uMorph, 0.0, 1.0));
    float m2 = smoothstep(0.0, 1.0, clamp(uMorph - 1.0, 0.0, 1.0));
    float m3 = smoothstep(0.0, 1.0, clamp(uMorph - 2.0, 0.0, 1.0));
    vec3 p = mix(position, aKnot, m1);
    p = mix(p, aHelix, m2);
    p = mix(p, aHalo, m3);

    // Ambient drift — cheap trigonometric "breathing", no noise texture.
    float t = uTime * 0.45;
    float s = aSeed * 31.7;
    p.x += sin(t + s) * 0.055;
    p.y += cos(t * 1.31 + s * 1.7) * 0.055;
    p.z += sin(t * 0.83 + s * 2.3) * 0.055;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.55 + aSeed * 0.9);
    gl_PointSize = size * uPixelRatio * (34.0 / -mv.z);

    vSeed = aSeed;
    vDepth = clamp((-mv.z - 4.0) / 9.0, 0.0, 1.0);
  }
`,O=`
  uniform vec3 uColorA;   // bullion (deep gold)
  uniform vec3 uColorB;   // champagne (pale gold)
  uniform float uOpacity;

  varying float vSeed;
  varying float vDepth;

  void main() {
    // Soft round sprite from gl_PointCoord — no texture fetch.
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.06, d);
    vec3 col = mix(uColorA, uColorB, vSeed);
    col *= 1.0 - vDepth * 0.55; // recede into the ink
    gl_FragColor = vec4(col, alpha * uOpacity);
  }
`,R=`
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec3 p = position;
    // Subtle living-surface undulation
    p += normal * sin(uTime * 0.9 + position.y * 4.0 + position.x * 3.0) * 0.022;
    vec4 world = modelMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-(viewMatrix * world).xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,k=`
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    // Fresnel rim — a glass instrument catching light at its edges.
    float f = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.6);
    gl_FragColor = vec4(uColor * (0.25 + f * 1.6), f * uOpacity);
  }
`;function B({count:t=1e4}){const s=b(c=>c.gl),h=v.useMemo(()=>{const{nebula:c,knot:i,helix:r,halo:n,seeds:o}=T(t),e=new C;return e.setAttribute("position",new M(c,3)),e.setAttribute("aKnot",new M(i,3)),e.setAttribute("aHelix",new M(r,3)),e.setAttribute("aHalo",new M(n,3)),e.setAttribute("aSeed",new M(o,1)),e},[t]),a=v.useMemo(()=>({uTime:{value:0},uMorph:{value:0},uSize:{value:1},uOpacity:{value:0},uPixelRatio:{value:s.getPixelRatio()},uColorA:{value:new y("#a97f3f")},uColorB:{value:new y("#f0dcac")}}),[s]),l=v.useRef();return w((c,i)=>{a.uTime.value=c.clock.elapsedTime,a.uMorph.value+=(g.morph-a.uMorph.value)*Math.min(1,i*4),a.uOpacity.value<1&&(a.uOpacity.value=Math.min(1,a.uOpacity.value+i*.55))}),m.jsx("points",{geometry:h,frustumCulled:!1,children:m.jsx("shaderMaterial",{ref:l,vertexShader:F,fragmentShader:O,uniforms:a,transparent:!0,depthWrite:!1,blending:S})})}function V(){const t=v.useRef(),s=v.useMemo(()=>({uTime:{value:0},uOpacity:{value:0},uColor:{value:new y("#e8cf9e")}}),[]);return w((h,a)=>{const l=h.clock.elapsedTime;if(s.uTime.value=l,s.uOpacity.value+=(g.coreOpacity*.85-s.uOpacity.value)*Math.min(1,a*3),t.current){t.current.rotation.y=l*.12,t.current.rotation.z=l*.05;const c=1+Math.sin(l*.7)*.03;t.current.scale.setScalar(c)}}),m.jsxs("mesh",{ref:t,children:[m.jsx("icosahedronGeometry",{args:[1.02,5]}),m.jsx("shaderMaterial",{vertexShader:R,fragmentShader:k,uniforms:s,transparent:!0,depthWrite:!1,blending:S})]})}function D(){const t=typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches;return m.jsx("div",{className:"webgl","aria-hidden":"true",children:m.jsx(j,{dpr:[1,t?1.5:1.6],camera:{fov:42,near:.1,far:40,position:[0,0,9]},gl:{antialias:!1,alpha:!0,powerPreference:"high-performance",stencil:!1},children:m.jsxs(P,{children:[m.jsx(B,{count:t?4800:8200}),m.jsx(V,{})]})})})}export{D as default};
