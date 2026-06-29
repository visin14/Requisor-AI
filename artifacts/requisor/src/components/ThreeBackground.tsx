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
      <directionalLight position={[10, 10, 5]} intensity={2} color="#8b5cf6" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#3b82f6" />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={torusRef} position={[5, 0, -10]} scale={2}>
          <torusKnotGeometry args={[2, 0.6, 128, 32]} />
          <meshPhysicalMaterial color="#000000" emissive="#4c1d95" emissiveIntensity={0.5}
            roughness={0.1} metalness={0.9} transparent opacity={0.8} wireframe />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-8, 5, -15]} scale={1.5}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#3b82f6" wireframe transparent opacity={0.3} />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1}>
        <mesh position={[8, -5, -20]} scale={2}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#8b5cf6" wireframe transparent opacity={0.2} />
        </mesh>
      </Float>
      <Points ref={particlesRef} positions={positions} stride={3}>
        <PointMaterial transparent color="#a78bfa" size={0.1} sizeAttenuation
          depthWrite={false} blending={THREE.AdditiveBlending} />
      </Points>
      <Grid position={[0, -10, 0]} args={[100, 100]} cellSize={1} cellThickness={1}
        cellColor="#3b82f6" sectionSize={5} sectionThickness={1.5} sectionColor="#4c1d95"
        fadeDistance={50} fadeStrength={1} />
    </group>
  );
}

/* ─── CSS Fallback ───────────────────────────────────────────────────────── */

const PARTICLES = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  left: `${(i * 137.508) % 100}%`,
  top: `${(i * 97.3) % 100}%`,
  size: ((i * 31) % 3) + 1,
  color: i % 3 === 0 ? "#a78bfa" : i % 3 === 1 ? "#60a5fa" : "#c4b5fd",
  duration: 3 + ((i * 17) % 5),
  delay: (i * 0.23) % 4,
}));

function CssFallbackBackground() {
  return (
    <div style={{ position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at 20% 50%,#1e0b3e 0%,#050510 60%,#000308 100%)",
      overflow: "hidden" }}>
      <style>{`
        @keyframes rqFloatA{0%,100%{transform:translateY(0) rotate(0deg);opacity:.18}50%{transform:translateY(-40px) rotate(180deg);opacity:.32}}
        @keyframes rqFloatB{0%,100%{transform:translateY(0) rotate(0deg) scale(1);opacity:.12}50%{transform:translateY(30px) rotate(-120deg) scale(1.15);opacity:.22}}
        @keyframes rqFloatC{0%,100%{transform:translateY(0) rotate(45deg);opacity:.08}50%{transform:translateY(-25px) rotate(225deg);opacity:.18}}
        @keyframes rqDrift{0%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(20px,-15px) rotate(120deg)}66%{transform:translate(-10px,10px) rotate(240deg)}100%{transform:translate(0,0) rotate(360deg)}}
        @keyframes rqPulse{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.85;transform:scale(1.6)}}
        @keyframes rqGrid{0%,100%{opacity:.06}50%{opacity:.14}}
        @keyframes rqOrbit{from{transform:rotate(0deg) translateX(180px) rotate(0deg)}to{transform:rotate(360deg) translateX(180px) rotate(-360deg)}}
        @keyframes rqOrbitB{from{transform:rotate(0deg) translateX(260px) rotate(0deg)}to{transform:rotate(360deg) translateX(260px) rotate(-360deg)}}
      `}</style>

      {/* Concentric rings (torus knot stand-in) */}
      <div style={{ position:"absolute",right:"8%",top:"12%",width:540,height:540,display:"flex",alignItems:"center",justifyContent:"center" }}>
        {[540,420,300,180].map((s,i)=>(
          <div key={s} style={{ position:"absolute",width:s,height:s,borderRadius:"50%",
            border:`${i===0?2:1}px solid rgba(${i%2===0?"139,92,246":"59,130,246"},${0.35-i*0.07})`,
            boxShadow:i===0?"0 0 60px rgba(139,92,246,.15),inset 0 0 60px rgba(59,130,246,.08)":undefined,
            animation:`rqFloatA ${12+i*3}s ease-in-out infinite${i%2?"":" reverse"}` }} />
        ))}
        <div style={{ position:"absolute",width:8,height:8,borderRadius:"50%",background:"rgba(167,139,250,.7)",
          boxShadow:"0 0 10px rgba(167,139,250,.8)",animation:"rqOrbit 8s linear infinite" }}/>
        <div style={{ position:"absolute",width:6,height:6,borderRadius:"50%",background:"rgba(96,165,250,.6)",
          boxShadow:"0 0 8px rgba(96,165,250,.7)",animation:"rqOrbitB 14s linear infinite reverse" }}/>
      </div>

      {/* Rotating diamonds (icosahedron stand-ins) */}
      {[
        { l:"7%",  t:"28%", s:120, delay:"0s",   dur:"8s",  col:"rgba(59,130,246,.4)",  anim:"rqFloatB" },
        { l:"3%",  t:"62%", s:70,  delay:"2s",   dur:"11s", col:"rgba(139,92,246,.35)", anim:"rqFloatC" },
        { r:"4%",  b:"22%", s:160, delay:"1s",   dur:"14s", col:"rgba(139,92,246,.3)",  anim:"rqFloatB" },
        { l:"38%", t:"8%",  s:90,  delay:"0.5s", dur:"20s", col:"rgba(167,139,250,.25)",anim:"rqDrift"  },
        { l:"60%", b:"35%", s:55,  delay:"3s",   dur:"7s",  col:"rgba(59,130,246,.28)", anim:"rqFloatA" },
      ].map((p,i)=>(
        <div key={i} style={{ position:"absolute", left:(p as any).l, right:(p as any).r,
          top:(p as any).t, bottom:(p as any).b, width:p.s, height:p.s,
          border:`1.5px solid ${p.col}`, transform:"rotate(45deg)",
          boxShadow:i<2?`0 0 30px ${p.col}`:undefined,
          animation:`${p.anim} ${p.dur} ease-in-out infinite`, animationDelay:p.delay }} />
      ))}

      {/* Particle field */}
      {PARTICLES.map(p=>(
        <div key={p.id} style={{ position:"absolute",left:p.left,top:p.top,
          width:p.size,height:p.size,borderRadius:"50%",background:p.color,
          animation:`rqPulse ${p.duration}s ease-in-out infinite`,animationDelay:`${p.delay}s` }}/>
      ))}

      {/* Grid */}
      <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"40%",
        background:`repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(59,130,246,.07) 60px),
                    repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(59,130,246,.07) 60px)`,
        animation:"rqGrid 4s ease-in-out infinite",
        maskImage:"linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 100%)" }}/>

      {/* Depth gradients */}
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 80% 20%,rgba(76,29,149,.2) 0%,transparent 50%)" }}/>
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 10% 80%,rgba(29,78,216,.15) 0%,transparent 50%)" }}/>
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
