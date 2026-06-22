"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiFileText, FiLinkedin, FiGithub, FiChevronDown } from "react-icons/fi";

function DownArrow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      y: 8,
      duration: 1,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (
    <div ref={ref} className="text-[#0a0a0a]/50">
      <FiChevronDown size={28} />
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-xl text-[#0a0a0a]/70 font-[family-name:var(--font-exo2)] flex items-center gap-2 pr-8">
      <p>Egypt/Giza</p>
      <p className="tabular-nums font-mono">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}</p>
    </div>
  );
}

function NavLink({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const line = document.createElement("span");
    line.className = "absolute left-0 bottom-0 h-[2px] bg-[#0a0a0a]";
    line.style.width = "0";
    el.appendChild(line);

    const onEnter = () => gsap.to(line, { width: "100%", duration: 0.3, ease: "power2.out" });
    const onLeave = () => gsap.to(line, { width: 0, duration: 0.3, ease: "power2.out" });

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      line.remove();
    };
  }, []);

  return <li ref={ref} className="relative inline-block cursor-pointer">{children}</li>;
}

function IconLink({ icon: Icon, href, label }: { icon: React.ElementType; href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onEnter = () => gsap.to(el, { rotateZ: 360, duration: 0.6, ease: "power2.out", repeat: -1 });
    const onLeave = () => {
      gsap.killTweensOf(el);
      gsap.to(el, { rotateZ: 0, duration: 0.3, ease: "power2.out" });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <a ref={ref} href={href} className="inline-block hover:opacity-70 transition-opacity" aria-label={label}>
      <Icon size={28} />
    </a>
  );
}

export default function Home() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(1);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    const half = el.scrollWidth / 2;

    const tween = gsap.to(el, {
      x: -half,
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    let lastWheel = 0;

    const onWheel = () => {
      const now = Date.now();
      if (now - lastWheel < 300) return;
      lastWheel = now;

      speedRef.current = Math.min(speedRef.current + 0.05, 2);
      tween.timeScale(speedRef.current);

      gsap.killTweensOf(speedRef);
      gsap.to(speedRef, {
        current: 1,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => tween.timeScale(speedRef.current),
      });
    };

    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      tween.kill();
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div className="bg-[#e1e0dc] flex flex-col">
      <section className="min-h-screen flex flex-col">
        <nav className="px-8 py-6 text-[#0a0a0a] font-[family-name:var(--font-exo2)] flex justify-between text-xl">
          <ul className="flex flex-col items-start gap-3 pt-10">
            <NavLink>Project</NavLink>
            <NavLink>About</NavLink>
            <NavLink>Contact</NavLink>
          </ul>
          <LiveClock />
        </nav>
        <main className="flex-1 flex items-center justify-center overflow-hidden">
          <div ref={marqueeRef} className="flex whitespace-nowrap">
            <h1 className="text-[300px] font-bold text-[#0a0a0a] font-[family-name:var(--font-orbitron)] shrink-0">Mohamed Saleh -</h1>
            <h1 className="text-[300px] font-bold text-[#0a0a0a] font-[family-name:var(--font-orbitron)] shrink-0">Mohamed Saleh -</h1>
          </div>
        </main>
        <div className="flex items-end justify-between px-8 pb-6">
          <div className="flex items-center gap-6 text-[#0a0a0a]">
            <IconLink icon={FiFileText} href="#" label="CV" />
            <IconLink icon={FiLinkedin} href="#" label="LinkedIn" />
            <IconLink icon={FiGithub} href="#" label="GitHub" />
          </div>
          <DownArrow />
          <div className="text-center text-[#0a0a0a] font-[family-name:var(--font-exo2)]">
            <p className="text-5xl font-semibold">//Web Developer</p>
            <p className="text-4xl">SW enginner</p>
          </div>
        </div>
      </section>
      <section className="min-h-screen bg-black flex items-center justify-center px-8">
        <div className="max-w-3xl text-white font-[family-name:var(--font-exo2)]">
          <h2 className="text-5xl font-bold mb-8">About</h2>
          <p className="text-xl leading-relaxed">
            Full-stack developer with a passion for building clean, performant web experiences.
            Specializing in modern JavaScript frameworks, pixel-perfect design, and seamless user interactions.
          </p>
        </div>
      </section>
    </div>
  );
}
