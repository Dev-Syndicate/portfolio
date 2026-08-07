"use client";

import { useEffect, useRef } from "react";

/**
 * The site's living ground: a slow, liquid monochrome gradient that flows
 * behind the whole page so nothing ever reads as static.
 *
 * It's a single WebGL fragment shader on one full-screen quad — the cheapest
 * way to get premium continuous motion (Stripe/Linear-class): domain-warped
 * simplex noise (FBM) driven by time, mapped to a black→silver luminance ramp,
 * with grain mixed in to kill banding. One GPU draw call per frame, off the
 * main thread, so it's smooth and doesn't lag the page.
 *
 * Safety rails for smoothness:
 *   - device-pixel-ratio capped at 1.5 (4K phones don't quadruple fill cost)
 *   - the loop pauses when the tab is hidden (Page Visibility)
 *   - `prefers-reduced-motion` renders a single static frame, no loop
 *   - a graceful CSS gradient fallback if WebGL is unavailable
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

// Monochrome flowing gradient. simplex noise → FBM → domain warp → luminance.
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;   // 0..1, smoothed cursor position (y flipped to GL)

// --- Ashima simplex noise (2D) ---
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

// Fractal Brownian motion — layered octaves for organic structure.
float fbm(vec2 p){
  float f=0.0, amp=0.5;
  for(int i=0;i<5;i++){
    f+=amp*snoise(p);
    p*=2.02;
    amp*=0.5;
  }
  return f;
}

// Cheap hash grain to break up gradient banding.
float grain(vec2 uv){
  return fract(sin(dot(uv,vec2(12.9898,78.233)))*43758.5453);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  // preserve aspect so the flow isn't stretched on wide screens
  vec2 p = uv;
  p.x *= aspect;

  float t = u_time * 0.035;   // slower → calmer

  // Cursor in the same aspect-corrected space.
  vec2 m = u_mouse;
  m.x *= aspect;

  // The flow bends gently toward the cursor: bias the warp field by the
  // direction to the mouse, falling off with distance. Feels like the surface
  // is being stirred where you point, without chasing the cursor.
  vec2 toM = m - p;
  float mDist = length(toM);
  vec2 bend = toM * 0.12 * smoothstep(1.1, 0.0, mDist);

  // Larger, softer domain warp (lower frequencies = bigger, calmer swirls).
  vec2 q = vec2(fbm(p * 0.55 + vec2(0.0, t) + bend),
                fbm(p * 0.55 + vec2(5.2, -t) + bend));
  vec2 r = vec2(fbm(p * 0.7 + 1.4 * q + vec2(1.7, 9.2) + t * 0.5),
                fbm(p * 0.7 + 1.4 * q + vec2(8.3, 2.8) - t * 0.5));

  float n = fbm(p * 0.7 + 1.2 * r);
  n = n * 0.5 + 0.5;                 // -> 0..1

  // Very tight, low-contrast ramp — the flow is felt, not stared at.
  float lum = mix(0.025, 0.06, smoothstep(0.3, 0.8, n));

  // Content-safe fade: the liquid is strongest at the top and edges and
  // dissolves toward the centre-left where the hero copy lives, so text stays
  // crisp on near-black. A radial mask keyed to the reading zone.
  float edge = smoothstep(0.2, 0.75, distance(uv, vec2(0.38, 0.55)));
  lum *= mix(0.35, 1.0, edge);

  // The cursor gently lifts the liquid it's over — a whisper of extra light
  // that follows the flow, not a bright disc. Wide, soft falloff, very low
  // intensity, and modulated by the noise so it reveals the swirls rather than
  // painting a flat spot on top of them.
  float pool = smoothstep(1.0, 0.15, mDist) * 0.012 * (0.5 + 0.5 * n);
  lum += pool;

  vec3 col = vec3(lum);
  col += (grain(uv + fract(u_time)) - 0.5) * 0.012;   // dither

  gl_FragColor = vec4(col, 1.0);
}
`;

export function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cv = canvas;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const glCtx =
      canvas.getContext("webgl", { antialias: false, alpha: false }) ||
      (canvas.getContext(
        "experimental-webgl",
      ) as WebGLRenderingContext | null);
    if (!glCtx) return; // CSS fallback (see the sibling div) stays visible
    const gl = glCtx;

    function compile(type: number, src: string) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // Full-screen triangle-strip quad.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    // Target vs. smoothed cursor (0..1, GL y-up). Start centred so there's no
    // jump before the first move; only mouse pointers drive it.
    const target = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };
    function onPointer(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
    }
    window.addEventListener("pointermove", onPointer, { passive: true });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
    }
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let running = true;
    // A fixed epoch so we never call Date.now(); performance.now() is fine and
    // monotonic. Slow global clock keeps the motion calm.
    const start =
      typeof performance !== "undefined" ? performance.now() : 0;

    function frame(now: number) {
      // Ease the smoothed cursor toward the target so the flow-bend glides.
      smooth.x += (target.x - smooth.x) * 0.05;
      smooth.y += (target.y - smooth.y) * 0.05;
      gl.uniform2f(uMouse, smooth.x, smooth.y);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (running) raf = requestAnimationFrame(frame);
    }

    if (reduce) {
      // One static frame — composed, lit, but not moving.
      gl.uniform2f(uMouse, 0.5, 0.5);
      gl.uniform1f(uTime, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else {
      raf = requestAnimationFrame(frame);
    }

    // Pause when the tab is hidden so we never burn cycles off-screen.
    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* CSS fallback ground — visible if WebGL fails or before first paint. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 62% -10%, var(--glow-b), transparent 60%), var(--background)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Grain over the shader to further kill banding on 8-bit displays. */}
      <div className="bg-noise absolute inset-0 opacity-15" />
    </div>
  );
}
