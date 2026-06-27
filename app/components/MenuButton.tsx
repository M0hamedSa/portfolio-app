"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const topRef = useRef<SVGLineElement>(null);
  const midRef = useRef<SVGLineElement>(null);
  const botRef = useRef<SVGLineElement>(null);

  const pos = useRef({ x: 32, y: 32 });
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const moved = useRef(false);
  const preOpenX = useRef<number | null>(null);

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sectionLabel, setSectionLabel] = useState<string>(".home");

  const applyPos = (x: number, y: number) => {
    pos.current = { x, y };
    if (containerRef.current) {
      containerRef.current.style.left = `${x}px`;
      containerRef.current.style.top = `${y}px`;
    }
  };

  const updateMenuTheme = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;

    const aboutSection = document.getElementById("about");
    const projectsSection = document.getElementById("projects");
    const contactSection = document.getElementById("contact");

    const isOverSection = (section: HTMLElement | null) => {
      if (!section) return false;
      const secRect = section.getBoundingClientRect();
      return centerY >= secRect.top && centerY <= secRect.bottom;
    };

    if (isOverSection(aboutSection)) {
      setTheme("dark");
      setSectionLabel(".about");
    } else if (isOverSection(projectsSection)) {
      setTheme("dark");
      setSectionLabel(".projects");
    } else if (isOverSection(contactSection)) {
      setTheme("light");
      setSectionLabel(".contact");
    } else {
      setTheme("light");
      setSectionLabel(".home");
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isMobile = window.innerWidth < 550;
    const initialX = isMobile ? 16 : 32;
    const initialY = isMobile ? 76 : 24;
    applyPos(initialX, initialY);

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("li") || target.closest(".no-drag")) return;

      drag.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        originX: pos.current.x,
        originY: pos.current.y,
      };
      moved.current = false;
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.startX;
      const dy = e.clientY - drag.current.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;

      const isMobileSize = window.innerWidth < 550;
      const padd = isMobileSize ? 16 : 32;
      const minY = isMobileSize ? 76 : 24;

      const newX = Math.max(
        padd,
        Math.min(window.innerWidth - el.offsetWidth - padd, drag.current.originX + dx)
      );
      const newY = Math.max(
        minY,
        Math.min(window.innerHeight - el.offsetHeight - padd, drag.current.originY + dy)
      );
      applyPos(newX, newY);
      updateMenuTheme();
    };

    const onPointerUp = () => {
      drag.current.active = false;
    };

    const handleResize = () => {
      const isMobileSize = window.innerWidth < 550;
      const padd = isMobileSize ? 16 : 32;
      const minY = isMobileSize ? 76 : 24;
      const x = Math.max(
        padd,
        Math.min(window.innerWidth - el.offsetWidth - padd, pos.current.x)
      );
      const y = Math.max(
        minY,
        Math.min(window.innerHeight - el.offsetHeight - padd, pos.current.y)
      );
      applyPos(x, y);
      updateMenuTheme();
    };

    const handleScroll = () => {
      updateMenuTheme();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const timer = setTimeout(updateMenuTheme, 100);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [updateMenuTheme]);

  const isFirstRun = useRef(true);
  useEffect(() => {
    const container = containerRef.current;
    const top = topRef.current;
    const mid = midRef.current;
    const bot = botRef.current;
    const list = listRef.current;
    if (!container || !top || !mid || !bot || !list) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const items = list.querySelectorAll("li");
    const isMobile = window.innerWidth < 550;
    const collapsedWidth = isMobile ? 120 : 150;
    const padding = isMobile ? 16 : 32;

    if (open) {
      preOpenX.current = pos.current.x;

      list.style.width = "auto";
      list.style.paddingLeft = isMobile ? "8px" : "16px";
      list.style.paddingRight = isMobile ? "8px" : "16px";
      const naturalW = list.scrollWidth;
      list.style.width = "0px";
      list.style.paddingLeft = "0px";
      list.style.paddingRight = "0px";

      const targetWidth = collapsedWidth + naturalW;

      const maxLeft = window.innerWidth - targetWidth - padding;
      let targetLeft = pos.current.x;
      if (pos.current.x > maxLeft) {
        targetLeft = Math.max(padding, maxLeft);
      }

      gsap.to(container, {
        width: targetWidth,
        left: targetLeft,
        duration: 0.4,
        ease: "power3.out",
        onUpdate: () => {
          const currentLeft = parseFloat(container.style.left);
          if (!isNaN(currentLeft)) pos.current.x = currentLeft;
        },
      });

      gsap.fromTo(
        list,
        { width: 0, opacity: 0, paddingLeft: 0, paddingRight: 0 },
        {
          width: naturalW,
          opacity: 1,
          paddingLeft: isMobile ? 8 : 16,
          paddingRight: isMobile ? 8 : 16,
          duration: 0.4,
          ease: "power3.out",
          delay: 0.05,
        }
      );

      gsap.fromTo(
        items,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.08, ease: "power2.out", delay: 0.2 }
      );

      gsap.to(top, {
        rotation: 45,
        y: 6,
        transformOrigin: "50% 50%",
        duration: 0.35,
        ease: "power2.inOut",
      });
      gsap.to(mid, { scaleX: 0, opacity: 0, duration: 0.2, ease: "power2.in" });
      gsap.to(bot, {
        rotation: -45,
        y: -6,
        transformOrigin: "50% 50%",
        duration: 0.35,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(items, { opacity: 0, x: -10, duration: 0.15, stagger: 0.04, ease: "power2.in" });

      gsap.to(list, {
        width: 0,
        opacity: 0,
        paddingLeft: 0,
        paddingRight: 0,
        duration: 0.3,
        ease: "power3.inOut",
        delay: 0.1,
      });

      const restoreX =
        preOpenX.current !== null ? preOpenX.current : pos.current.x;
      const safeRestoreX = Math.max(
        padding,
        Math.min(window.innerWidth - collapsedWidth - padding, restoreX)
      );

      gsap.to(container, {
        width: collapsedWidth,
        left: safeRestoreX,
        duration: 0.35,
        ease: "power3.inOut",
        delay: 0.15,
        onUpdate: () => {
          const currentLeft = parseFloat(container.style.left);
          if (!isNaN(currentLeft)) pos.current.x = currentLeft;
        },
      });

      gsap.to(top, { rotation: 0, y: 0, duration: 0.35, ease: "power2.inOut" });
      gsap.to(mid, { scaleX: 1, opacity: 1, duration: 0.35, ease: "power2.inOut" });
      gsap.to(bot, { rotation: 0, y: 0, duration: 0.35, ease: "power2.inOut" });
    }
  }, [open]);

  const handleScroll = (id: string) => {
    const section = document.getElementById(id.toLowerCase());
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getMenuItems = (label: string) => {
    switch (label) {
      case ".about":
        return ["Home", "Projects", "Contact"];
      case ".projects":
        return ["Home", "About", "Contact"];
      case ".contact":
        return ["Home", "About", "Projects"];
      default:
        return ["About", "Projects", "Contact"];
    }
  };

  const themeClasses =
    theme === "dark"
      ? "bg-white/10 text-white border border-white/15 hover:bg-white/15 shadow-[0_4px_30px_rgba(255,255,255,0.05)]"
      : "bg-[#0a0a0a]/10 text-[#0a0a0a] border border-[#0a0a0a]/10 hover:bg-[#0a0a0a]/15 shadow-[0_4px_30px_rgba(0,0,0,0.03)]";

  const listItemClasses =
    theme === "dark"
      ? "text-white/60 hover:text-white"
      : "text-[#0a0a0a]/60 hover:text-[#0a0a0a]";

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: "32px",
        top: "32px",
        width:
          typeof window !== "undefined" && window.innerWidth < 550 ? 120 : 150,
        borderRadius: "24px",
        touchAction: "none",
        userSelect: "none",
        zIndex: 100,
        overflow: "hidden",
        cursor: "grab",
      }}
      className={`backdrop-blur-md font-(family-name:--font-exo2) flex flex-row items-center justify-between px-3 sm:px-5 py-2 sm:py-3 active:cursor-grabbing select-none transition-colors duration-300 ease-in-out ${themeClasses}`}
    >
      <span
        key={sectionLabel}
        className="nav-label-animate text-sm sm:text-base font-semibold tracking-wide whitespace-nowrap"
      >
        {sectionLabel}
      </span>

      <ul
        ref={listRef}
        style={{
          width: 0,
          opacity: 0,
          paddingLeft: 0,
          paddingRight: 0,
          overflow: "hidden",
        }}
        className="flex flex-row items-center gap-3 sm:gap-5"
      >
        {getMenuItems(sectionLabel).map((item) => (
          <li
            key={item}
            onClick={() => handleScroll(item)}
            className={`group relative py-1 cursor-pointer text-xs sm:text-sm font-medium tracking-wide transition-colors duration-300 whitespace-nowrap select-none ${listItemClasses}`}
          >
            <span className="inline-block group-hover:-translate-y-px transition-transform duration-300 ease-out">
              {item}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-current scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center" />
          </li>
        ))}
      </ul>

      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="no-drag cursor-pointer shrink-0 select-none p-1 hover:opacity-75 transition-opacity"
      >
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true" className="block">
          <line
            ref={topRef}
            x1="0"
            y1="2"
            x2="22"
            y2="2"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            ref={midRef}
            x1="0"
            y1="8"
            x2="22"
            y2="8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            ref={botRef}
            x1="0"
            y1="14"
            x2="22"
            y2="14"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
