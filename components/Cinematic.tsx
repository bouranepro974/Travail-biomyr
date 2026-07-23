"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { HERO, AXES, ABOUT, FINAL, FRAME_COUNT } from "@/lib/content";

const framePath = (i: number) =>
  `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;

/* ---------- Overlay panel ---------- */
function Panel({
  progress,
  times,
  align = "center",
  yShift = 48,
  children,
}: {
  progress: MotionValue<number>;
  times: [number, number, number, number];
  align?: "center" | "left" | "right" | "bottom";
  yShift?: number;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, times, [0, 1, 1, 0]);
  const y = useTransform(progress, times, [yShift, 0, 0, -yShift]);
  return (
    <motion.div className={`panel panel--${align}`} style={{ opacity, y }}>
      <div className="panel__inner">{children}</div>
    </motion.div>
  );
}

export default function Cinematic() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const displayRef = useRef(0); // frame actuellement affichée
  const targetRef = useRef(0);  // frame visée par le scroll
  const rafRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

  // Progression 0..1 pilotée par le scroll
  const progress = useMotionValue(0);

  /* ---- Préchargement des frames ---- */
  useEffect(() => {
    let count = 0;
    let revealed = false;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = img.onerror = () => {
        count++;
        setLoaded(count);
        if (count >= 16 && !revealed) {
          revealed = true;
          setReady(true);
        }
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, []);

  /* ---- Dessin d'une frame (cover) ---- */
  const drawFrame = (frac: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imgs = imagesRef.current;
    const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(frac)));
    let img: HTMLImageElement | undefined = imgs[idx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      let found: HTMLImageElement | null = null;
      for (let d = 1; d < FRAME_COUNT; d++) {
        const lo = imgs[idx - d];
        const hi = imgs[idx + d];
        if (lo && lo.complete && lo.naturalWidth) { found = lo; break; }
        if (hi && hi.complete && hi.naturalWidth) { found = hi; break; }
      }
      if (!found) return;
      img = found;
    }
    const cw = canvas.width;
    const ch = canvas.height;
    const ir = img.naturalWidth / img.naturalHeight;
    // On cale TOUJOURS sur la hauteur : la pleine hauteur de l'image (donc le
    // sommet et les racines de l'arbre) est toujours visible. Desktop large =
    // fines marges latérales (dégradé de fond) ; mobile = plein écran, côtés rognés.
    const dh = ch;
    const dw = ch * ir;
    const dx = (cw - dw) / 2;
    const dy = 0;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  /* ---- Boucle de lissage (glide) — optionnelle, active si rAF dispo ---- */
  const smooth = () => {
    const cur = displayRef.current;
    const tgt = targetRef.current;
    const next = cur + (tgt - cur) * 0.18;
    const done = Math.abs(tgt - next) < 0.05;
    displayRef.current = done ? tgt : next;
    drawFrame(displayRef.current);
    rafRef.current = done ? 0 : requestAnimationFrame(smooth);
  };
  const requestSmooth = () => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(smooth);
  };

  /* ---- Dimensionnement du canvas ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      drawFrame(displayRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  /* ---- Suivi du scroll -> progression + frame + dot ---- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const update = () => {
      const total = stage.offsetHeight - window.innerHeight;
      const scrolled = -stage.getBoundingClientRect().top;
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      progress.set(p);
      targetRef.current = p * (FRAME_COUNT - 1);
      // Dessin direct (robuste, indépendant de rAF) + lissage si disponible
      drawFrame(targetRef.current);
      displayRef.current = targetRef.current;
      requestSmooth();
      const dot = Math.min(6, Math.floor(p * 7));
      setActiveDot((prev) => (prev === dot ? prev : dot));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("visibilitychange", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, ready]);

  const hintOpacity = useTransform(progress, [0, 0.05], [1, 0]);

  return (
    <>
      {/* Loader */}
      <div
        className="loader"
        style={{
          opacity: ready ? 0 : 1,
          pointerEvents: ready ? "none" : "auto",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="loader__logo" src="/logos/biomyr.svg" alt="BIOMYR" />
        <div className="loader__bar">
          <div
            className="loader__fill"
            style={{ width: `${Math.round((loaded / FRAME_COUNT) * 100)}%` }}
          />
        </div>
        <div className="loader__pct">
          Préparation de l’expérience — {Math.round((loaded / FRAME_COUNT) * 100)}%
        </div>
      </div>

      {/* Progress rail */}
      <div className="rail" aria-hidden>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`rail__dot ${i === activeDot ? "rail__dot--on" : ""}`}
          />
        ))}
      </div>

      {/* Cinematic stage */}
      <div ref={stageRef} className="stage" style={{ height: "760vh" }}>
        <div className="stage__sticky">
          <canvas ref={canvasRef} className="stage__canvas" />
          <div className="stage__grade" />

          {/* Hero */}
          <Panel progress={progress} times={[-0.01, 0, 0.08, 0.13]} align="center">
            <div className="kicker">Biotechnologie agricole</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-logo" src="/logos/biomyr.svg" alt="BIOMYR" />
            <div className="tagline">{HERO.tagline}</div>
            <p className="body-text">{HERO.subtitle}</p>
            <div className="btn-row">
              <button
                className="btn btn--primary"
                onClick={() =>
                  window.scrollTo({ top: window.innerHeight * 1.7, behavior: "smooth" })
                }
              >
                {HERO.ctaPrimary}
              </button>
              <button
                className="btn btn--ghost"
                onClick={() =>
                  window.scrollTo({ top: window.innerHeight * 1.7, behavior: "smooth" })
                }
              >
                {HERO.ctaSecondary}
              </button>
            </div>
          </Panel>

          {/* Axis 01 — VÉYÈR */}
          <Panel progress={progress} times={[0.15, 0.2, 0.28, 0.33]} align="left">
            <div className="index-num">{AXES[0].index}</div>
            <div className="kicker">{AXES[0].kicker}</div>
            <div className="veyer-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="veyer-logo" src="/logos/veyer.svg" alt="VÉYÈR" />
            </div>
            <div className="brandline">{AXES[0].brand}</div>
            <p className="body-text">{AXES[0].text}</p>
          </Panel>

          {/* Axis 02 — Agronomie digitale */}
          <Panel progress={progress} times={[0.34, 0.39, 0.46, 0.51]} align="right">
            <div className="index-num">{AXES[1].index}</div>
            <div className="kicker">{AXES[1].kicker}</div>
            <h2 className="h-title">{AXES[1].title}</h2>
            <div className="brandline">{AXES[1].brand}</div>
            <p className="body-text">{AXES[1].text}</p>
          </Panel>

          {/* Axis 03 — Ingénierie & études */}
          <Panel progress={progress} times={[0.52, 0.56, 0.62, 0.67]} align="left">
            <div className="index-num">{AXES[2].index}</div>
            <div className="kicker">{AXES[2].kicker}</div>
            <h2 className="h-title">{AXES[2].title}</h2>
            <div className="brandline">{AXES[2].brand}</div>
            <p className="body-text">{AXES[2].text}</p>
          </Panel>

          {/* Axis 04 — BIOMYR Académie */}
          <Panel progress={progress} times={[0.68, 0.72, 0.78, 0.83]} align="right">
            <div className="index-num">{AXES[3].index}</div>
            <div className="kicker">{AXES[3].kicker}</div>
            <h2 className="h-title">{AXES[3].title}</h2>
            <div className="brandline">{AXES[3].brand}</div>
            <p className="body-text">{AXES[3].text}</p>
          </Panel>

          {/* Qui sommes-nous — racines */}
          <Panel progress={progress} times={[0.84, 0.88, 0.92, 0.955]} align="center">
            <div className="kicker kicker--alt">{ABOUT.kicker}</div>
            <h2 className="h-title">{ABOUT.title}</h2>
            <p className="body-text">{ABOUT.text}</p>
          </Panel>

          {/* CTA final — révélation */}
          <Panel progress={progress} times={[0.95, 0.98, 1.2, 1.3]} align="center">
            <div className="kicker kicker--alt">{FINAL.kicker}</div>
            <h2 className="h-title">{FINAL.title}</h2>
            <p className="body-text">{FINAL.text}</p>
            <div className="btn-row">
              <a className="btn btn--primary" href="#contact">{FINAL.ctaPrimary}</a>
              <a className="btn btn--ghost" href="#contact">{FINAL.ctaSecondary}</a>
            </div>
          </Panel>

          {/* Scroll hint (hero only) */}
          <motion.div className="scroll-hint" style={{ opacity: hintOpacity }}>
            <span>Défiler</span>
            <div className="scroll-hint__line" />
          </motion.div>
        </div>
      </div>
    </>
  );
}
