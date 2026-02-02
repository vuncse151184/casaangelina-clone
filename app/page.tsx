"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

export default function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef(0);
  const directionRef = useRef<"down" | "up">("down");

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showLook, setShowLook] = useState(false);
  const contentOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.3) * 2));

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // =========================
    // Scroll tracking for animations
    // =========================
    const handleScroll = () => {
      const scrollY = lenis.scroll;
      const heroTransitionHeight = window.innerHeight * 0.65;

      directionRef.current = scrollY > lastScrollRef.current ? "down" : "up";
      lastScrollRef.current = scrollY;

      const progress = Math.min(1, Math.max(0, scrollY / heroTransitionHeight));
      setScrollProgress(progress);

      setShowContent(progress > 0.2);
      setShowLook(progress > 0.35);
    };

    lenis.on("scroll", handleScroll);

    // =========================
    // SECTION SNAP (LIGHT SCROLL → NEXT SECTION END)
    // =========================
    const SNAP_THRESHOLD = 12; // càng nhỏ càng nhạy (chuột lăn nhẹ vẫn ăn)
    let isSnapping = false;

    const getContentEnd = () => {
      if (!contentRef.current) return window.innerHeight;
      return (
        contentRef.current.offsetTop +
        contentRef.current.offsetHeight -
        window.innerHeight
      );
    };

    // Snap points: 0 = hero top, contentEnd = end of content section
    const getSections = () => [0, getContentEnd()];

    const handleWheel = (e: WheelEvent) => {
      if (isSnapping) {
        e.preventDefault();
        return;
      }

      // bỏ qua noise cực nhỏ
      if (Math.abs(e.deltaY) < SNAP_THRESHOLD) return;

      e.preventDefault();

      const sections = getSections();
      const currentScroll = lenis.scroll;
      const direction = e.deltaY > 0 ? 1 : -1;

      // xác định đang ở section nào dựa vào scroll thật
      let currentIndex = 0;
      for (let i = 0; i < sections.length; i++) {
        if (currentScroll >= sections[i] - 10) currentIndex = i;
      }

      const nextIndex = Math.max(
        0,
        Math.min(sections.length - 1, currentIndex + direction)
      );

      if (nextIndex === currentIndex) return;

      isSnapping = true;

      lenis.scrollTo(sections[nextIndex], {
        duration: 2.2,
        easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart
        onComplete: () => {
          setTimeout(() => {
            isSnapping = false;
          }, 150);
        },
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      lenis.destroy();
    };
  }, []);

  /* =========================
     VIDEO MOTION (FIXED)
  ========================== */

  const heroElementsOpacity = Math.max(0, 1 - scrollProgress * 2);
  const ANCHOR_PROGRESS = 0.85;
  const p = Math.min(scrollProgress, ANCHOR_PROGRESS);
  const t = p / ANCHOR_PROGRESS;

  // target rectangle (matches your red box)
  const FINAL_X = 18; // vw → right
  const FINAL_Y = 22; // vh → down

  const x = t * (directionRef.current === "down" ? FINAL_X : -FINAL_X);
  const y = t * FINAL_Y;

  const heroOpacity = Math.max(0, 1 - scrollProgress * 2);

  return (
    <div ref={containerRef} className="relative bg-white">
      {/* ========== FIXED VIDEO LAYER (ONLY PART CHANGED) ========== */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div
          className="absolute inset-0 will-change-[clip-path,transform]"
          style={{
            clipPath: `inset(
              ${p * 35}% 
              ${p * 2}% 
              ${p * 55}% 
              ${p * 2}%
            )`,
            transform: `
              translate(${x}vw, ${y}vh)
              scale(${1 - p * 0.05})
            `,
            transition: "transform 0.25s ease-out",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video/home2025fhd.mp4" type="video/mp4" />
          </video>
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"
          style={{ opacity: heroOpacity }}
        />
      </div>

      {/* ========== HERO SECTION (unchanged) ========== */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden z-20"
      >
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-30"
          style={{
            opacity: heroOpacity,
            transform: `translateY(${scrollProgress * -50}px)`,
          }}
        >
          <div className="mb-8 h-px w-16 bg-white/60" />
          <h1 className="mb-4 text-white tracking-[0.4em] uppercase">
            Serenity Resort
          </h1>
          <div className="mb-6 h-px w-24 bg-white/40" />
          <p className="text-white/80 uppercase tracking-[0.2em]">
            A Mediterranean Sanctuary
          </p>
        </div>

        <div
          className="absolute bottom-8 left-1/2 z-40 -translate-x-1/2 flex flex-col items-center"
          style={{
            opacity: heroElementsOpacity,
            transition: "opacity 0.3s ease",
          }}
        >
          <span className="mb-2 text-xs font-light tracking-[0.2em] text-white/50 uppercase">
            Scroll down
          </span>
          <span className="text-xs font-light tracking-[0.1em] text-white/30 uppercase">
            to start the experience
          </span>
          <svg
            className="mt-4 h-10 w-4 text-white animate-bounce"
            fill="currentColor"
            viewBox="0 0 16.74 39.42"
          >
            <path d="M7.99,39.42c0.24,0.1,0.52,0.1,0.77,0c0.12-0.05,0.23-0.12,0.32-0.22l7.37-7.37c0.39-0.39,0.39-1.02,0-1.41 s-1.02-0.39-1.41,0l-5.66,5.66L9.37,1c0-0.55-0.45-1-1-1C8.09,0,7.84,0.11,7.66,0.29C7.48,0.47,7.37,0.72,7.37,1l0,35.08l-5.66-5.66 c-0.39-0.39-1.02-0.39-1.41,0s-0.39,1.02,0,1.41l7.37,7.37C7.75,39.29,7.87,39.37,7.99,39.42z" />
          </svg>
        </div>
      </section>

      {/* ========== CONTENT SECTION ========== */}
      <section
        ref={contentRef}
        className="relative min-h-screen bg-white z-20"
        style={{
          opacity: contentOpacity,
          transition: "opacity 0.5s ease",
        }}
      >
        <div className="px-6 py-24 lg:px-12">
          {/* LOOK BEYOND LIMITS Layout */}
          <div className="relative">
            {/* LOOK - Large Typography */}
            <div
              className="overflow-hidden"
              style={{
                opacity: showLook ? 1 : 0,
                transform: showLook ? "translateY(0)" : "translateY(60px)",
                transition: "opacity 1s ease, transform 1s ease",
              }}
            >
              <h2
                className="font-light uppercase leading-none tracking-wide"
                style={{
                  fontSize: "clamp(4rem, 15vw, 12rem)",
                  color: "#d4c4b0",
                }}
              >
                <span className="inline-block" style={{ transitionDelay: "0ms" }}>
                  L
                </span>
                <span className="inline-block" style={{ transitionDelay: "100ms" }}>
                  O
                </span>
                <span className="inline-block" style={{ transitionDelay: "200ms" }}>
                  O
                </span>
                <span className="inline-block" style={{ transitionDelay: "300ms" }}>
                  K
                </span>
              </h2>
            </div>

            {/* BEYOND LIMITS */}
            <div
              className="mt-[-2rem] ml-[15vw] overflow-hidden"
              style={{
                opacity: showLook ? 1 : 0,
                transform: showLook ? "translateY(0)" : "translateY(40px)",
                transition:
                  "opacity 1.2s ease 0.4s, transform 1.2s ease 0.4s",
              }}
            >
              <p
                className="font-light uppercase tracking-[0.15em]"
                style={{
                  fontSize: "clamp(1rem, 2.5vw, 2rem)",
                  color: "#8b7355",
                }}
              >
                <span className="inline-block">BEYOND</span>
                <span className="inline-block">LIMITS.</span>
              </p>
            </div>

            {/* Video Panel Position Placeholder - The video floats here */}
            <div
              className="absolute top-0 right-0 w-[40vw] h-[30vh] pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* Horizontal Image Strip */}
          <div
            className="mt-16 h-[20vh] w-full overflow-hidden flex"
            style={{
              opacity: showLook ? 1 : 0,
              transform: showLook ? "translateY(0)" : "translateY(60px)",
              transition: "opacity 1s ease 0.6s, transform 1s ease 0.6s",
            }}
          >
            <img
              src="./images/horizontal.jpg"
              alt="Amalfi Coast panorama"
              className="h-full w-[80%] object-cover"
              style={{
                transform: `translateX(${scrollProgress * -5}vw)`,
                transition: "transform 0.3s ease",
              }}
            />
            {/* FIND */}
            <div
              className="h-full flex items-end pr-[5] overflow-hidden"
              style={{
                opacity: showLook ? 1 : 0,
                transform: showLook ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 1s ease 0.8s, transform 1s ease 0.8s",
              }}
            >
              <span
                className="font-light uppercase tracking-wide !text-[100px]"
                style={{
                  color: "#d4c4b0",
                }}
              >
                FIND
              </span>
            </div>
          </div>

          {/* TRUE PERFECTION */}
          <div
            className="mt-4 text-center overflow-hidden"
            style={{
              opacity: showLook ? 1 : 0,
              transform: showLook ? "translateY(0)" : "translateY(60px)",
              transition: "opacity 1s ease 1s, transform 1s ease 1s",
            }}
          >
            <h2
              className="font-light uppercase tracking-[0.05em]"
              style={{
                fontSize: "clamp(2rem, 8vw, 7rem)",
                color: "#8b7355",
              }}
            >
              <span className="inline-block">TRUE</span>
              <span className="inline-block">PERFECTION.</span>
            </h2>
          </div>

          {/* Side Mail Icon */}
          <div
            className="fixed left-6 top-1/2 -translate-y-1/2 z-30"
            style={{
              opacity: showContent ? 0.5 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            <svg
              className="h-5 w-5 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Scroll Down Arrow */}
          <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30"
            style={{
              opacity: showContent ? 0.5 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            <svg
              className="h-5 w-5 text-stone-400 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}
