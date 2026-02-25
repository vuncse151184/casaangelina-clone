"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

import CursorDot from "./components/CursorDot";
import VideoLayer from "./components/VideoLayer";
import HeroSection from "./components/HeroSection";
import ContentSection from "./components/ContentSection";
import HeaderBar from "./components/HeaderBar";
import Nav from "./components/Nav";
import EthosSection from "./components/EthosSection";
import DiningSection from "./components/DiningSection";
import ExperiencesSection from "./components/ExperiencesSection";
import InstagramSection from "./components/InstagramSection";
import FooterSection from "./components/FooterSection";

export default function CinematicHero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef(0);
  const directionRef = useRef<"down" | "up">("down");

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showLook, setShowLook] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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
    // SECTION SNAP
    // =========================
    const SNAP_THRESHOLD = 12;
    let isSnapping = false;

    const getContentEnd = () => {
      if (!contentRef.current) return window.innerHeight;
      return (
        contentRef.current.offsetTop +
        contentRef.current.offsetHeight -
        window.innerHeight
      );
    };

    const getSections = () => [0, getContentEnd()];

    const handleWheel = (e: WheelEvent) => {
      if (isSnapping) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < SNAP_THRESHOLD) return;

      e.preventDefault();

      const sections = getSections();
      const currentScroll = lenis.scroll;
      const direction = e.deltaY > 0 ? 1 : -1;

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
        easing: (t) => 1 - Math.pow(1 - t, 3),
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

  return (
    <div ref={containerRef} className="relative bg-white">
      {/* Global Cursor Dot */}
      <CursorDot visible={scrollProgress >= 1} />

      {/* Header */}
      <HeaderBar
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isDark={scrollProgress > 0.5}
      />

      {/* Navigation Overlay */}
      <Nav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Fixed Video Layer */}
      <VideoLayer
        scrollProgress={scrollProgress}
        videoRef={videoRef}
        directionRef={directionRef}
      />

      {/* Hero Section */}
      <HeroSection
        scrollProgress={scrollProgress}
        isMuted={isMuted}
        onMuteToggle={() => setIsMuted(!isMuted)}
        videoRef={videoRef}
      />

      {/* Content Section */}
      <ContentSection
        contentRef={contentRef}
        contentOpacity={contentOpacity}
        scrollProgress={scrollProgress}
        showContent={showContent}
        showLook={showLook}
      />

      {/* Ethos */}
      <EthosSection />

      {/* Dining */}
      <DiningSection />

      {/* Experiences */}
      <ExperiencesSection />

      {/* Instagram */}
      <InstagramSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
