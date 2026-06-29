import { useRef, useMemo, useState, useEffect, Component, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Grid } from "@react-three/drei";
import * as THREE from "three";

/* ─── Scene ─────────────────────────────────────────────────────────────── */

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const targetX = (state.mouse.x * Math.PI) / 10;
    const targetY = (state.mouse.y * Math.PI) / 10;
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.02 * (targetX - groupRef.current.rotation.y);
      groupRef.current.rotation.x += 0.02 * (targetY - groupRef.current.rotation.x);
    }
    const scrollY = window.scrollY;
    if (torusRef.current) {
      torusRef.current.rotation.x += 0.001;
      torusRef.current.rotation.y += 0.002;
      torusRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5 - scrollY * 0.002;
    }
    if (particlesRef.current) {
      particlesRef.current.position.y = scrollY * 0.005;
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#34d399" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#10b981" />
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

// Floating dinos: position, size, animation duration, delay, opacity, rotate direction
const DINOS = [
  { left:"82%", top:"18%",  size:90,  dur:"9s",  delay:"0s",   opacity:0.18, spin:1  },
  { left:"5%",  top:"55%",  size:70,  dur:"12s", delay:"2s",   opacity:0.14, spin:-1 },
  { left:"48%", top:"78%",  size:55,  dur:"8s",  delay:"1s",   opacity:0.12, spin:1  },
  { left:"70%", top:"60%",  size:44,  dur:"14s", delay:"3.5s", opacity:0.10, spin:-1 },
  { left:"22%", top:"12%",  size:62,  dur:"11s", delay:"0.8s", opacity:0.13, spin:1  },
  { left:"91%", top:"72%",  size:80,  dur:"10s", delay:"4s",   opacity:0.15, spin:-1 },
  { left:"35%", top:"44%",  size:38,  dur:"7s",  delay:"2.5s", opacity:0.09, spin:1  },
];

function CssFallbackBackground() {
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

      {/* ── Large concentric ring system (top-right) ── */}
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

      {/* ── Second ring cluster (bottom-left) ── */}
      <div style={{ position:"absolute",left:"-5%",bottom:"10%",width:380,height:380,display:"flex",alignItems:"center",justifyContent:"center" }}>
        {[380,280,180].map((s,i)=>(
          <div key={s} style={{ position:"absolute",width:s,height:s,borderRadius:"50%",
            border:`1px solid rgba(52,211,153,${0.18-i*0.04})`,
            animation:`rqFloatB ${10+i*4}s ease-in-out infinite${i%2?"":" reverse"}` }} />
        ))}
      </div>

      {/* ── Rotating diamonds ── */}
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

      {/* ── Hexagons ── */}
      {[
        { l:"15%", t:"40%", s:100, delay:"0s",  dur:"16s" },
        { r:"12%", t:"50%", s:65,  delay:"3s",  dur:"12s" },
        { l:"55%", b:"20%", s:80,  delay:"1.5s",dur:"18s" },
      ].map((h,i)=>(
        <div key={i} style={{ position:"absolute", left:(h as any).l, right:(h as any).r,
          top:(h as any).t, bottom:(h as any).b, width:h.s, height:h.s,
          background:"transparent",
          outline:`1.5px solid rgba(16,185,129,0.2)`,
          clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
          animation:`rqHex ${h.dur} ease-in-out infinite`, animationDelay:h.delay }} />
      ))}

      {/* ── Blob shapes ── */}
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

      {/* ── Floating Dino images ── */}
      {DINOS.map((d,i)=>(
        <div key={i} style={{ position:"absolute", left:d.left, top:d.top,
          width:d.size, height:d.size,
          opacity:d.opacity,
          animation:`${i%2===0?"rqDinoFloat":"rqDinoFloatB"} ${d.dur} ease-in-out infinite`,
          animationDelay:d.delay,
          filter:"drop-shadow(0 4px 12px rgba(16,185,129,0.25))",
          pointerEvents:"none" }}>
          <img src="/dino-logo.jpeg" alt="" style={{ width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%",
            border:"1.5px solid rgba(52,211,153,0.3)" }} />
        </div>
      ))}

      {/* ── Particle field (more dots) ── */}
      {PARTICLES.map(p=>(
        <div key={p.id} style={{ position:"absolute",left:p.left,top:p.top,
          width:p.size,height:p.size,borderRadius:"50%",background:p.color,
          animation:`rqPulse ${p.duration}s ease-in-out infinite`,animationDelay:`${p.delay}s` }}/>
      ))}

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

      {/* ── Grid plane (bottom) ── */}
      <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"45%",
        background:`repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(16,185,129,.06) 60px),
                    repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(16,185,129,.06) 60px)`,
        animation:"rqGrid 4s ease-in-out infinite",
        maskImage:"linear-gradient(to top,rgba(0,0,0,.4) 0%,transparent 100%)" }}/>

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
