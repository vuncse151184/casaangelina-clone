"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "./i18n/I18nContext";
import Lenis from "lenis";
import HeaderBar from "./components/HeaderBar";
import Nav from "./components/Nav";
import EthosSection from "./components/EthosSection";
import DiningSection from "./components/DiningSection";
import ExperiencesSection from "./components/ExperiencesSection";
import InstagramSection from "./components/InstagramSection";
import FooterSection from "./components/FooterSection";

export default function CinematicHero() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef(0);
  const directionRef = useRef<"down" | "up">("down");

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showLook, setShowLook] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(true);
  const targetPos = useRef({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const dotRef = useRef<HTMLDivElement>(null);
  const dotPosRef = useRef({ x: 0, y: 0 });

  // Smooth cursor lerp animation — direct DOM manipulation, no React re-renders
  useEffect(() => {
    let animationId: number;
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const animate = () => {
      cursorPosRef.current = {
        x: lerp(cursorPosRef.current.x, targetPos.current.x, 0.5),
        y: lerp(cursorPosRef.current.y, targetPos.current.y, 0.5),
      };
      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorPosRef.current.x}px`;
        cursorRef.current.style.top = `${cursorPosRef.current.y}px`;
      }
      animationId = requestAnimationFrame(animate);
    };

    if (isHovering) {
      animationId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationId);
  }, [isHovering]);

  // Global cursor dot animation — always runs
  useEffect(() => {
    let animationId: number;
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const handleMouseMove = (e: MouseEvent) => {
      dotPosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const dotPos = { x: 0, y: 0 };
    const animate = () => {
      dotPos.x = lerp(dotPos.x, dotPosRef.current.x, 0.15);
      dotPos.y = lerp(dotPos.y, dotPosRef.current.y, 0.15);
      if (dotRef.current) {
        dotRef.current.style.left = `${dotPos.x}px`;
        dotRef.current.style.top = `${dotPos.y}px`;
      }
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  const contentOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.3) * 2));

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 2.4,
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
      const heroTransitionHeight = window.innerHeight * 0.6;

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
        duration: 2.0,
        easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic — gentler
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
  const scrollT = p / ANCHOR_PROGRESS;

  // target rectangle (matches your red box)
  const FINAL_X = 18; // vw → right
  const FINAL_Y = 22; // vh → down

  const x = scrollT * (directionRef.current === "down" ? FINAL_X : -FINAL_X);
  const y = scrollT * FINAL_Y;

  const heroOpacity = Math.max(0, 1 - scrollProgress * 2);

  return (
    <div ref={containerRef} className="relative bg-white">
      {/* Global Cursor Dot — hidden on hero, visible on other sections */}
      <div
        ref={dotRef}
        className="fixed z-[9999] pointer-events-none"
        style={{
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
          opacity: scrollProgress >= 1 ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div className="w-2 h-2 rounded-full bg-[#8b7355]" />
      </div>
      {/* ========== HEADER BAR ========== */}
      <HeaderBar
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isDark={scrollProgress > 0.5}
      />

      {/* ========== NAVIGATION OVERLAY ========== */}
      <Nav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      {/* ========== FIXED VIDEO LAYER (ONLY PART CHANGED) ========== */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          opacity: scrollProgress >= 1 ? 0 : 1,
          visibility: scrollProgress >= 1 ? "hidden" : "visible",
          transition: "opacity 0.5s ease, visibility 0.5s ease",
        }}
      >
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
        className={`relative h-screen w-full overflow-hidden z-20 ${isHovering && heroOpacity > 0.3 ? "cursor-none" : ""}`}
        onMouseMove={(e) => { targetPos.current = { x: e.clientX, y: e.clientY }; }}
        onMouseEnter={(e) => {
          targetPos.current = { x: e.clientX, y: e.clientY };
          cursorPosRef.current = { x: e.clientX, y: e.clientY };
          setIsHovering(true);
        }}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => {
          setIsMuted(!isMuted);
          if (videoRef.current) {
            videoRef.current.muted = !isMuted;
          }
        }}
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
            {t("hero.title")}
          </h1>
          <div className="mb-6 h-px w-24 bg-white/40" />
          <p className="text-white/80 uppercase tracking-[0.2em]">
            {t("hero.subtitle")}
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
            {t("hero.scrollDown")}
          </span>
          <span className="text-xs font-light tracking-[0.1em] text-white/30 uppercase">
            {t("hero.scrollHint")}
          </span>
          <svg
            className="mt-4 h-10 w-4 text-white animate-bounce"
            fill="currentColor"
            viewBox="0 0 16.74 39.42"
          >
            <path d="M7.99,39.42c0.24,0.1,0.52,0.1,0.77,0c0.12-0.05,0.23-0.12,0.32-0.22l7.37-7.37c0.39-0.39,0.39-1.02,0-1.41 s-1.02-0.39-1.41,0l-5.66,5.66L9.37,1c0-0.55-0.45-1-1-1C8.09,0,7.84,0.11,7.66,0.29C7.48,0.47,7.37,0.72,7.37,1l0,35.08l-5.66-5.66 c-0.39-0.39-1.02-0.39-1.41,0s-0.39,1.02,0,1.41l7.37,7.37C7.75,39.29,7.87,39.37,7.99,39.42z" />
          </svg>
        </div>

        {/* Custom Speaker Cursor */}
        {isHovering && heroOpacity > 0.3 && (
          <div
            ref={cursorRef}
            className="fixed z-50"
            style={{
              left: 0,
              top: 0,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-12 h-12 rounded-full border border-white/60 bg-black/20 backdrop-blur-sm flex items-center cursor-pointer justify-center">
              {isMuted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              )}
            </div>
          </div>
        )}
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
          <div className="relative ">
            {/* LOOK - Large Typography */}
            <div
              className="overflow-hidden "
              style={{
                opacity: showLook ? 1 : 0,
                transform: showLook ? "translateY(0)" : "translateY(60px)",
                transition: "opacity 1s ease, transform 1s ease",
              }}
            >
              <h2
                className="font-light uppercase leading-none tracking-wide"
                style={{
                  fontSize: "13vw",
                  marginLeft: "8vw",
                  color: "#d4c4b0",
                }}
              >
                {t("content.look").split("").map((char, i) => (
                  <span key={i} className="inline-block !font-[300] text-[#EAE6E0] font-[Geometria]" style={{ transitionDelay: `${i * 100}ms` }}>
                    {char}
                  </span>
                ))}
              </h2>
            </div>

            {/* BEYOND LIMITS */}
            <div
              className="top-[calc(50%+2.3vw)] left-[24vw]  text-[2.5vw] absolute overflow-hidden"
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
                {t("content.beyondLimits").split(" ").map((word, i) => (
                  <span key={i} className="inline-block !mr-4">{word}</span>
                ))}
              </p>
            </div>

            {/* Video Panel Position Placeholder - The video floats here */}
            <div
              className="absolute top-10 right-20 w-[40vw] h-[30vh] pointer-events-none"
              aria-hidden="true"
            >
              <img src="./images/horizontal.jpg" />
            </div>
          </div>

          {/* Horizontal Image Strip */}
          <div
            className="mt-16 h-[20vh] !ml-10 w-full overflow-hidden flex"
            style={{
              opacity: showLook ? 1 : 0,
              transform: showLook ? "translateY(0)" : "translateY(60px)",
              transition: "opacity 1s ease 0.6s, transform 1s ease 0.6s",
            }}
          >
            <img
              src="./images/horizontal.jpg"
              alt="Amalfi Coast panorama"
              className="h-full  w-[80%] object-cover"
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
                {t("content.find").split(" ").map((word, i) => (
                  <span key={i} className={`inline-block ${i > 0 ? "pl-2" : ""}`}>{word}</span>
                ))}
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
              className="font-light uppercase tracking-[0.005em]"
              style={{
                fontSize: "clamp(2rem, 8vw, 7rem)",
                color: "#8b7355",
              }}
            >
              {t("content.truePerfection").split(" ").map((word, i) => (
                <span key={i} className={`inline-block ${i > 0 ? "!pl-[3vw]" : ""}`}>{word}</span>
              ))}
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
      </section >

      {/* ========== ETHOS SECTION ========== */}
      < EthosSection />

      {/* ========== DINING SECTION ========== */}
      < DiningSection />

      {/* ========== EXPERIENCES SECTION ========== */}
      < ExperiencesSection />

      {/* ========== INSTAGRAM SECTION ========== */}
      < InstagramSection />

      {/* ========== FOOTER SECTION ========== */}
      < FooterSection />
    </div >
  );
}
