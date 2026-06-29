"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { FiFileText, FiLinkedin, FiGithub, FiMapPin } from "react-icons/fi";
import FluidCanvas from "@/app/components/FluidCanvas";
import DownArrow from "@/app/components/DownArrow";
import LiveClock from "@/app/components/LiveClock";
import IconLink from "@/app/components/IconLink";
import MenuButton from "@/app/components/MenuButton";
import ContactForm from "@/app/components/ContactForm";
import CopyEmail from "@/app/components/CopyEmail";
import ProjectCard from "@/app/components/ProjectCard";
import InvertedFluidCanvas from "@/app/components/InvertedFluidCanvas";
import { PROJECTS } from "@/app/data/projects";
export default function Home() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const homeSectionRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    // Each of the 4 identical clones occupies 25% of the total container width.
    // We shift currentX between 0 and -25 (one clone width), then wrap seamlessly.
    const CLONE_WIDTH = 25; // xPercent units per clone (100 / 4 clones)
    // Base scroll rate: one full clone width (25 xPercent) every 20 seconds = 1.25/s
    const BASE_RATE = CLONE_WIDTH / 20;

    let currentX = 0;       // Current xPercent position (always in (-25, 0])
    let currentSpeed = 1;   // Smoothed speed (1 = normal, positive = left, negative = right)
    let targetSpeed = 1;    // Speed we are lerping toward
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let idleTimeout: ReturnType<typeof setTimeout> | null = null;

    // Frame-by-frame ticker — drives position independently of any GSAP tween.
    // This makes reversing seamless: negative speed simply moves xPercent right.
    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap to avoid jumps after tab switch
      lastTime = now;

      // Lerp currentSpeed toward targetSpeed for smooth acceleration / deceleration
      currentSpeed += (targetSpeed - currentSpeed) * Math.min(dt * 8, 1);

      // Move: positive speed → left (negative xPercent), negative speed → right
      currentX -= currentSpeed * BASE_RATE * dt;

      // Seamless wrap for both directions
      if (currentX <= -CLONE_WIDTH) currentX += CLONE_WIDTH;
      if (currentX > 0) currentX -= CLONE_WIDTH;

      gsap.set(el, { xPercent: currentX });
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0); // Disable lag smoothing so dt stays honest

    const onScroll = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY;
      lastScrollY = scrollY;

      if (delta === 0) return;

      // Boost in the direction of scrolling
      targetSpeed = delta > 0 ? 5 : -5;

      // After 200ms of no scroll events, smoothly return to normal forward speed
      if (idleTimeout) clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        targetSpeed = 1;
      }, 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      gsap.ticker.remove(tick);
      if (idleTimeout) clearTimeout(idleTimeout);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <MenuButton />
      <div className="bg-[#ffffff] flex flex-col">
        <section ref={homeSectionRef} id="home" className="relative overflow-hidden min-h-screen flex flex-col select-none cursor-default">
          <FluidCanvas containerRef={homeSectionRef} />
          <nav className="px-8 py-6 text-[#0a0a0a] font-(family-name:--font-exo2) flex justify-end text-xl">
            <LiveClock />
          </nav>
          <main className="flex-1 flex items-center justify-center overflow-hidden">
            <div
              ref={marqueeRef}
              className="flex whitespace-nowrap"
              style={{ willChange: "transform" }}
            >
              <h1 className="text-[clamp(4.5rem,15vw,18.75rem)] leading-none font-bold text-[#0a0a0a] font-(family-name:--font-orbitron) shrink-0">
                {"Mohamed Saleh - "}
              </h1>
              <h1 className="text-[clamp(4.5rem,15vw,18.75rem)] leading-none font-bold text-[#0a0a0a] font-(family-name:--font-orbitron) shrink-0">
                {"Mohamed Saleh - "}
              </h1>
              <h1 className="text-[clamp(4.5rem,15vw,18.75rem)] leading-none font-bold text-[#0a0a0a] font-(family-name:--font-orbitron) shrink-0">
                {"Mohamed Saleh - "}
              </h1>
              <h1 className="text-[clamp(4.5rem,15vw,18.75rem)] leading-none font-bold text-[#0a0a0a] font-(family-name:--font-orbitron) shrink-0">
                {"Mohamed Saleh - "}
              </h1>
            </div>
          </main>
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 sm:gap-0 px-6 sm:px-8 pb-6">
            <div className="flex items-center gap-6 text-[#0a0a0a] order-2 sm:order-1">
              <IconLink icon={FiFileText} href="#" label="CV" />
              <IconLink icon={FiLinkedin} href="#" label="LinkedIn" />
              <IconLink icon={FiGithub} href="#" label="GitHub" />
            </div>
            <div className="hidden sm:block order-2">
              <DownArrow />
            </div>
            <div className="text-center sm:text-right text-[#0a0a0a] font-(family-name:--font-exo2) order-1 sm:order-3">
              <p className="text-3xl sm:text-4xl md:text-5xl font-semibold">{"//Web Developer"}</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#0a0a0a]/70 mt-1">SW engineer</p>
            </div>
          </div>
        </section>
        <section ref={aboutSectionRef} id="about" className="relative min-h-screen bg-black flex items-center justify-center px-6 sm:px-8 py-20 select-none cursor-default">
          <InvertedFluidCanvas containerRef={aboutSectionRef} />
          <div className="relative max-w-3xl text-white font-(family-name:--font-exo2)">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">About</h2>
            <p className="text-lg sm:text-xl leading-relaxed opacity-90">
              Full-stack developer with a passion for building clean, performant web experiences.
              Specializing in modern JavaScript frameworks, pixel-perfect design, and seamless user interactions.
            </p>
          </div>
        </section>

        <section id="projects" className="min-h-screen bg-black text-white px-6 sm:px-8 py-24 border-t border-white/10 flex flex-col justify-center">
          <div className="max-w-6xl mx-auto w-full font-(family-name:--font-exo2)">
            <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center sm:text-left">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {PROJECTS.map((project, idx) => (
                <ProjectCard project={project} key={idx} />
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="min-h-screen bg-[#e1e0dc] text-[#0a0a0a] px-6 sm:px-8 py-24 flex items-center justify-center">
          <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row justify-between gap-16 font-(family-name:--font-exo2)">
            <div className="flex-1 max-w-lg">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-center sm:text-left">Get in Touch</h2>
              <p className="text-lg sm:text-xl text-[#0a0a0a]/80 leading-relaxed mb-8 text-center sm:text-left">
                Have a project in mind, want to collaborate, or just want to say hello? Drop a message or copy my email address.
              </p>
              <div className="flex flex-col items-center sm:items-start space-y-4">
                <div className="flex items-center gap-3 text-[#0a0a0a]/80">
                  <FiMapPin size={22} className="shrink-0" />
                  <span className="text-lg font-medium">Cairo, Egypt</span>
                </div>
                <CopyEmail />
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
