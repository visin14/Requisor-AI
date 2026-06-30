import { useRef, useMemo, useState, useEffect, Suspense, Component, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Grid, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

/* ─── Scroll tracker (shared across components) ─────────────────────────── */

function useScrollY() {
  const scrollY = useRef(0);
  useEffect(() => {
    const el = document.getElementById("scroll-root") ?? window;
    const onScroll = () => {
      scrollY.current = (el as Window).scrollY ?? (el as Element).scrollTop ?? 0;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return scrollY;
}

/* ─── 3D Dino Model — scroll-scrubbed animation ─────────────────────────── */

interface DinoProps {
  position: [number, number, number];
  scale?: number;
  /** Fraction of total scroll used per full animation loop (1 = one loop over full page) */
  scrollLoops?: number;
  /** Y offset multiplier as scroll progresses (parallax drift) */
  driftY?: number;
  /** X travel distance: dino walks this many units across screen while scrolling */
  travelX?: number;
  baseRotY?: number;
}

function DinoModel({ position, scale = 1, scrollLoops = 3, driftY = -0.004, travelX = 0, baseRotY = 0 }: DinoProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/dino-motion.glb");
  const { mixer, actions } = useAnimations(animations, group);
  const scrollY = useScrollY();
  const baseY = position[1];
  const baseX = position[0];

  // Clone so instances don't share materials
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Apply subtle green emissive tint
  useEffect(() => {
    clonedScene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const sm = m as THREE.MeshStandardMaterial;
        if (sm.emissive) { sm.emissive.set("#10b981"); sm.emissiveIntensity = 0.12; }
      });
    });
  }, [clonedScene]);

  // Play the clip but immediately pause it — we'll scrub manually
  useEffect(() => {
    const key = Object.keys(actions)[0];
    if (key && actions[key]) {
      actions[key]!.play();
      actions[key]!.paused = true;
    }
  }, [actions]);

  useFrame(() => {
    if (!group.current) return;

    const sy = scrollY.current;
    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    // Normalised scroll 0→1
    const t = sy / maxScroll;

    // ── Scrub animation: advance through the clip in proportion to scroll ──
    const duration = animations[0]?.duration ?? 1;
    // scrollLoops controls how many full animation cycles happen across the page
    mixer.setTime(((t * scrollLoops) % 1) * duration);

    // ── Parallax: drift upward and travel laterally as page scrolls ──
    group.current.position.y = baseY + sy * driftY;
    group.current.position.x = baseX + t * travelX;

    // ── Gentle body tilt tied to travel direction ──
    const leanDir = travelX >= 0 ? 1 : -1;
    group.current.rotation.y = baseRotY + leanDir * t * 0.6;
    group.current.rotation.z = Math.sin(t * Math.PI * scrollLoops * 2) * 0.04;
  });

  return (
    <group ref={group} position={position} scale={scale} rotation={[0, baseRotY, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload for faster first render
useGLTF.preload("/dino-motion.glb");

/* ─── Scene ─────────────────────────────────────────────────────────────── */

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const scrollY = useScrollY();

  useFrame((state) => {
    const targetX = (state.mouse.x * Math.PI) / 10;
    const targetY = (state.mouse.y * Math.PI) / 10;
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.02 * (targetX - groupRef.current.rotation.y);
      groupRef.current.rotation.x += 0.02 * (targetY - groupRef.current.rotation.x);
    }
    const sy = scrollY.current;
    if (torusRef.current) {
      torusRef.current.rotation.x += 0.001;
      torusRef.current.rotation.y += 0.002;
      torusRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5 - sy * 0.002;
    }
    if (particlesRef.current) {
      particlesRef.current.position.y = sy * 0.005;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const positions = useMemo(() => {
    const count = 2000;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return arr;
  }, []);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#34d399" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#10b981" />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#6ee7b7" />

      {/* ── Dino models — scroll-scrubbed, each walks across the scene ── */}
      <Suspense fallback={null}>
        {/* Large dino near-right: walks left→right, 3 animation loops across page */}
        <DinoModel position={[3, 0, -6]}  scale={2.0} scrollLoops={3} driftY={-0.003} travelX={8}  baseRotY={-0.3} />
        {/* Mid dino left: walks right→left, offset loops */}
        <DinoModel position={[-5, -1, -12]} scale={1.4} scrollLoops={2} driftY={-0.005} travelX={-6} baseRotY={0.6} />
        {/* Small far dino: slow drift */}
        <DinoModel position={[0, 3, -20]}  scale={0.9} scrollLoops={4} driftY={-0.008} travelX={5}  baseRotY={Math.PI} />
      </Suspense>

      {/* ── Geometric shapes ── */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={torusRef} position={[5, 0, -10]} scale={2}>
          <torusKnotGeometry args={[2, 0.6, 128, 32]} />
          <meshPhysicalMaterial color="#000000" emissive="#065f46" emissiveIntensity={0.5}
            roughness={0.1} metalness={0.9} transparent opacity={0.8} wireframe />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-8, 5, -15]} scale={1.5}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#34d399" wireframe transparent opacity={0.3} />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1}>
        <mesh position={[8, -5, -20]} scale={2}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.2} />
        </mesh>
      </Float>

      {/* ── Particles ── */}
      <Points ref={particlesRef} positions={positions} stride={3}>
        <PointMaterial transparent color="#6ee7b7" size={0.1} sizeAttenuation
          depthWrite={false} blending={THREE.AdditiveBlending} />
      </Points>
      <Grid position={[0, -10, 0]} args={[100, 100]} cellSize={1} cellThickness={1}
        cellColor="#10b981" sectionSize={5} sectionThickness={1.5} sectionColor="#065f46"
        fadeDistance={50} fadeStrength={1} />
    </group>
  );
}

/* ─── CSS Fallback ───────────────────────────────────────────────────────── */

const PARTICLES = Array.from({ length: 110 }, (_, i) => ({
  id: i,
  left: `${(i * 137.508) % 100}%`,
  top: `${(i * 97.3) % 100}%`,
  size: ((i * 31) % 4) + 1,
  color: i % 4 === 0 ? "#6ee7b7" : i % 4 === 1 ? "#34d399" : i % 4 === 2 ? "#a7f3d0" : "#10b981",
  duration: 3 + ((i * 17) % 6),
  delay: (i * 0.19) % 5,
}));

// Each dino: starting position, size, travel direction & distance, parallax Y speed, opacity
const DINOS = [
  { startLeft:75, startTop:18, size:90,  travelX: 18,  travelY:-22, opacity:0.18, scaleOnScroll: 1.12 },
  { startLeft: 5, startTop:55, size:70,  travelX:-16,  travelY:-18, opacity:0.14, scaleOnScroll: 0.88 },
  { startLeft:48, startTop:78, size:55,  travelX: 22,  travelY:-30, opacity:0.12, scaleOnScroll: 1.08 },
  { startLeft:68, startTop:60, size:44,  travelX:-12,  travelY:-15, opacity:0.10, scaleOnScroll: 0.92 },
  { startLeft:18, startTop:12, size:62,  travelX: 14,  travelY:-10, opacity:0.13, scaleOnScroll: 1.06 },
  { startLeft:85, startTop:72, size:80,  travelX:-20,  travelY:-25, opacity:0.15, scaleOnScroll: 0.90 },
  { startLeft:32, startTop:44, size:38,  travelX: 10,  travelY:-12, opacity:0.09, scaleOnScroll: 1.04 },
];

function CssFallbackBackground() {
  const ringsRef    = useRef<HTMLDivElement>(null);
  const rings2Ref   = useRef<HTMLDivElement>(null);
  const geoLayerRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  // Individual refs for each dino so they can move independently
  const dinoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let rafId = 0;
    let lastScroll = -1;
    const onScroll = () => {
      const sy = window.scrollY;
      if (sy === lastScroll) return;
      lastScroll = sy;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const t = sy / maxScroll; // 0→1 across the page

        // Layer parallax (background layers)
        if (ringsRef.current)     ringsRef.current.style.transform     = `translateY(${sy * -0.18}px) scale(${1 + sy * 0.00008})`;
        if (rings2Ref.current)    rings2Ref.current.style.transform    = `translateY(${sy * 0.10}px)`;
        if (geoLayerRef.current)  geoLayerRef.current.style.transform  = `translateY(${sy * -0.12}px) rotate(${sy * 0.01}deg)`;
        if (particleRef.current)  particleRef.current.style.transform  = `translateY(${sy * 0.08}px)`;
        if (gridRef.current)      gridRef.current.style.transform      = `translateY(${sy * -0.06}px)`;

        // Each dino walks independently: translate X (walk) + Y (drift up), scale slightly
        DINOS.forEach((d, i) => {
          const el = dinoRefs.current[i];
          if (!el) return;
          const tx = t * d.travelX * 10;   // walk left or right
          const ty = t * d.travelY * 10;   // drift upward at own speed
          const sc = 1 + (d.scaleOnScroll - 1) * t; // grow or shrink
          // Also add a tiny walk-bounce: bob up/down to simulate footsteps
          const bounce = Math.sin(t * Math.PI * 8) * 4 * Math.abs(d.travelX / 18);
          el.style.transform = `translate(${tx}px, ${ty + bounce}px) scale(${sc})`;
        });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <div style={{ position:"absolute", inset:0,
      background:"radial-gradient(ellipse at 30% 40%,#ecfdf5 0%,#f0fdf4 40%,#ffffff 100%)",
      overflow:"hidden" }}>
      <style>{`
        @keyframes rqFloatA{0%,100%{transform:translateY(0) rotate(0deg);opacity:.18}50%{transform:translateY(-40px) rotate(180deg);opacity:.32}}
        @keyframes rqFloatB{0%,100%{transform:translateY(0) rotate(0deg) scale(1);opacity:.12}50%{transform:translateY(30px) rotate(-120deg) scale(1.15);opacity:.22}}
        @keyframes rqFloatC{0%,100%{transform:translateY(0) rotate(45deg);opacity:.08}50%{transform:translateY(-25px) rotate(225deg);opacity:.18}}
        @keyframes rqDrift{0%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(20px,-15px) rotate(120deg)}66%{transform:translate(-10px,10px) rotate(240deg)}100%{transform:translate(0,0) rotate(360deg)}}
        @keyframes rqPulse{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.85;transform:scale(1.6)}}
        @keyframes rqGrid{0%,100%{opacity:.06}50%{opacity:.14}}
        @keyframes rqOrbit{from{transform:rotate(0deg) translateX(180px) rotate(0deg)}to{transform:rotate(360deg) translateX(180px) rotate(-360deg)}}
        @keyframes rqOrbitB{from{transform:rotate(0deg) translateX(260px) rotate(0deg)}to{transform:rotate(360deg) translateX(260px) rotate(-360deg)}}
        @keyframes rqDinoFloat{0%,100%{transform:translateY(0px) rotate(-6deg) scale(1)}25%{transform:translateY(-18px) rotate(4deg) scale(1.04)}75%{transform:translateY(8px) rotate(-3deg) scale(0.97)}}
        @keyframes rqDinoFloatB{0%,100%{transform:translateY(0px) rotate(5deg) scale(1)}30%{transform:translateY(14px) rotate(-6deg) scale(1.05)}70%{transform:translateY(-12px) rotate(3deg) scale(0.96)}}
        @keyframes rqHex{0%,100%{transform:rotate(0deg);opacity:.13}50%{transform:rotate(60deg);opacity:.22}}
        @keyframes rqTriangle{0%,100%{transform:rotate(0deg) scale(1);opacity:.1}50%{transform:rotate(180deg) scale(1.1);opacity:.2}}
        @keyframes rqBlob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;opacity:.07}50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;opacity:.13}}
        @keyframes rqStar{0%,100%{transform:rotate(0deg) scale(1);opacity:.12}50%{transform:rotate(72deg) scale(1.15);opacity:.22}}
        @keyframes rqWobble{0%,100%{transform:translateX(0) translateY(0) rotate(0deg)}25%{transform:translateX(8px) translateY(-12px) rotate(5deg)}75%{transform:translateX(-6px) translateY(10px) rotate(-4deg)}}
      `}</style>

      {/* ── LAYER 1: Large concentric ring system (top-right) — slowest parallax ── */}
      <div ref={ringsRef} style={{ position:"absolute",inset:0,willChange:"transform" }}>
        <div style={{ position:"absolute",right:"6%",top:"8%",width:560,height:560,display:"flex",alignItems:"center",justifyContent:"center" }}>
          {[560,440,320,200,100].map((s,i)=>(
            <div key={s} style={{ position:"absolute",width:s,height:s,borderRadius:"50%",
              border:`${i===0?2:1}px solid rgba(${i%2===0?"52,211,153":"16,185,129"},${0.30-i*0.05})`,
              boxShadow:i===0?"0 0 60px rgba(52,211,153,.12),inset 0 0 60px rgba(16,185,129,.06)":undefined,
              animation:`rqFloatA ${12+i*3}s ease-in-out infinite${i%2?"":" reverse"}` }} />
          ))}
          <div style={{ position:"absolute",width:10,height:10,borderRadius:"50%",background:"rgba(110,231,183,.75)",
            boxShadow:"0 0 12px rgba(110,231,183,.9)",animation:"rqOrbit 8s linear infinite" }}/>
          <div style={{ position:"absolute",width:7,height:7,borderRadius:"50%",background:"rgba(52,211,153,.65)",
            boxShadow:"0 0 9px rgba(52,211,153,.8)",animation:"rqOrbitB 14s linear infinite reverse" }}/>
          <div style={{ position:"absolute",width:5,height:5,borderRadius:"50%",background:"rgba(16,185,129,.5)",
            animation:"rqOrbit 22s linear infinite reverse" }}/>
        </div>
      </div>

      {/* ── LAYER 2: Second ring cluster (counter-parallax, moves opposite) ── */}
      <div ref={rings2Ref} style={{ position:"absolute",inset:0,willChange:"transform" }}>
        <div style={{ position:"absolute",left:"-5%",bottom:"10%",width:380,height:380,display:"flex",alignItems:"center",justifyContent:"center" }}>
          {[380,280,180].map((s,i)=>(
            <div key={s} style={{ position:"absolute",width:s,height:s,borderRadius:"50%",
              border:`1px solid rgba(52,211,153,${0.18-i*0.04})`,
              animation:`rqFloatB ${10+i*4}s ease-in-out infinite${i%2?"":" reverse"}` }} />
          ))}
        </div>
      </div>

      {/* ── LAYER 3: Geometric shapes (diamonds + hexagons) ── */}
      <div ref={geoLayerRef} style={{ position:"absolute",inset:0,willChange:"transform" }}>
        {[
          { l:"7%",  t:"28%", s:120, delay:"0s",   dur:"8s",  col:"rgba(52,211,153,.35)", anim:"rqFloatB" },
          { l:"3%",  t:"62%", s:70,  delay:"2s",   dur:"11s", col:"rgba(16,185,129,.30)", anim:"rqFloatC" },
          { r:"4%",  b:"22%", s:160, delay:"1s",   dur:"14s", col:"rgba(52,211,153,.28)", anim:"rqFloatB" },
          { l:"38%", t:"6%",  s:90,  delay:"0.5s", dur:"20s", col:"rgba(110,231,183,.22)",anim:"rqDrift"  },
          { l:"60%", b:"35%", s:55,  delay:"3s",   dur:"7s",  col:"rgba(52,211,153,.24)", anim:"rqFloatA" },
          { l:"50%", t:"20%", s:40,  delay:"1.5s", dur:"9s",  col:"rgba(16,185,129,.20)", anim:"rqFloatC" },
          { r:"18%", b:"45%", s:75,  delay:"4s",   dur:"13s", col:"rgba(110,231,183,.18)",anim:"rqDrift"  },
        ].map((p,i)=>(
          <div key={i} style={{ position:"absolute", left:(p as any).l, right:(p as any).r,
            top:(p as any).t, bottom:(p as any).b, width:p.s, height:p.s,
            border:`1.5px solid ${p.col}`, transform:"rotate(45deg)",
            boxShadow:i<3?`0 0 25px ${p.col}`:undefined,
            animation:`${p.anim} ${p.dur} ease-in-out infinite`, animationDelay:p.delay }} />
        ))}
        {[
          { l:"15%", t:"40%", s:100, delay:"0s",  dur:"16s" },
          { r:"12%", t:"50%", s:65,  delay:"3s",  dur:"12s" },
          { l:"55%", b:"20%", s:80,  delay:"1.5s",dur:"18s" },
        ].map((h,i)=>(
          <div key={i} style={{ position:"absolute", left:(h as any).l, right:(h as any).r,
            top:(h as any).t, bottom:(h as any).b, width:h.s, height:h.s,
            background:"transparent", outline:`1.5px solid rgba(16,185,129,0.2)`,
            clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
            animation:`rqHex ${h.dur} ease-in-out infinite`, animationDelay:h.delay }} />
        ))}
        {[
          { l:"25%", t:"65%", w:180, h:160, delay:"0s",  dur:"12s", col:"rgba(52,211,153,.07)" },
          { r:"20%", t:"30%", w:220, h:200, delay:"4s",  dur:"15s", col:"rgba(16,185,129,.06)" },
          { l:"60%", t:"5%",  w:140, h:130, delay:"2s",  dur:"10s", col:"rgba(110,231,183,.08)"},
        ].map((b,i)=>(
          <div key={i} style={{ position:"absolute", left:(b as any).l, right:(b as any).r,
            top:b.t, width:b.w, height:b.h, background:b.col,
            borderRadius:"60% 40% 30% 70%/60% 30% 70% 40%",
            animation:`rqBlob ${b.dur} ease-in-out infinite`, animationDelay:b.delay }} />
        ))}
      </div>

      {/* ── LAYER 4: Dino images — each walks individually driven by scroll ── */}
      <div style={{ position:"absolute",inset:0,pointerEvents:"none" }}>
        {DINOS.map((d,i)=>(
          <div
            key={i}
            ref={el => { dinoRefs.current[i] = el; }}
            style={{
              position:"absolute",
              left:`${d.startLeft}%`,
              top:`${d.startTop}%`,
              width:d.size,
              height:d.size,
              opacity:d.opacity,
              willChange:"transform",
              filter:"drop-shadow(0 4px 16px rgba(16,185,129,0.30))",
              transition:"opacity 0.3s",
            }}>
            <img src="/dino-logo.jpeg" alt="" style={{
              width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%",
              border:"1.5px solid rgba(52,211,153,0.35)"
            }} />
          </div>
        ))}
      </div>

      {/* ── LAYER 5: Particle field ── */}
      <div ref={particleRef} style={{ position:"absolute",inset:0,willChange:"transform" }}>
        {PARTICLES.map(p=>(
          <div key={p.id} style={{ position:"absolute",left:p.left,top:p.top,
            width:p.size,height:p.size,borderRadius:"50%",background:p.color,
            animation:`rqPulse ${p.duration}s ease-in-out infinite`,animationDelay:`${p.delay}s` }}/>
        ))}
      </div>

      {/* ── Subtle connection lines (SVG) ── */}
      <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none" }} xmlns="http://www.w3.org/2000/svg">
        <line x1="10%" y1="30%" x2="40%" y2="10%" stroke="rgba(52,211,153,0.07)" strokeWidth="1" strokeDasharray="6 8"/>
        <line x1="60%" y1="80%" x2="90%" y2="55%" stroke="rgba(16,185,129,0.06)" strokeWidth="1" strokeDasharray="4 10"/>
        <line x1="5%"  y1="70%" x2="30%" y2="50%" stroke="rgba(110,231,183,0.07)" strokeWidth="1" strokeDasharray="5 9"/>
        <line x1="70%" y1="15%" x2="95%" y2="35%" stroke="rgba(52,211,153,0.06)" strokeWidth="1" strokeDasharray="6 8"/>
        <circle cx="40%" cy="10%" r="3" fill="rgba(52,211,153,0.15)"/>
        <circle cx="90%" cy="55%" r="3" fill="rgba(16,185,129,0.12)"/>
        <circle cx="30%" cy="50%" r="2" fill="rgba(110,231,183,0.15)"/>
      </svg>

      {/* ── LAYER 6: Grid plane (slowest, anchored) ── */}
      <div ref={gridRef} style={{ position:"absolute",bottom:0,left:0,right:0,height:"55%",willChange:"transform" }}>
        <div style={{ position:"absolute",inset:0,
          background:`repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(16,185,129,.06) 60px),
                      repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(16,185,129,.06) 60px)`,
          animation:"rqGrid 4s ease-in-out infinite",
          maskImage:"linear-gradient(to top,rgba(0,0,0,.4) 0%,transparent 100%)" }}/>
      </div>

      {/* ── Depth gradients ── */}
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 80% 20%,rgba(16,185,129,.08) 0%,transparent 50%)" }}/>
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 10% 80%,rgba(52,211,153,.06) 0%,transparent 50%)" }}/>
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(167,243,208,.05) 0%,transparent 60%)" }}/>
    </div>
  );
}

