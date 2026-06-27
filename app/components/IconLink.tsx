"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function IconLink({
  icon: Icon,
  href,
  label,
}: {
  icon: React.ElementType;
  href: string;
  label: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onEnter = () =>
      gsap.to(el, { rotateZ: 360, duration: 0.6, ease: "power2.out", repeat: -1 });
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
    <a
      ref={ref}
      href={href}
      className="inline-block hover:opacity-70 transition-opacity"
      aria-label={label}
    >
      <Icon size={28} />
    </a>
  );
}