/* ─── Error boundary ─────────────────────────────────────────────────────── */

interface EBProps { children: ReactNode; onError: () => void }
interface EBState { hasError: boolean }
class WebGLErrorBoundary extends Component<EBProps, EBState> {
  constructor(props: EBProps) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.hasError ? null : this.props.children; }
}

/* ─── Main export ────────────────────────────────────────────────────────── */

export default function ThreeBackground() {
  const [useFallback, setUseFallback] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (useFallback) return;
    const container = canvasContainerRef.current;
    if (!container) return;

    // Listen for context lost on any canvas inside the container
    const handleContextLost = () => setUseFallback(true);
    const handleContextLostGlobal = (e: Event) => {
      const target = e.target as HTMLElement;
      if (container.contains(target)) setUseFallback(true);
    };

    window.addEventListener("webglcontextlost", handleContextLostGlobal, true);
    return () => {
      window.removeEventListener("webglcontextlost", handleContextLostGlobal, true);
      void handleContextLost; // suppress unused warning
    };
  }, [useFallback]);

  // Also check WebGL support upfront (a quick test)
  const webglSupported = useMemo(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      if (!gl) return false;
      (gl as WebGLRenderingContext).clearColor(0, 0, 0, 0);
      (gl as WebGLRenderingContext).clear((gl as WebGLRenderingContext).COLOR_BUFFER_BIT);
      return !(gl as WebGLRenderingContext).isContextLost();
    } catch { return false; }
  }, []);

  if (useFallback || !webglSupported) {
    return <CssFallbackBackground />;
  }

  return (
    <>
      {useFallback && <CssFallbackBackground />}
      <div ref={canvasContainerRef} style={{ position: "absolute", inset: 0 }}>
        <WebGLErrorBoundary onError={() => setUseFallback(true)}>
          <Canvas
            camera={{ position: [0, 0, 15], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: "default" }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", () => {
                setUseFallback(true);
              });
            }}
          >
            <fog attach="fog" args={["#050510", 10, 40]} />
            <Scene />
          </Canvas>
        </WebGLErrorBoundary>
      </div>
    </>
  );
}
